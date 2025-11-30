#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MoviesAppStack } from '../lib/movies-stack';

const app = new cdk.App();

new MoviesAppStack(app, 'MoviesAppStack', {
  env: {
    account: '702949239013',
    region: 'us-east-1',
  },
});
