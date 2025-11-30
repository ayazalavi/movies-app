import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class MoviesAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, 'MoviesVpc', {
            maxAzs: 2,
            natGateways: 0,
        });

        const postersBucket = s3.Bucket.fromBucketName(
            this,
            'PostersBucket',
            'movie-app-uploads-ayaz',
        );

        const webArtifactsBucket = s3.Bucket.fromBucketName(
            this,
            'WebArtifactsBucket',
            'movie-app-builds-ayaz'
        );

        const role = new iam.Role(this, 'MoviesInstanceRole', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        });


        postersBucket.grantReadWrite(role);
        webArtifactsBucket.grantReadWrite(role);
        role.addManagedPolicy(
            iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
        );


        const sg = new ec2.SecurityGroup(this, 'MoviesSecurityGroup', {
            vpc,
            allowAllOutbound: true,
            description: 'Allow HTTP and SSH to MoviesApp instance',
        });

        sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'HTTP');

        const instance = new ec2.Instance(this, 'MoviesInstance', {
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            associatePublicIpAddress: true,
            securityGroup: sg,
            role,
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: ec2.MachineImage.latestAmazonLinux2023(),
        });


        const userDataScript = [
            '#!/bin/bash',
            'set -e',
            'yum update -y',

            '# Install tools',
            'yum install -y git',
            'curl -fsSL https://rpm.nodesource.com/setup_lts.x | bash -',
            'yum install -y nodejs',
            'npm install -g pnpm pm2',
            'yum install -y nginx',

            'yum install -y awscli',

            '# Enable nginx',
            'systemctl enable nginx',
            'systemctl start nginx',

            '# Clone repo',
            'mkdir -p /srv',
            'cd /srv',
            'if [ ! -d "movies-app" ]; then',
            '  git clone --branch main https://github.com/ayazalavi/movies-app.git',
            'fi',
            'cd movies-app',

            '# Install dependencies',
            'pnpm install',

            '# --- ENV FILES ---',

            '# NestJS env (apps/api/.env)',
            'cat > apps/api/.env << \'EOF\'',
            'DATABASE_URL="postgresql://neondb_owner:npg_tziZ3ap6AHfm@ep-empty-mud-ad3v85mc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"',
            'AWS_REGION=us-east-1',
            'AWS_S3_BUCKET_NAME=movie-app-uploads-ayaz',
            '# leave keys empty on EC2, use IAM role instead',
            'AWS_ACCESS_KEY_ID=',
            'AWS_SECRET_ACCESS_KEY=',
            'JWT_SECRET="FFxNKGIw0R7Ge7J0L346C5I8fBjNIRrcPJv"',
            '# allow any origin or handle in code (recommended: default to *)',
            'FRONTEND_ORIGIN=*',
            'EOF',

            '# Next.js env (apps/web/.env.production)',
            'cat > apps/web/.env.production << \'EOF\'',
            'NEXT_PUBLIC_API_BASE=/api',
            'EOF',


            '# --- PM2 APPS ---',
            '# Start NestJS API on port 8080 (adjust if your code uses another port)',
            'cd /srv/movies-app/apps/api',
            'pnpm install',
            'pnpm build',
            'pm2 start "PORT=8080 pnpm start:prod" --name movies-api --time || pm2 restart movies-api',

            '# Start Next.js app on port 3000',
            'cd /srv/movies-app/apps/web',
            'pnpm install',
            'aws s3 cp s3://movie-app-builds-ayaz/web-build-latest.tar.gz /tmp/web-build.tar.gz',

            'mkdir -p .next',
            'rm -rf .next/*',
            'tar -xzf /tmp/web-build.tar.gz -C .',
            'pm2 start "pnpm start" --name movies-web --time || pm2 restart movies-web',
            'pm2 save',

            '# --- NGINX CONFIG ---',
            'cat > /etc/nginx/conf.d/movies-app.conf << \'EOF\'',
            'server {',
            '    listen 80;',
            '    server_name _;',
            '',
            '    location /api/ {',
            '        proxy_pass http://127.0.0.1:8080/;',
            '        proxy_http_version 1.1;',
            '        proxy_set_header Upgrade $http_upgrade;',
            '        proxy_set_header Connection "upgrade";',
            '        proxy_set_header Host $host;',
            '        proxy_cache_bypass $http_upgrade;',
            '    }',
            '',
            '    location / {',
            '        proxy_pass http://127.0.0.1:3000;',
            '        proxy_http_version 1.1;',
            '        proxy_set_header Upgrade $http_upgrade;',
            '        proxy_set_header Connection "upgrade";',
            '        proxy_set_header Host $host;',
            '        proxy_cache_bypass $http_upgrade;',
            '    }',
            '}',
            'EOF',
            '',
            '# Remove default nginx config if present',
            'rm -f /etc/nginx/conf.d/default.conf || true',
            'nginx -t && systemctl reload nginx',
        ].join('\n');

        instance.addUserData(userDataScript);

        const origin = new origins.HttpOrigin(
            instance.instancePublicDnsName,
            {
                protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
                originId: 'MoviesEc2Origin',

            },
        );

        const distribution = new cloudfront.Distribution(
            this,
            'MoviesDistribution',
            {
                defaultBehavior: {
                    origin,
                    allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                    viewerProtocolPolicy:
                        cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                },
            },
        );

        new cdk.CfnOutput(this, 'Ec2PublicDns', {
            value: instance.instancePublicDnsName,
        });

        new cdk.CfnOutput(this, 'CloudFrontDomain', {
            value: distribution.domainName,
        });

        new cdk.CfnOutput(this, 'PostersBucketName', {
            value: postersBucket.bucketName,
        });
    }
}
