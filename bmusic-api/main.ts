import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const handler = (request: Request): Response => {
  const url = new URL(request.url);
  if (url.pathname === "/") {
    return new Response("Welcome to Bmusic API!", { status: 200 });
  }
  return new Response("Not Found", { status: 404 });
};

console.log("Listening on http://localhost:4000");
await serve(handler, { addr: ":4000" });
