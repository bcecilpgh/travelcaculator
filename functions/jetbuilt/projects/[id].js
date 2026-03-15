// PATCH /jetbuilt/projects/:id — update Jetbuilt project custom fields
export async function onRequestPatch(context) {
  const id = context.params.id;
  const body = await context.request.text();

  try {
    const res = await fetch('https://app.jetbuilt.com/api/projects/' + id, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Token token=' + context.env.JETBUILT_API_KEY,
        'Accept': 'application/vnd.jetbuilt.v1',
        'Content-Type': 'application/json'
      },
      body
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Upstream request failed', message: e.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
