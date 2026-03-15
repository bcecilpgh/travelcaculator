export async function onRequestGet(context) {
  try {
    const res = await fetch('https://httpbin.org/get');
    const data = await res.text();
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({
      error: true,
      name: e.name,
      message: e.message
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
