#!/bin/bash
git pull
rm -r dist/*
yarn
yarn generate
aws s3 sync dist/ s3://staging.productsup.com/ --delete --cache-control max-age=300
aws s3 cp s3://staging.productsup.com/ s3://staging.productsup.com/ --recursive --exclude "*" --include "*.html" --metadata-directive REPLACE --cache-control max-age=no-cache --content-type text/html
aws cloudfront create-invalidation --distribution-id E2R0KX3HANUUGB --paths "/*"
