export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/add' && request.method === 'POST') {
      const { field1, field2 } = await request.json();
      const id = crypto.randomUUID();
      await env.DB.put(id, JSON.stringify({ field1, field2 }));
      return new Response('Saved', { status: 200 });
    }

    if (url.pathname === '/entries') {
      const list = await env.DB.list();
      const entries = [];
      for (const key of list.keys) {
        const value = await env.DB.get(key.name);
        entries.push(JSON.parse(value));
      }
      return new Response(JSON.stringify(entries), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default: serve index.html
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(await env.ASSETS.fetch(request));
    }

    return new Response('Not found', { status: 404 });
  }
};
