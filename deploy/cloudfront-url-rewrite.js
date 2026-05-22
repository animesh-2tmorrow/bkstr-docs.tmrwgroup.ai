// CloudFront viewer-request function for the bkstr-docs distribution.
// Deployed as the CloudFront Function `bkstr-docs-url-rewrite` (runtime
// cloudfront-js-2.0). This file is the source of record — update it here,
// then `aws cloudfront update-function` + `publish-function`.
//
// Responsibilities:
//   - 301 the root to /docs.
//   - Pass /api/* through untouched (the static Orama search index lives
//     at the extensionless path /api/search — it must NOT get .html).
//   - Append .html to extensionless clean URLs (the Next.js static export
//     is flat-file: /docs/agent/cli -> docs/agent/cli.html).
//   - Leave asset requests (.png, .js, .css, .md, ...) alone.
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Root -> /docs (301).
  if (uri === '/' || uri === '/index.html') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: '/docs' } },
    };
  }

  // API routes are extensionless static files (the search index at
  // /api/search) — serve them as-is, never append .html.
  if (uri.indexOf('/api/') === 0) {
    return request;
  }

  // Strip a trailing slash so /docs/ resolves the same as /docs.
  if (uri.length > 1 && uri.charAt(uri.length - 1) === '/') {
    uri = uri.substring(0, uri.length - 1);
  }

  // Clean URLs have no extension in the last path segment -> append .html.
  var lastSegment = uri.substring(uri.lastIndexOf('/') + 1);
  if (lastSegment.indexOf('.') === -1) {
    uri = uri + '.html';
  }

  request.uri = uri;
  return request;
}
