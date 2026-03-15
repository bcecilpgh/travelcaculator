export function onRequestGet() {
  return new Response(JSON.stringify({ route: "test/hello works" }), {
    headers: { "Content-Type": "application/json" }
  });
}
