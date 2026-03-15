export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const query = url.searchParams.get('query') || '';
  const page = url.searchParams.get('page') || '1';
  const upstream = 'https://api.jetbuilt.com/api/projects?query=' + encodeURIComponent(query) + '&page=' + page + '&active=true';

  const info = { upstream: upstream, hasKey: !!context.env.JETBUILT_API_KEY };

  try {
    const res = await fetch(upstream, {
      headers: {
        'Authorization': 'Token token=' + context.env.JETBUILT_API_KEY,
        'Accept': 'application/vnd.jetbuilt.v1'
      }
    });
    info.status = res.status;
    info.statusText = res.statusText;
    const data = await res.text();
    info.bodyLength = data.length;
    info.bodyPreview = data.substring(0, 500);
    return new Response(JSON.stringify(info), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    info.error = e.message;
    info.stack = e.stack;
    return new Response(JSON.stringify(info), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
