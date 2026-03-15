export function onRequestGet() {
  return new Response(JSON.stringify({ route: "jetbuilt/test works" }), {
    headers: { "Content-Type": "application/json" }
  });
}
