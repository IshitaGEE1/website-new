#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CertificateStack } = require('../lib/certificate-stack');
const { WebsiteStack } = require("../lib/website-stack");
const { ErrorsiteStack } = require("../lib/errorsite-stack");

const app = new cdk.App();

new CertificateStack(app, "CertificateStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1"
  }
});

new WebsiteStack(app, "WebsiteStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "eu-central-1"
  },
  certificateArn: 'arn:aws:acm:us-east-1:635032590663:certificate/666d30e9-5cf7-47ec-b8f9-7851f2f30179',
  domain: 'www.productsup.com',
  basicAuth: false,
  distId: 'SiteDistributionCFDistributionEFC15E16'
});

new WebsiteStack(app, "StageStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "eu-central-1"
  },
  certificateArn: 'arn:aws:acm:us-east-1:635032590663:certificate/666d30e9-5cf7-47ec-b8f9-7851f2f30179',
  domain: 'staging.productsup.com',
  basicAuth: true,
  distId: 'SiteDistributionCFDistributionEFC15E16'
});

new ErrorsiteStack(app, "ErrorsiteStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "eu-central-1"
  }
});
