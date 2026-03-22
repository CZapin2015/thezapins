const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method === 'GET') {
    try {
      const result = await env.DB.prepare(
        "SELECT key, value FROM site_settings"
      ).all();
      const settings = {};
      for (const row of result.results) {
        settings[row.key] = row.value === 'true';
      }
      return json(settings);
    } catch (err) {
      return json({ error: 'Failed to load settings' }, 500);
    }
  }

  if (request.method === 'PUT') {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (!key || key !== env.ADMIN_KEY) {
      return json({ error: 'Unauthorized' }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    const { setting, value } = body;
    if (!setting || typeof value !== 'boolean') {
      return json({ error: 'setting (string) and value (boolean) required' }, 400);
    }

    try {
      await env.DB.prepare(
        "INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)"
      ).bind(setting, value ? 'true' : 'false').run();
      return json({ success: true, [setting]: value });
    } catch (err) {
      return json({ error: 'Failed to update setting' }, 500);
    }
  }

  return json({ error: 'Method not allowed' }, 405);
}
