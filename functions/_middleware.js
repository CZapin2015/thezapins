// Keep the staging/preview aliases (*.pages.dev) out of search engines so they
// can't compete with thezapins.com as duplicate content. _headers can't vary
// by host, so this middleware stamps the header instead.
export async function onRequest(context) {
  const response = await context.next();
  const host = new URL(context.request.url).hostname;
  if (host.endsWith('.pages.dev')) {
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
  return response;
}
