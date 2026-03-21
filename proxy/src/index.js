// Eggologic CORS Proxy — Cloudflare Worker
// Forwards requests to guardianservice.app with CORS headers.

const GUARDIAN_ORIGIN = "https://guardianservice.app";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Build Guardian URL (same path + query string)
    const url = new URL(request.url);
    const guardianUrl = GUARDIAN_ORIGIN + url.pathname + url.search;

    // Forward the request
    const guardianResponse = await fetch(guardianUrl, {
      method: request.method,
      headers: {
        "Content-Type": request.headers.get("Content-Type") || "application/json",
        "Authorization": request.headers.get("Authorization") || "",
      },
      body: request.method !== "GET" && request.method !== "HEAD"
        ? await request.text()
        : undefined,
    });

    // Clone response and add CORS headers
    const responseHeaders = new Headers(guardianResponse.headers);
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      responseHeaders.set(key, value);
    }

    return new Response(guardianResponse.body, {
      status: guardianResponse.status,
      statusText: guardianResponse.statusText,
      headers: responseHeaders,
    });
  },
};
