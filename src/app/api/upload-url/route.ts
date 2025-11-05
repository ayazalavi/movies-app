import { NextResponse } from "next/server";
import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: Request) {
    try {
        const { contentType, ext } = await req.json();
        const bucket = process.env.S3_BUCKET!;
        const key = `posters/${crypto.randomUUID()}.${ext || "jpg"}`;

        const cmd = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            ContentType: contentType || "image/jpeg",
            ACL: "public-read", // or remove and use bucket policy
        });

        const url = await getSignedUrl(s3, cmd, { expiresIn: 60 }); // 1 min
        const publicUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        return NextResponse.json({ uploadUrl: url, key, publicUrl });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Failed to sign" }, { status: 500 });
    }
}
