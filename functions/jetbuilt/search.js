// Minimal test — no upstream fetch, just echo back the query
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const query = url.searchParams.get('query') || '';
  const hasKey = !!context.env.JETBUILT_API_KEY;

  return new Response(JSON.stringify({
    route: 'jetbuilt/search',
    query: query,
    hasApiKey: hasKey
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
