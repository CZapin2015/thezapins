-- Wedding RSVP Database Schema

CREATE TABLE IF NOT EXISTS wedding_guests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  group_name TEXT,
  expected_party_size INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS wedding_rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT,
  attending TEXT NOT NULL CHECK(attending IN ('accepted', 'declined')),
  guest_count INTEGER DEFAULT 1,
  meal_preference TEXT,
  dietary_notes TEXT,
  event_welcome INTEGER DEFAULT 0,
  event_wedding INTEGER DEFAULT 0,
  event_brunch INTEGER DEFAULT 0,
  matched_guest_id INTEGER,
  matched_guest_name TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (matched_guest_id) REFERENCES wedding_guests(id)
);

-- Plus-one guest details
ALTER TABLE wedding_rsvps ADD COLUMN guest_name TEXT;
ALTER TABLE wedding_rsvps ADD COLUMN guest_meal_preference TEXT;
ALTER TABLE wedding_rsvps ADD COLUMN guest_dietary_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON wedding_rsvps(attending);
CREATE INDEX IF NOT EXISTS idx_rsvps_matched ON wedding_rsvps(matched_guest_id);
