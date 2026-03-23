# TheZapins Architecture

A wedding website for Stephanie & Corey's wedding (January 24, 2027), built as a full-stack web app with a vanilla HTML/CSS/JS frontend and Cloudflare Pages + Workers serverless backend.

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (no frameworks)
- **Animations**: GSAP 3.12.5 + ScrollTrigger
- **Backend**: Cloudflare Workers (serverless functions)
- **Database**: Cloudflare D1 (SQLite)
- **Hosting**: Cloudflare Pages
- **Build Tools**: Node.js, Sharp (image processing)
- **CI/CD**: GitHub Actions (daily auto-deploy)

## Directory Structure

```
thezapins/
├── src/                        # Frontend source files
│   ├── index.html              # Single-page app with anchor-based navigation
│   ├── app.js                  # Client-side logic (~555 lines)
│   ├── styles.css              # Responsive styling with animations
│   └── *.svg/png               # Monogram and favicon assets
├── functions/                  # Serverless API handlers
│   ├── api/
│   │   ├── rsvp.js             # RSVP submission & admin operations
│   │   └── settings.js         # Feature flag management
│   └── admin.js                # Admin dashboard (embedded HTML)
├── public/                     # Static assets (images, logos)
│   └── images/
│       └── gallery/
│           ├── full/           # Full-size lightbox images (max 1600px)
│           └── thumbs/         # Grid thumbnails (600x600)
├── raw-photos-root/            # Source engagement photos
├── build.js                    # Build script (OG image, cache-busting, dist)
├── process-photos.js           # Batch image processor (Sharp)
├── reprocess-thumbs.js         # Thumbnail reprocessor
├── schema.sql                  # D1 database schema
├── wrangler.toml               # Cloudflare Pages configuration
└── .github/workflows/
    └── daily-deploy.yml        # Auto-deploy at 5:03 AM UTC daily
```

## Frontend

The site is a single-page application using anchor-based routing with sections: `#home`, `#details`, `#rsvp`, `#travel`, `#registry`, `#photos`.

Key features:
- **Hero entrance animation** with GSAP timeline
- **Parallax scrolling** on background images
- **Scroll-triggered reveals** for content sections
- **Animated event timeline** that draws on scroll
- **Countdown timer** to the wedding date
- **Photo gallery** with lightbox viewer (40+ engagement photos)
- **RSVP form** with dynamic fields based on attendance selection
- **Mobile-responsive** with hamburger navigation

## API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `POST` | `/api/rsvp` | None (requires `rsvp_open` flag) | Submit RSVP |
| `GET` | `/api/rsvp?key=ADMIN_KEY` | Admin key | List all RSVPs |
| `DELETE` | `/api/rsvp?key=ADMIN_KEY&id=ID` | Admin key | Delete an RSVP |
| `GET` | `/api/settings` | None | Fetch feature flags |
| `PUT` | `/api/settings?key=ADMIN_KEY` | Admin key | Update feature flags |
| `GET` | `/admin` | Password prompt | Admin dashboard |

### RSVP Flow

1. Guest submits name, email, attendance, events, meal preference
2. Backend **fuzzy-matches** name against pre-populated guest list (Levenshtein distance ≤ 3)
3. RSVP saved to D1 database with `matched_guest_id`
4. Data simultaneously sent to **Google Sheets** via webhook (dual persistence)

## Database Schema (D1 / SQLite)

**`wedding_guests`** — Pre-populated expected guest list
- `id`, `full_name`, `group_name`, `expected_party_size`, `created_at`

**`wedding_rsvps`** — RSVP submissions
- `id`, `full_name`, `email`, `attending`, `guest_count`, `meal_preference`, `dietary_notes`
- Event flags: `event_welcome`, `event_wedding`, `event_brunch`
- Plus-one: `guest_name`, `guest_meal_preference`, `guest_dietary_notes`
- Match: `matched_guest_id`, `matched_guest_name`

**`site_settings`** — Feature flags
- `key`, `value` (e.g., `rsvp_open` = `true`/`false`)

## Build & Deploy

### Local Development
```bash
npm install
npm run build      # Generate dist/ with OG image
npm run dev        # Local server on port 8788
```

### Build Process (`build.js`)
1. Clean `/dist` directory
2. Generate dynamic OG image (1200x630px with countdown)
3. Copy `/public` assets to `/dist`
4. Copy `/src` files with cache-busting query params on CSS/JS

### Deployment
- **Manual**: `npm run deploy` (build + `wrangler pages deploy dist`)
- **Automatic**: GitHub Actions runs daily to keep OG countdown image current

## Admin Dashboard

Served by `functions/admin.js` as a self-contained HTML page:
- RSVP statistics (total, accepted, declined)
- Meal preference breakdown
- Searchable RSVP table with delete capability
- Toggle RSVP form open/closed
- CSV export
- Matched vs. unmatched guest tracking

## Key Design Decisions

1. **Vanilla JS** — No framework overhead for a content-focused site
2. **Fuzzy name matching** — Levenshtein distance handles typos in RSVPs
3. **Feature flags in DB** — Toggle RSVP without redeploying
4. **Dual persistence** — D1 + Google Sheets for redundancy and easy access
5. **Embedded admin UI** — Entire dashboard in one serverless function
6. **Daily auto-deploy** — Keeps social media preview countdown current
7. **Cache busting** — Timestamp query params prevent stale browser caches
