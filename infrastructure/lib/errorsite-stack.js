const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');

class ErrorsiteStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);
    createBucket(this);
  }
}

function createBucket(stack) {
  const bucket = new s3.Bucket(stack, 'WebsiteBucket', {
    bucketName: 'productsup-error-site',
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'index.html',
    publicReadAccess: true,
    removalPolicy: cdk.RemovalPolicy.RETAIN
  });
  new cdk.CfnOutput(stack, 'Bucket', {value: bucket.bucketName});
  new cdk.CfnOutput(stack, 'Bucket Url', {value: bucket.bucketWebsiteUrl});
  return bucket;
}

module.exports = {ErrorsiteStack};
