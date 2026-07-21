# Local Setup & End-to-End Test Runbook

Goal: configure the real services, run both apps locally, complete one applicant
submission, and review it in the admin console.

Prerequisites: Node 20+ and npm. From the repo root, `npm install` (installs all three
workspaces: shared, backend, frontend).

---

## 1. Generate secrets

```bash
# Field encryption + blind index keys (32-byte, base64)
npm run keygen -w backend

# The rest — run four times, one value each
openssl rand -base64 32   # JWT_ACCESS_SECRET
openssl rand -base64 32   # JWT_REFRESH_SECRET
openssl rand -base64 32   # RESUME_TOKEN_SECRET
openssl rand -base64 32   # SCAN_CALLBACK_SECRET
```

Put these in `backend/.env` (copy from `backend/.env.example`).

---

## 2. MongoDB Atlas

1. Create a free (M0) cluster.
2. Database Access → add a user (username + password).
3. Network Access → add your current IP (or `0.0.0.0/0` for dev only).
4. Connect → drivers → copy the SRV string. Add the database name before the `?`:
   ```
   MONGO_URI=mongodb+srv://USER:PASS@cluster.xxxx.mongodb.net/finportal?retryWrites=true&w=majority
   ```

Indexes (unique CNIC index, session TTL, etc.) are created automatically on first run.

---

## 3. Supabase Storage (private bucket)

1. Create a Supabase project. From Project Settings → API, copy the **Project URL**, the
   **anon** key, and the **service_role** key.
2. Storage → create a bucket named `applications` with:
   - **Public = OFF** (private).
   - **File size limit = 10 MB**.
   - **Allowed MIME types**: `image/png, image/jpeg, application/pdf`.
   (These bucket settings are what enforce type/size — the equivalent of the old S3 POST policy.)
3. `backend/.env`:
   ```
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service_role key — server only, never exposed>
   SUPABASE_STORAGE_BUCKET=applications
   ```
4. `frontend/.env.local` (see section 6) uses the **anon** key — safe to expose; the browser
   uploads with a short-lived signed token, not with any account credential.

Objects are encrypted at rest by the platform. No CORS config is normally needed — Supabase's
storage endpoint accepts the signed upload from the browser.

---

## 4. SMTP (optional in dev)

Leave `SMTP_HOST` blank to log emails to the console instead of sending. For real email,
set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_FROM`.

## 5. Turnstile (optional in dev)

Leave both keys blank to bypass CAPTCHA in dev (backend and frontend both skip). For real:
create a Turnstile widget, then set backend `TURNSTILE_SECRET` and frontend
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

---

## 6. Environment files

`backend/.env` — everything above, plus:
```
CORS_ORIGIN=http://localhost:3000
APP_BASE_URL=http://localhost:3000
```

`frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
NEXT_PUBLIC_SUPABASE_BUCKET=applications
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=...   # only if using real Turnstile
```

---

## 7. Seed an admin, then run

```bash
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='a-strong-password' \
  npm run seed:admin -w backend

npm run dev -w backend     # http://localhost:4000  (GET /health -> { ok: true })
npm run dev -w frontend    # http://localhost:3000
```

---

## 8. End-to-end test

1. `http://localhost:3000` → Start application → fill all 13 sections → upload documents →
   Review → Submit. You should land on the reference number and (in dev) see the
   confirmation email in the backend console.
2. Test resume: partway through, "Save and finish later" → follow the dev link shown.
3. `http://localhost:3000/admin/login` → sign in → Dashboard → Applications → open the record.

### Viewing uploaded documents locally (no scanner)

Uploads land in storage with `scanStatus: 'pending'` and stay non-viewable until the scanner
marks them clean. There's no scanner locally, so mark one clean by hand:

1. Find the object path in Atlas → `uploads` collection (`s3Key` field — it holds the Supabase
   storage path).
2. Call the scan callback:
   ```bash
   curl -X POST http://localhost:4000/api/upload/scan-callback \
     -H "Content-Type: application/json" \
     -H "x-scan-secret: YOUR_SCAN_CALLBACK_SECRET" \
     -d '{"key":"PASTE_s3Key_HERE","status":"clean"}'
   ```
3. Refresh the admin detail page — the document is now viewable.

---

## Known gotchas (check these first if something breaks)

- **Uploads fail in the browser** → check the bucket exists and is named exactly
  `SUPABASE_STORAGE_BUCKET`, that the file's type/size is within the bucket's allowed MIME
  types and size limit, and that `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  are set.
- **Admin login works but session drops on refresh** → the refresh cookie. It's
  `sameSite=strict`, `secure` only in production. Locally, `:3000` and `:4000` share the
  `localhost` site so it should work; if it doesn't, that's the place to look.
- **`Missing required env var`** on boot → a secret in section 1/2 isn't set. The server
  fails fast on purpose.
- **Submit returns 409** → that CNIC already has a submitted application. Use a different
  CNIC or delete the record to re-test.
- **Documents stuck on "pending"** → expected without the scanner; use the curl above.
- **CAPTCHA blocks submit** → in dev leave both Turnstile keys blank; the backend hard-fails
  CAPTCHA only in production.
