const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const cloudfront = require('@aws-cdk/aws-cloudfront');
const lambda = require('@aws-cdk/aws-lambda');
const path = require('path');
const cert = require('@aws-cdk/aws-certificatemanager');
const origins = require('@aws-cdk/aws-cloudfront-origins');

class WebsiteStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const viewerRequestFunction = createViewerRequestFunction(this, props.basicAuth === true);
    const originResponseFunction = createOriginResponseFunction(this);

    const siteBucket = createBucket(this, props.domain);
    createCloudfontDistribution(
      this,
      props.domain,
      props.certificateArn,
      viewerRequestFunction,
      originResponseFunction,
      siteBucket,
      props.distId);

    new cdk.CfnOutput(this, 'Site', {value: 'https://' + props.domain});
  }
}

function createBucket(stack, domain) {
  const bucket = new s3.Bucket(stack, 'WebsiteBucket', {
    bucketName: domain,
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'error/index.html',
    publicReadAccess: true,
    removalPolicy: cdk.RemovalPolicy.RETAIN
  });
  new cdk.CfnOutput(stack, 'Bucket', {value: bucket.bucketName});
  new cdk.CfnOutput(stack, 'Bucket Url', {value: bucket.bucketWebsiteUrl});
  return bucket;
}

function createCloudfontDistribution(stack, domain, certArn, viewerRequestFunction, originResponseFunction, siteBucket, distId) {
  const errorBucket = s3.Bucket.fromBucketName(stack, 'Error Bucket', 'productsup-error-site');
  const certificate = cert.Certificate.fromCertificateArn(stack, 'Cert', certArn);
  const cloudfrontDistribution = new cloudfront.Distribution(stack, 'Site Distribution', {
    certificate: certificate,
    domainNames: [domain],
    defaultBehavior: {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT_AND_SECURITY_HEADERS,
      edgeLambdas: [
        {
          eventType: cloudfront.LambdaEdgeEventType.ORIGIN_RESPONSE,
          functionVersion: originResponseFunction.currentVersion
        },
        {
          eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
          functionVersion: viewerRequestFunction.currentVersion
        }
      ],
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      origin: new origins.S3Origin(siteBucket)
    },
    errorResponses: [
      {
        httpStatus: 400,
        responsePagePath: '/err/index.html',
        responseHttpStatus: 404
      },
      {
        httpStatus: 403,
        responseHttpStatus: 404,
        responsePagePath: '/err/index.html'
      },
      {
        httpStatus: 405,
        responseHttpStatus: 404,
        responsePagePath: '/err/index.html'
      },
      {
        httpStatus: 414,
        responseHttpStatus: 404,
        responsePagePath: '/err/index.html'
      },
      {
        httpStatus: 416,
        responseHttpStatus: 404,
        responsePagePath: '/err/index.html'
      },
      {
        httpStatus: 500,
        responseHttpStatus: 404,
        responsePagePath: '/err/index.html'
      },
      {
        httpStatus: 501,
        responseHttpStatus: 404,
        responsePagePath: '/err/index.html'
      },
      {
        httpStatus: 502,
        responseHttpStatus: 404,
        responsePagePath: '/err/index.html'
      },
      {
        httpStatus: 503,
        responseHttpStatus: 404,
        responsePagePath: '/err/index.html'
      },
      {
        httpStatus: 504,
        responseHttpStatus: 404,
        responsePagePath: '/err/index.html'
      }
    ]
  });

  cloudfrontDistribution.addBehavior('/err/*', new origins.S3Origin(errorBucket), {
    allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
  });

  const gatewayUrl = 'builder-lb-507080304.eu-central-1.elb.amazonaws.com';
  cloudfrontDistribution.addBehavior('/api/**', new origins.HttpOrigin(gatewayUrl, {
    protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY
  }), {
    allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED
  });

  cloudfrontDistribution.node.defaultChild.overrideLogicalId(distId);

  new cdk.CfnOutput(stack, 'DistributionId', {value: cloudfrontDistribution.distributionId});
  return cloudfrontDistribution;
}

function createViewerRequestFunction(stack, basicAuth) {
  return new cloudfront.experimental.EdgeFunction(stack, 'ViewerRequestFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: basicAuth ? 'index.handlerWithBasicAuth' : 'index.handler',
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas', 'viewer-request')),
  });
}

function createOriginResponseFunction(stack) {
  return new cloudfront.experimental.EdgeFunction(stack, "OriginResponseFunction", {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas', 'origin-response'))
  });
}

module.exports = {WebsiteStack};
