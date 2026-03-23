# RSVP Data Pipeline

When modifying the RSVP form (adding fields, changing options, etc.), ALL of these must stay in sync:

## 1. Frontend Form (`src/index.html`)
- HTML form fields in the `#rsvp` section
- Field IDs used by the submit handler

## 2. Frontend Submit Handler (`src/app.js`)
- The `data` object built from form fields (~line 260-280)
- Guest fields sent when `guestCount > 1` (~line 280)
- Validation rules (required fields, conditional checks)

## 3. API Handler (`functions/api/rsvp.js`)
- Destructured fields from `body` (~line 61)
- SQL INSERT column list and bind params (~line 100-120)
- Google Sheet webhook payload (~line 128-140)

## 4. Database Schema (`schema.sql`)
- Column definitions in `wedding_rsvps` table
- Run `ALTER TABLE` on remote DB for new columns:
  `npx wrangler d1 execute thezapins-db --remote --command "ALTER TABLE wedding_rsvps ADD COLUMN new_field TEXT;"`

## 5. Google Sheet (`Apps Script`)
- `doPost()` in Apps Script must include the new field in `appendRow()`
- Sheet headers (row 3) must match
- URL: https://script.google.com/u/0/home/projects/1hgcxS6IjZbrNbmrzfL6oMDthW24RyuGtR0X4-akF3c6NAI5iDy20Kq8c/edit
- After editing code, Deploy > Manage deployments > Edit (pencil) > Version: New version > Deploy

## 6. Admin Dashboard (`functions/admin.js`)
- Table headers in the HTML (~line 337-349)
- Table row rendering in `loadDashboard()` (~line 442-464)
- Meal breakdown logic if meal-related (~line 432-439)
- CSV export headers and row mapping (~line export section)

## Current Fields
| Field | Form ID | DB Column | Sheet Column |
|-------|---------|-----------|--------------|
| Full Name | rsvpName | full_name | B (Name) |
| Email | rsvpEmail | email | C (Email) |
| Attending | rsvpAttendance | attending | D (Status) |
| Welcome Party | eventWelcome | event_welcome | E |
| Ceremony | eventWedding | event_wedding | F |
| Farewell Brunch | eventBrunch | event_brunch | G |
| Guest Count | rsvpGuests | guest_count | H |
| Meal Preference | rsvpMeal | meal_preference | I |
| Dietary Notes | rsvpNotes | dietary_notes | J |
| Guest Name | guestName | guest_name | K |
| Guest Meal | guestMeal | guest_meal_preference | L |
| Guest Dietary | guestNotes | guest_dietary_notes | M |

## Meal Options (current)
- Beef
- Chicken
- Fish
- Vegetarian

## Google Sheet
- Sheet ID: `16E35hPcNd1mC5xP3fLHb--VGrUDPtbiyDW-zEkVhYzM`
- Apps Script Project ID: `1hgcxS6IjZbrNbmrzfL6oMDthW24RyuGtR0X4-akF3c6NAI5iDy20Kq8c`
- Webhook URL: hardcoded in `functions/api/rsvp.js` as fallback (Pages secrets don't work)
