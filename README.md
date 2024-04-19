# Productsup

[![publish](https://github.com/productsupcom/website/actions/workflows/publish.yml/badge.svg?branch=master&event=repository_dispatch)](https://github.com/productsupcom/website/actions/workflows/publish.yml)

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# generate static project
$ yarn generate
```

## Deploying Infrastructure

### Required Dependencies

1. AWS CLI
2. Node (14) / npm
3. CDK CLI

Install the AWS CLI with the following instructions: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html

```bash
# Get an AWS-IAM User with API-Key and Secret-Key
$ # there is no script for that, ask the admin or so

# configure AWS-CLI
$ aws configure
# and follow instructions...

# Install the AWS-CLI
$ npm install -g aws-cdk
```

CDK Manual: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html

### See Changes
```bash
# go to the infrastructure directory
$ cd infrastructure

# update dependencies (if not done before)
$ npm i

# list changes of all stacks
$ cdk diff

# list changes of a certain stack
$ cdk diff <stack-name>
```

### Deploy Stacks
```bash
# go to the infrastructure directory
$ cd infrastructure

# update dependencies (if not done before)
$ npm i

# deploy a certain stack
$ cdk deploy <stack-name: CertificateStack|WebsiteStack|StageStack>
```

### Stacks

* **CertificateStack**: Contains the certificate for *.productsup.com. Is on a separate stack,
 because it needs to be hosted on us-east-1
* **WebsiteStack**: Contains the rest of the neccessary resources like the cloudfront stuff for the Domain **https://www.productsup.com**
* **StageStack**: Same as Website stack, just with a password protection and for the domain **https://stage.productsup.com**

## Deploying Site to Bucket

For www.productsup.com:
```bash
# Generate Site (may take a while, get a coffee)
$ yarn generate

# Upload generated dist directory to S3
$ aws s3 sync dist/ s3://www.productsup.com/ --delete --cache-control max-age=300

# Update Cache Headers of the HTML documents
$ aws s3 cp s3://www.productsup.com/ s3://www.productsup.com/ --recursive --exclude "*" --include "*.html" --metadata-directive REPLACE --cache-control max-age=no-cache --content-type text/html

# Trigger a cashe reset of the Cloudfont instance
$ aws cloudfront create-invalidation --distribution-id E33MAX6B2RMNM3 --paths "/*"
```

For stage.productsup.com:
```bash
# Generate Site (may take a while, get a coffee)
$ yarn generate

# Upload generated dist directory to S3
$ aws s3 sync dist/ s3://stage.productsup.com/ --delete --cache-control max-age=300

# Update Cache Headers of the HTML documents
$ aws s3 cp s3://stage.productsup.com/ s3://stage.productsup.com/ --recursive --exclude "*" --include "*.html" --metadata-directive REPLACE --cache-control max-age=no-cache --content-type text/html

# Trigger a cashe reset of the Cloudfont instance
$ aws cloudfront create-invalidation --distribution-id E2R0KX3HANUUGB --paths "/*"
```
