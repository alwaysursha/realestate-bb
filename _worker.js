export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle static files
    if (url.pathname.match(/\.(jpg|jpeg|gif|png|ico|css|js|woff2)$/)) {
      const response = await env.ASSETS.fetch(request);
      if (response.ok) {
        // Add caching headers
        const headers = new Headers(response.headers);
        headers.set('cache-control', 'public, max-age=31536000, immutable');
        return new Response(response.body, {
          status: response.status,
          headers
        });
      }
    }

    // Serve index.html for all other routes
    try {
      const response = await env.ASSETS.fetch(`${url.origin}/index.html`);
      const headers = new Headers(response.headers);
      headers.set('content-type', 'text/html;charset=UTF-8');
      return new Response(response.body, {
        status: 200,
        headers
      });
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  }
} 