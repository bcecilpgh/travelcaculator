// GET /ping — simple test endpoint
export function onRequestGet() {
  return new Response(JSON.stringify({ status: "ok", time: new Date().toISOString() }), {
    headers: { "Content-Type": "application/json" }
  });
}
