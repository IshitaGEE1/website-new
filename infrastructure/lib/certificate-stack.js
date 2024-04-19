const cdk = require('@aws-cdk/core');
const acm = require('@aws-cdk/aws-certificatemanager');

class CertificateStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    // TLS Certificate
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: '*.productsup.com',
      subjectAlternativeNames: ['productsup.com'],
      validation: acm.CertificateValidation.fromDns()
    });
    new cdk.CfnOutput(this, 'CertificateArn', {value: certificate.certificateArn});

    this.certificateArn = certificate.certificateArn;
  }
}

module.exports = {CertificateStack}
