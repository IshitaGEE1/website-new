#!/bin/bash
git pull
yarn
yarn generate
aws s3 sync dist/ s3://www.productsup.com/ --delete --cache-control max-age=300
aws s3 cp s3://www.productsup.com/ s3://www.productsup.com/ --recursive --exclude "*" --include "*.html" --metadata-directive REPLACE --cache-control max-age=no-cache --content-type text/html
aws cloudfront create-invalidation --distribution-id E33MAX6B2RMNM3 --paths "/*"
