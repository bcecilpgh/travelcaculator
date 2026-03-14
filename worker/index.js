export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // GET /jetbuilt/projects?query=X&page=N — search projects
    if (request.method === 'GET' && path === '/jetbuilt/projects') {
      const query = url.searchParams.get('query') || '';
      const page = url.searchParams.get('page') || '1';
      const upstream = `https://api.jetbuilt.com/api/projects?query=${encodeURIComponent(query)}&page=${page}&active=true`;
      return proxy(upstream, 'GET', null, env);
    }

    // PATCH /jetbuilt/projects/:id — update project custom fields
    const patchMatch = path.match(/^\/jetbuilt\/projects\/(\d+)$/);
    if (request.method === 'PATCH' && patchMatch) {
      const id = patchMatch[1];
      const body = await request.text();
      return proxy(`https://api.jetbuilt.com/api/projects/${id}`, 'PATCH', body, env);
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders() });
  }
};

async function proxy(upstream, method, body, env) {
  const headers = {
    'Authorization': `Token token=${env.JETBUILT_API_KEY}`,
    'Accept': 'application/vnd.jetbuilt.v1',
    'Content-Type': 'application/json'
  };
  const opts = { method, headers };
  if (body) opts.body = body;

  try {
    const res = await fetch(upstream, opts);
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Upstream request failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
