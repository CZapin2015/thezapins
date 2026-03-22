export async function onRequest() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RSVP Admin - The Zapins</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Montserrat', sans-serif;
      background: #0a1628;
      color: #e8e0d4;
      min-height: 100vh;
      padding: 2rem 1rem;
    }

    h1, h2, h3 {
      font-family: 'Cormorant Garamond', serif;
      color: #c9a84c;
    }

    h1 {
      text-align: center;
      font-size: 2.4rem;
      margin-bottom: 2rem;
      letter-spacing: 0.05em;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid rgba(201, 168, 76, 0.3);
      padding-bottom: 0.5rem;
    }

    .container {
      max-width: 960px;
      margin: 0 auto;
    }

    /* Login */
    #login-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin-top: 4rem;
    }

    #login-section input {
      font-family: 'Montserrat', sans-serif;
      padding: 0.75rem 1.25rem;
      border: 1px solid rgba(201, 168, 76, 0.4);
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      color: #e8e0d4;
      font-size: 1rem;
      width: 280px;
      text-align: center;
    }

    #login-section input::placeholder { color: rgba(232, 224, 212, 0.4); }

    button {
      font-family: 'Montserrat', sans-serif;
      padding: 0.6rem 2rem;
      background: #c9a84c;
      color: #0a1628;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    button:hover { background: #d4b85e; }

    #error-msg {
      color: #e74c3c;
      font-size: 0.85rem;
      min-height: 1.2em;
    }

    /* Dashboard */
    #dashboard { display: none; }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      background: rgba(201, 168, 76, 0.08);
      border: 1px solid rgba(201, 168, 76, 0.2);
      border-radius: 8px;
      padding: 1.25rem;
      text-align: center;
    }

    .stat-card .number {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.5rem;
      font-weight: 700;
      color: #c9a84c;
      line-height: 1;
    }

    .stat-card .label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 0.3rem;
      color: rgba(232, 224, 212, 0.7);
    }

    /* Tables */
    .section { margin-bottom: 2.5rem; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
    }

    th {
      text-align: left;
      padding: 0.6rem 0.75rem;
      background: rgba(201, 168, 76, 0.15);
      color: #c9a84c;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.08em;
    }

    td {
      padding: 0.6rem 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    tr:hover td { background: rgba(255, 255, 255, 0.03); }

    .delete-btn {
      padding: 0.25rem 0.6rem;
      font-size: 0.7rem;
      background: rgba(231, 76, 60, 0.15);
      color: #e74c3c;
      border: 1px solid rgba(231, 76, 60, 0.3);
      border-radius: 3px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .delete-btn:hover { background: rgba(231, 76, 60, 0.3); }

    .event-dots {
      display: flex;
      gap: 0.3rem;
    }
    .event-dot {
      display: inline-block;
      padding: 0.1rem 0.4rem;
      border-radius: 2px;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.03em;
    }
    .event-dot.on { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }
    .event-dot.off { background: rgba(255, 255, 255, 0.05); color: rgba(232, 224, 212, 0.3); }

    .toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(46, 204, 113, 0.9);
      color: #0a1628;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 100;
    }
    .toast.visible { opacity: 1; }
    .toast.error { background: rgba(231, 76, 60, 0.9); color: #fff; }

    .badge {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 3px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-accepted { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }
    .badge-declined { background: rgba(231, 76, 60, 0.2); color: #e74c3c; }

    .meal-breakdown {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .meal-item {
      background: rgba(201, 168, 76, 0.08);
      border: 1px solid rgba(201, 168, 76, 0.15);
      border-radius: 4px;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
    }

    .meal-item strong { color: #c9a84c; }

    .missing-list {
      columns: 2;
      column-gap: 2rem;
      list-style: none;
    }

    .missing-list li {
      padding: 0.3rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 0.85rem;
    }

    .missing-list li span {
      color: rgba(232, 224, 212, 0.5);
      font-size: 0.75rem;
    }

    @media (max-width: 600px) {
      .missing-list { columns: 1; }
      table { font-size: 0.75rem; }
      th, td { padding: 0.4rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>RSVP Dashboard</h1>

    <div id="login-section">
      <input type="password" id="key-input" placeholder="Admin password" />
      <button onclick="loadDashboard()">View RSVPs</button>
      <div id="error-msg"></div>
    </div>

    <div id="dashboard">
      <div class="stats" id="stats"></div>

      <div class="section">
        <h2>Meal Preferences</h2>
        <div class="meal-breakdown" id="meals"></div>
      </div>

      <div class="section">
        <h2>All RSVPs</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Events</th>
              <th>Guests</th>
              <th>Meal</th>
              <th>Notes</th>
              <th>Matched</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="rsvp-table"></tbody>
        </table>
      </div>

      <div class="section">
        <h2>Not Yet Responded</h2>
        <ul class="missing-list" id="missing-list"></ul>
      </div>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    let adminKey = '';
    const keyInput = document.getElementById('key-input');
    keyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loadDashboard();
    });

    function showToast(msg, isError) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.className = 'toast visible' + (isError ? ' error' : '');
      setTimeout(() => t.className = 'toast', 2500);
    }

    async function deleteRsvp(id, name) {
      if (!confirm('Delete RSVP from ' + name + '?')) return;
      try {
        const res = await fetch('/api/rsvp?key=' + encodeURIComponent(adminKey) + '&id=' + id, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          showToast('Deleted ' + name);
          loadDashboard();
        } else {
          showToast(data.error || 'Delete failed', true);
        }
      } catch {
        showToast('Network error', true);
      }
    }

    async function loadDashboard() {
      const key = keyInput.value.trim() || adminKey;
      const errorEl = document.getElementById('error-msg');
      if (!key) { errorEl.textContent = 'Enter the admin password'; return; }
      errorEl.textContent = '';
      adminKey = key;

      let data;
      try {
        const res = await fetch('/api/rsvp?key=' + encodeURIComponent(key));
        data = await res.json();
        if (data.error) { errorEl.textContent = data.error; return; }
      } catch {
        errorEl.textContent = 'Failed to connect';
        return;
      }

      document.getElementById('login-section').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';

      const rsvps = data.rsvps || [];
      const missing = data.missing_guests || [];
      const accepted = rsvps.filter(r => r.attending === 'accepted');
      const declined = rsvps.filter(r => r.attending === 'declined');
      const totalGuests = accepted.reduce((s, r) => s + (r.guest_count || 1), 0);

      // Stats
      document.getElementById('stats').innerHTML =
        statCard(totalGuests, 'Guests Attending') +
        statCard(accepted.length, 'Accepted') +
        statCard(declined.length, 'Declined') +
        statCard(missing.length, 'No Response');

      // Meal breakdown
      const meals = {};
      accepted.forEach(r => {
        const m = r.meal_preference || 'Not specified';
        meals[m] = (meals[m] || 0) + (r.guest_count || 1);
      });
      document.getElementById('meals').innerHTML = Object.entries(meals)
        .map(([k, v]) => '<div class="meal-item"><strong>' + v + '</strong> ' + esc(k) + '</div>')
        .join('');

      // RSVP table
      document.getElementById('rsvp-table').innerHTML = rsvps.map(r => {
        const cls = r.attending === 'accepted' ? 'badge-accepted' : 'badge-declined';
        const date = r.created_at ? r.created_at.split('T')[0] : '';
        const evW = r.event_welcome ? 'on' : 'off';
        const evC = r.event_wedding ? 'on' : 'off';
        const evB = r.event_brunch ? 'on' : 'off';
        return '<tr>' +
          '<td>' + esc(r.full_name) + '</td>' +
          '<td>' + esc(r.email || '') + '</td>' +
          '<td><span class="badge ' + cls + '">' + r.attending + '</span></td>' +
          '<td><div class="event-dots">' +
            '<span class="event-dot ' + evW + '">W</span>' +
            '<span class="event-dot ' + evC + '">C</span>' +
            '<span class="event-dot ' + evB + '">B</span>' +
          '</div></td>' +
          '<td>' + (r.guest_count || 1) + '</td>' +
          '<td>' + esc(r.meal_preference || '') + '</td>' +
          '<td>' + esc(r.dietary_notes || '') + '</td>' +
          '<td>' + esc(r.matched_guest_name || '-') + '</td>' +
          '<td>' + date + '</td>' +
          '<td><button class="delete-btn" onclick="deleteRsvp(' + r.id + ', \'' + esc(r.full_name).replace(/'/g, "\\\\'") + '\')">Delete</button></td>' +
          '</tr>';
      }).join('');

      // Missing guests
      document.getElementById('missing-list').innerHTML = missing.map(g =>
        '<li>' + esc(g.full_name) +
        (g.group_name ? ' <span>(' + esc(g.group_name) + ')</span>' : '') +
        '</li>'
      ).join('');
    }

    function statCard(num, label) {
      return '<div class="stat-card"><div class="number">' + num + '</div><div class="label">' + label + '</div></div>';
    }

    function esc(s) {
      const d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
}
