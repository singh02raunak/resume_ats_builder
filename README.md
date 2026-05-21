# ResumeATS — AI Resume Builder & ATS Scorer

Beat ATS filters and land more interviews. Upload your resume, get an instant ATS score, and download an AI-improved version.

---

## Tech Stack

- **React + Vite** — Frontend framework
- **Supabase** — Auth (OTP/email) + Database
- **Claude API (Sonnet)** — ATS analysis + resume improvement
- **Razorpay** — Payments (INR)
- **jsPDF** — PDF generation
- **JSZip** — ZIP packaging
- **pdfjs-dist** — PDF text extraction
- **mammoth** — DOCX text extraction

---

## Quick Start

```bash
# 1. Clone and install
git clone <your-repo>
cd resume-ats-builder
npm install

# 2. Copy env file
cp .env.example .env

# 3. Fill in your keys (see sections below)
nano .env

# 4. Start dev server
npm run dev
```

---

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CLAUDE_API_KEY=sk-ant-your-key
VITE_RAZORPAY_KEY_ID=rzp_test_your_key
```

---

## Supabase Setup

### Step 1 — Create Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy `Project URL` and `anon public` key from **Settings → API**
3. Paste into `.env`

### Step 2 — Enable Email OTP Auth
1. Go to **Authentication → Providers → Email**
2. Enable **Email** provider
3. Set **"Confirm email"** to `false` (we use OTP, not magic link)
4. Under **Email Templates**, set OTP email template as desired

### Step 3 — Create Database Table
Go to **SQL Editor** and run this:

```sql
-- Resume analyses table
CREATE TABLE resume_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_filename TEXT,
  original_text TEXT,
  ats_score INTEGER,
  analysis JSONB,
  improved_resume JSONB,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  payment_amount INTEGER,
  payment_id TEXT,
  plan TEXT CHECK (plan IN ('basic', 'professional', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;

-- Policy: users can only access their own data
CREATE POLICY "Users can read own analyses"
  ON resume_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON resume_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON resume_analyses FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resume_analyses_updated_at
  BEFORE UPDATE ON resume_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Claude API Setup

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key under **API Keys**
3. Paste into `.env` as `VITE_CLAUDE_API_KEY`
4. Add billing — roughly ₹5–15 per resume analysis

> ⚠️ **Security Note**: The Claude API key is used in the browser directly. This is fine for MVP. For production, move API calls to a backend/Edge Function to hide the key.

---

## Razorpay Setup

### Test Mode (Development)
1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Sign up (no business verification needed for test mode)
3. Go to **Settings → API Keys → Generate Test Key**
4. Copy `Key ID` into `.env` as `VITE_RAZORPAY_KEY_ID`
5. Use test card: `4111 1111 1111 1111`, any future date, any CVV

### Live Mode (Production)
1. Complete KYC on Razorpay dashboard (takes 1-2 days)
2. Generate **Live** API keys
3. Replace test key with live key in production `.env`
4. Razorpay charges ~2% per transaction

> Note: For Indian payments, no additional setup is needed. Razorpay supports UPI, cards, net banking, wallets automatically.

---

## Pricing Plans

| Plan | Price | Features |
|------|-------|---------|
| ATS Fix | ₹1,000 | Full analysis + improved resume PDF + ZIP |
| Pro Boost | ₹1,500 | Above + LinkedIn bio + Cover letter |
| Career Edge | ₹2,000 | Above + full restructure + 7-day revision |

---

## User Flow

```
Landing Page
    ↓
Login (Email → OTP → Authenticated)
    ↓
Upload Resume (PDF/DOCX/TXT + optional Job Description)
    ↓
ATS Analysis (Claude API — free, no payment)
    ↓
Results Page (Score + top 3 suggestions — full locked)
    ↓
Payment Page (Choose plan → Razorpay checkout)
    ↓
AI Improvement (Claude rewrites resume — 30-60s)
    ↓
Download Page (PDF + ZIP + LinkedIn bio + Cover letter)
```

**Session persistence**: If a user loses connectivity or closes the tab, they can sign in again with the same email OTP and their latest analysis is automatically restored from Supabase.

---

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Vercel (recommended)
```bash
npm install -g vercel
vercel deploy
```
Set all environment variables in Vercel dashboard under **Project → Settings → Environment Variables**.

### Deploy to Netlify
```bash
npm run build
# Drag the 'dist' folder to netlify.com/drop
```

---

## What's Pending / TODO

### From Your End (Required)
- [ ] Add your Supabase project credentials to `.env`
- [ ] Add your Claude API key to `.env`
- [ ] Add your Razorpay test key to `.env`
- [ ] Run the SQL schema in Supabase SQL editor
- [ ] Enable Email OTP in Supabase Auth settings
- [ ] Test the full flow with a sample resume
- [ ] Go live on Razorpay with KYC for real payments

### From My End (Pending for v1.1)
- [ ] **Backend proxy** — Move Claude API calls to Supabase Edge Functions to hide the API key from the browser
- [ ] **Email delivery** — Send the improved resume to the user's email via Resend/SendGrid
- [ ] **Webhook for payment** — Razorpay webhook to confirm payment server-side before unlocking (currently client-side, which is fine for MVP)
- [ ] **Admin dashboard** — See all users, revenue, conversion rate
- [ ] **Resume history** — Let users view all their past analyses
- [ ] **Shareable score link** — "My resume scored 87/100" social sharing
- [ ] **Custom domain** — resumeats.in setup
- [ ] **Analytics** — Google Analytics or Posthog for funnel tracking
- [ ] **Error monitoring** — Sentry integration

### Nice to Have (v2)
- [ ] Multiple resume versions
- [ ] Job tracker integration
- [ ] WhatsApp OTP option
- [ ] Referral program

---

## Cost Estimate (per 100 users/day)

| Service | Cost |
|---------|------|
| Claude API (analysis + improvement) | ~₹1,500/day |
| Supabase (free tier up to 50K rows) | ₹0 |
| Razorpay (2% of revenue) | ~₹300–1,500 |
| Vercel hosting | ₹0 (free tier) |
| **Total** | ~₹1,800–3,000/day |

At 10 conversions/day @ ₹1,000 avg = **₹10,000 revenue / ~₹2,000 cost = ₹8,000 net profit/day**

---

## Support

Built for Indian job seekers. Questions? Reach out via the contact form on the site.
