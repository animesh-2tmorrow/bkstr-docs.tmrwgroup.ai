#!/usr/bin/env bash
# bkstr-docs deploy — build the static export, sync it to S3, invalidate
# CloudFront. Run from the repo root: `npm run deploy` or `bash deploy/deploy.sh`.
#
# Prerequisites:
#   - AWS CLI configured with the default profile (account 049405321468).
#   - Dependencies installed (`npm install`).
#
# Infrastructure (provisioned in Phase C):
#   - S3 bucket        bkstr-docs-site-049405321468  (private, OAC-only)
#   - CloudFront dist  E2HM3KB7UUXCJR  ->  docs.bkstr.tmrwgroup.ai
set -euo pipefail

BUCKET=bkstr-docs-site-049405321468
DISTRIBUTION=E2HM3KB7UUXCJR

cd "$(dirname "$0")/.."

echo "== building static export (next build) =="
npm run build

echo "== syncing out/ to s3://${BUCKET} (--delete prunes removed pages) =="
aws s3 sync out/ "s3://${BUCKET}/" --delete

echo "== invalidating CloudFront distribution ${DISTRIBUTION} =="
aws cloudfront create-invalidation \
  --distribution-id "${DISTRIBUTION}" \
  --paths "/*" \
  --query 'Invalidation.{Id:Id,Status:Status}' --output table

echo "== deploy complete — https://docs.bkstr.tmrwgroup.ai =="
