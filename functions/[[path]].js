export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  // First try to serve the exact requested path
  try {
    // Try to serve the requested file directly
    const response = await env.ASSETS.fetch(request);
    if (response.ok) {
      const headers = new Headers(response.headers);
      
      // Add caching for static assets
      if (url.pathname.match(/\.(jpg|jpeg|gif|png|ico|css|js|woff2)$/)) {
        headers.set('cache-control', 'public, max-age=31536000, immutable');
      }
      
      return new Response(response.body, {
        status: response.status,
        headers
      });
    }
  } catch (e) {
    // Continue to index.html if file not found
  }

  // For any other route, serve index.html
  try {
    const response = await env.ASSETS.fetch(`${url.origin}/index.html`);
    return new Response(response.body, {
      status: 200,
      headers: {
        'content-type': 'text/html;charset=UTF-8'
      }
    });
  } catch (e) {
    return new Response('Not Found', { 
      status: 404,
      headers: {
        'content-type': 'text/plain'
      }
    });
  }
} 