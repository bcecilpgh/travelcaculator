export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const query = url.searchParams.get('query') || '';
  const page = url.searchParams.get('page') || '1';
  const upstream = 'https://api.jetbuilt.com/api/projects?query=' + encodeURIComponent(query) + '&page=' + page + '&active=true';

  try {
    const res = await fetch(upstream, {
      headers: {
        'Authorization': 'Token token=' + context.env.JETBUILT_API_KEY,
        'Accept': 'application/vnd.jetbuilt.v1'
      }
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({
      error: true,
      name: e.name,
      message: e.message,
      stack: e.stack
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
