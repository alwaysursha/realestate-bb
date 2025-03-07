export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // First try to serve the exact requested path
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.ok) {
        const headers = new Headers(response.headers);
        
        // Add caching for static assets
        if (url.pathname.match(/\.(jpg|jpeg|gif|png|ico|css|js|woff2)$/)) {
          headers.set('cache-control', 'public, max-age=31536000, immutable');
        }
        
        // Add security headers
        headers.set('X-Content-Type-Options', 'nosniff');
        headers.set('X-Frame-Options', 'DENY');
        headers.set('X-XSS-Protection', '1; mode=block');
        headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        return new Response(response.body, {
          status: response.status,
          headers
        });
      }
    } catch (e) {
      // If the exact path fails, continue to index.html
    }

    // For any other route, serve index.html
    try {
      const response = await env.ASSETS.fetch(`${url.origin}/index.html`);
      const headers = new Headers(response.headers);
      headers.set('content-type', 'text/html;charset=UTF-8');
      
      // Add security headers
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('X-XSS-Protection', '1; mode=block');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      return new Response(response.body, {
        status: 200,
        headers
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
} 