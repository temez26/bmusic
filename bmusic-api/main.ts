import { serve } from "./deps.ts";

const handler = (request: Request): Response => {
  const url = new URL(request.url);
  if (url.pathname === "/") {
    return new Response("Welcome to Bmusic API!", { status: 200 });
  }
  return new Response("Not Found", { status: 404 });
};

console.log("Listening on http://localhost:4000");
await serve(handler, { addr: ":4000" });
