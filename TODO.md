# Chess Learning Tree - Launch Plan

## Goal: Live, Marketed & Monetized by End of Week

---

## TOMORROW (Day 1) - Deployment & Stripe Setup

### Morning: Get Site Live
- [ ] Set up Vercel account (if not done)
- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables
- [ ] Deploy to production
- [ ] Set up custom domain (optional but recommended)
- [ ] Test all pages work on production

### Afternoon: Stripe Integration
- [ ] Create Stripe account at stripe.com
- [ ] Get API keys (publishable + secret)
- [ ] Install Stripe packages: `npm install stripe @stripe/stripe-js`
- [ ] Create `/api/stripe/checkout` route for payment sessions
- [ ] Create `/api/stripe/webhook` route for handling events
- [ ] Add STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY to Vercel env vars
- [ ] Create pricing page component
- [ ] Test checkout flow with Stripe test mode

---

## Day 2 - Monetization Features

### Pricing Tiers to Create
- [ ] **Free Tier**: First 2 lessons, daily challenge, limited puzzles
- [ ] **Premium ($9.99/month)**: All lessons, unlimited puzzles, full profile analytics
- [ ] **Lifetime ($79)**: Everything forever

### Implementation
- [ ] Add `isPremium` flag to user state/localStorage
- [ ] Create paywall component for locked content
- [ ] Gate lessons 1.3+ behind premium
- [ ] Add "Upgrade" buttons throughout app
- [ ] Create success/cancel pages for Stripe redirect
- [ ] Test full payment flow end-to-end

---

## Day 3 - Marketing Setup

### Landing Page Improvements
- [ ] Add hero section with value proposition
- [ ] Add features section (puzzle trainer, skill tracking, curriculum)
- [ ] Add pricing section
- [ ] Add testimonials section (can use placeholder initially)
- [ ] Add FAQ section
- [ ] Add call-to-action buttons

### Social Media Prep
- [ ] Create Twitter/X account for the app
- [ ] Write 5 launch tweets
- [ ] Create Reddit post for r/chess and r/chessbeginners
- [ ] Prepare Product Hunt launch (optional)

---

## Day 4 - Polish & Pre-Launch

### Bug Fixes & Testing
- [ ] Test on mobile devices
- [ ] Test payment flow multiple times
- [ ] Check all puzzle themes load correctly
- [ ] Verify progress saves properly
- [ ] Test profile page with real data

### Analytics & Tracking
- [ ] Add Google Analytics or Plausible
- [ ] Set up conversion tracking for purchases
- [ ] Add error tracking (Sentry optional)

---

## Day 5 - Launch Day

### Go Live
- [ ] Remove sample data flag from profile page
- [ ] Final production deploy
- [ ] Switch Stripe to live mode
- [ ] Announce on social media
- [ ] Share with chess communities
- [ ] Monitor for issues

---

## Quick Stripe Setup Commands

```bash
# Install Stripe
npm install stripe @stripe/stripe-js

# Environment variables needed in Vercel:
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

---

## Stripe Checkout Code Template

Create `app/api/stripe/checkout/route.ts`:
```typescript
import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { priceId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription', // or 'payment' for one-time
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
```

---

## Notes
- Start with test mode in Stripe, switch to live when ready
- Keep free tier valuable enough to attract users
- Focus on chess beginners (400-800 ELO) as target market
- The skill bubble visualization is a great differentiator - highlight it!
