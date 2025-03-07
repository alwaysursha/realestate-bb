export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Add security headers
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
} 