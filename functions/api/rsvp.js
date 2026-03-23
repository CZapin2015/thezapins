// Levenshtein distance - case-insensitive fuzzy matching
function levenshtein(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

const MATCH_THRESHOLD = 3;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

// POST /api/rsvp - Submit an RSVP
async function handlePost(request, env) {
  // Check if RSVPs are open
  try {
    const setting = await env.DB.prepare(
      "SELECT value FROM site_settings WHERE key = 'rsvp_open'"
    ).first();
    if (!setting || setting.value !== 'true') {
      return json({ error: 'RSVPs are not open yet.' }, 403);
    }
  } catch {
    // If settings table doesn't exist, block by default
    return json({ error: 'RSVPs are not open yet.' }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { full_name, email, attending, guest_count, meal_preference, dietary_notes, event_welcome, event_wedding, event_brunch, guest_name, guest_meal_preference, guest_dietary_notes } = body;

  if (!full_name || !full_name.trim()) {
    return json({ error: 'full_name is required' }, 400);
  }
  if (!attending || !['accepted', 'declined'].includes(attending)) {
    return json({ error: 'attending must be "accepted" or "declined"' }, 400);
  }

  const trimmedName = full_name.trim();

  // Fuzzy match against guest list
  let matchedGuestId = null;
  let matchedGuestName = null;

  try {
    const guests = await env.DB.prepare('SELECT id, full_name FROM wedding_guests').all();

    let bestDistance = Infinity;
    let bestGuest = null;

    for (const guest of guests.results) {
      const dist = levenshtein(trimmedName, guest.full_name);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestGuest = guest;
      }
    }

    if (bestGuest && bestDistance <= MATCH_THRESHOLD) {
      matchedGuestId = bestGuest.id;
      matchedGuestName = bestGuest.full_name;
    }
  } catch (err) {
    console.error('Guest matching failed:', err.message);
  }

  // Insert the RSVP
  try {
    await env.DB.prepare(
      `INSERT INTO wedding_rsvps (full_name, email, attending, guest_count, meal_preference, dietary_notes, event_welcome, event_wedding, event_brunch, matched_guest_id, matched_guest_name, guest_name, guest_meal_preference, guest_dietary_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        trimmedName,
        email || null,
        attending,
        guest_count || 1,
        meal_preference || null,
        dietary_notes || null,
        event_welcome ? 1 : 0,
        event_wedding ? 1 : 0,
        event_brunch ? 1 : 0,
        matchedGuestId,
        matchedGuestName,
        guest_name || null,
        guest_meal_preference || null,
        guest_dietary_notes || null
      )
      .run();
  } catch (err) {
    console.error('RSVP insert failed:', err.message);
    return json({ error: 'Failed to save RSVP' }, 500);
  }

  // Send RSVP data to Google Sheet in real-time
  const SHEET_WEBHOOK = env.GOOGLE_SHEET_WEBHOOK || 'https://script.google.com/macros/s/AKfycbxlk-rXDtsZlnXGsTNkktUJjodWnkrbLIzTmtzJDX9rPtpObb6LCjEqbxVV7dLKy3Jf/exec';
  try {
    await fetch(SHEET_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: trimmedName, email: email || '', attending,
        event_welcome: !!event_welcome, event_wedding: !!event_wedding, event_brunch: !!event_brunch,
        guest_count: guest_count || 1, meal_preference: meal_preference || '',
        dietary_notes: dietary_notes || '', guest_name: guest_name || '',
        guest_meal_preference: guest_meal_preference || '', guest_dietary_notes: guest_dietary_notes || ''
      }),
    });
  } catch {}

  return json({
    success: true,
    matched_guest: matchedGuestName,
    attending,
  });
}

// GET /api/rsvp?key=ADMIN_KEY - Admin: list all RSVPs + missing guests
async function handleGet(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  if (!key || key !== env.ADMIN_KEY) {
    return json({ error: 'Unauthorized' }, 401);
  }

  try {
    const rsvps = await env.DB.prepare(
      `SELECT r.*, g.group_name, g.expected_party_size
       FROM wedding_rsvps r
       LEFT JOIN wedding_guests g ON r.matched_guest_id = g.id
       ORDER BY r.created_at DESC`
    ).all();

    const missingGuests = await env.DB.prepare(
      `SELECT g.*
       FROM wedding_guests g
       LEFT JOIN wedding_rsvps r ON r.matched_guest_id = g.id
       WHERE r.id IS NULL
       ORDER BY g.full_name`
    ).all();

    return json({
      rsvps: rsvps.results,
      missing_guests: missingGuests.results,
    });
  } catch (err) {
    console.error('Admin fetch failed:', err.message);
    return json({ error: 'Database query failed' }, 500);
  }
}

// DELETE /api/rsvp?key=ADMIN_KEY&id=RSVP_ID - Admin: delete an RSVP
async function handleDelete(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  const id = url.searchParams.get('id');

  if (!key || key !== env.ADMIN_KEY) {
    return json({ error: 'Unauthorized' }, 401);
  }

  if (!id) {
    return json({ error: 'id parameter is required' }, 400);
  }

  try {
    const result = await env.DB.prepare('DELETE FROM wedding_rsvps WHERE id = ?').bind(id).run();
    if (result.meta.changes === 0) {
      return json({ error: 'RSVP not found' }, 404);
    }
    return json({ success: true, deleted_id: id });
  } catch (err) {
    console.error('Delete failed:', err.message);
    return json({ error: 'Failed to delete RSVP' }, 500);
  }
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method === 'POST') {
    return handlePost(request, env);
  }

  if (request.method === 'GET') {
    return handleGet(request, env);
  }

  if (request.method === 'DELETE') {
    return handleDelete(request, env);
  }

  return json({ error: 'Method not allowed' }, 405);
}
