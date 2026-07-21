# Financial Information Collection Portal

A production-ready, highly secure **Financial Information Collection Portal** designed to collect, validate, encrypt, and manage 13-section financial applications with zero-trust PII protection.

---

## Architecture & Security Highlights

- **AES-256-GCM Encryption**: Full form data encrypted at rest before storing in MongoDB Atlas (`encryptedData`). Plaintext is decrypted only when an authorized reviewer views an individual record.
- **HMAC-SHA256 Blind Indexing**: Allows duplicate CNIC detection and fast lookups without decrypting PII or storing plaintext.
- **Passwordless Magic Link Resume**: Applicants resume draft applications via single-use, HMAC-signed magic links.
- **Managed Private Storage**: Direct browser-to-bucket document uploads via Supabase Storage signed URLs with virus scan workflow.
- **Vercel Serverless & Cron Ready**: Optimized Mongoose connection pooling for serverless warm starts and Vercel Cron endpoints for retention purging.

---

## Monorepo Layout

```
├── frontend/             # Next.js (App Router), Tailwind CSS, Form Wizard, Admin Portal
├── backend/              # Node.js + Express + TypeScript, Mongoose, Auth & PDF Services
│   ├── src/
│   │   ├── config/       # Environment & serverless database connection setup
│   │   ├── controllers/  # Application, Admin, Auth, Upload handlers
│   │   ├── middleware/   # Security (Helmet, Rate Limit), JWT Auth, Role checking
│   │   ├── models/       # Mongoose schemas (Application, Admin, AuditLog, Upload)
│   │   ├── services/     # Crypto, PDFKit export, resume tokens, retention jobs
│   │   ├── tests/        # Unit test suite (Node test runner)
│   │   └── utils/        # AES-256-GCM & HMAC helper functions
│   └── vercel.json       # Vercel Serverless Function & Cron configuration
└── shared/               # Shared TypeScript schemas & Pakistani domain validators
```

---

## Getting Started

### 1. Prerequisites
- Node.js 20+ and npm

### 2. Installation
From repo root:
```bash
npm install
```

### 3. Key Generation
```bash
npm run keygen -w backend
```

### 4. Running Locally
```bash
npm run dev -w backend     # API server at http://localhost:4000
npm run dev -w frontend    # Web app at http://localhost:3000
```

### 5. Running Tests & Typechecks
```bash
npm run typecheck          # Full monorepo typecheck
npm test -w backend        # Run backend unit test suite
```

---

## Deployment to Vercel (100% Free Tier)

Deploy as two Vercel Projects from the same repository:

1. **Backend Project**:
   - Set **Root Directory** to `backend`.
   - Add environment variables (`MONGO_URI`, `FIELD_ENCRYPTION_KEY`, `BLIND_INDEX_KEY`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `RESUME_TOKEN_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
2. **Frontend Project**:
   - Set **Root Directory** to `frontend`.
   - Add `NEXT_PUBLIC_API_URL` (pointing to your Vercel backend URL + `/api`) and Supabase anon key variables.

For detailed setup, read [LOCAL_SETUP.md](LOCAL_SETUP.md) and [ARCHITECTURE.md](ARCHITECTURE.md).
