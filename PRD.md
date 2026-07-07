# Product Requirements Document (PRD)
## SocialWatch — Social Media Monitoring Platform

**Version:** 1.0  
**Date:** March 30, 2026  
**Status:** MVP

---

## 1. Overview

SocialWatch is a SaaS platform that monitors designated public (and optionally authenticated) social media profiles and continuously captures posts as high-fidelity screenshots. It provides an archival system that preserves content even if the original post is later deleted, along with full-text search and analytics across captured content.

---

## 2. Problem Statement

Social media content can disappear — posts get deleted, accounts get suspended, and platforms change their content policies without warning. There is currently no reliable, automated tool that allows individuals or organizations to:

- Monitor specific social media handles across multiple platforms
- Capture and archive posts in a tamper-evident format
- Search through historical content with speed and precision
- Receive alerts when new content appears or is removed

---

## 3. Goals

- Enable users to monitor any number of public social media handles across major platforms
- Automatically capture screenshots of new posts at configurable intervals
- Store screenshots durably with metadata (text, URL, timestamp)
- Provide a fast, searchable archive of all captured content
- Support tiered subscription plans with usage limits and billing via Stripe
- Allow users to bring their own S3-compatible storage bucket

---

## 4. Non-Goals (for v1.0)

- Real-time monitoring of private or direct messages
- Video recording or animated GIF capture
- Native mobile apps (iOS/Android)
- AI-based content summarization or sentiment analysis
- Bulk data export in v1.0

---

## 5. Target Users

| User Type | Description |
|---|---|
| **Researchers** | Academics or journalists monitoring public figures for archival and analysis |
| **Legal / Compliance Teams** | Organizations that need to preserve social media evidence |
| **Brand Managers** | Companies monitoring their brand mentions and competitor activity |
| **Individuals** | People tracking their own content history or monitoring others |

---

## 6. Supported Platforms

- Twitter / X
- Instagram
- TikTok
- Facebook
- Threads
- YouTube
- Reddit

---

## 7. Features

### 7.1 Authentication
- Replit OAuth (OpenID Connect) for user login and provisioning
- Session-based authentication with secure cookie handling
- Automatic user creation on first login

### 7.2 Profile Management
- Add social media profiles by handle and platform
- View all monitored profiles with status badges (Active / Inactive / Needs Reconnect)
- Enable or disable monitoring per profile
- Delete profiles (stops monitoring and removes history)
- Display last capture time and total screenshots per profile

### 7.3 Continuous Monitoring
- Polling intervals configurable between 10 and 60 seconds
- Headless browser capture via Playwright
- Multi-platform handling with platform-specific logic
- Automatic reconnect detection and alerting when credentials expire

### 7.4 Screenshot Capture & Storage
- High-fidelity screenshot capture of posts
- Thumbnail generation for fast gallery loading
- Metadata stored alongside each screenshot: post text, post URL, capture timestamp
- Primary storage via Amazon S3
- Optional Bring Your Own S3 (BYO S3) bucket
- Optional Dropbox integration
- Configurable retention policies by subscription tier

### 7.5 Dashboard
- Stats overview: active profiles, screenshots captured today, total screenshots
- Recent captures gallery
- Quick access to add new profiles
- Activity feed with real-time updates

### 7.6 Screenshots Gallery
- Browse all captured screenshots across all monitored profiles
- Filter by platform, handle, or keyword
- View extracted post text alongside each screenshot

### 7.7 Full-Text Search
- Search across all captured content by keyword
- Filter by platform, handle, and date range
- Matches against post text extracted via DOM parsing or OCR

### 7.8 Settings & Account Management
- Update user profile information
- Configure monitoring intervals
- Manage notification preferences (summary vs. real-time)
- Manage subscription and billing via Stripe portal

### 7.9 Subscription & Billing
- Three-tier subscription model managed via Stripe:

| Tier | Monitored Handles | Retention | Storage | Interval |
|---|---|---|---|---|
| **Free** | Up to 3 | 30 days | Shared S3 | 60 seconds |
| **Pro** | Up to 20 | 1 year | Shared S3 | 15 seconds |
| **Premium** | Unlimited | Unlimited | BYO S3 | 10 seconds |

- Stripe Checkout for plan upgrades
- Stripe Customer Portal for self-serve billing management

---

## 8. User Flows

### 8.1 Onboarding
1. User visits landing page
2. Clicks "Get Started Free"
3. Authenticates via Replit OAuth
4. Redirected to Dashboard
5. Prompted to add their first profile

### 8.2 Adding a Profile
1. User clicks "Add Profile" on Dashboard or Profiles page
2. Selects platform from dropdown
3. Enters social media handle (e.g. `@elonmusk`)
4. Submits form → profile saved to database
5. Monitoring engine begins polling at the configured interval

### 8.3 Viewing Captures
1. User navigates to Dashboard for a recent-captures summary
2. Or visits Screenshots page for a full gallery view
3. Clicks a profile on the Profiles page to open a screenshot gallery modal
4. Sees all historical captures with timestamp and post text

### 8.4 Searching Content
1. User navigates to Search page
2. Enters a keyword (e.g., "acquisition")
3. Optionally filters by platform, handle, or date range
4. Results show matching screenshots with highlighted post text

### 8.5 Upgrading Subscription
1. User navigates to Settings → Billing
2. Clicks "Upgrade Plan"
3. Redirected to Stripe Checkout
4. On success, subscription tier updated in database
5. User gains access to expanded limits

---

## 9. API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/auth/user` | Returns current authenticated user |
| `GET` | `/api/dashboard/stats` | Dashboard stats (active profiles, screenshot counts) |
| `GET` | `/api/profiles` | List all profiles for the authenticated user |
| `POST` | `/api/profiles` | Add a new profile to monitor |
| `PATCH` | `/api/profiles/:id` | Update profile settings |
| `DELETE` | `/api/profiles/:id` | Delete a profile |
| `GET` | `/api/profiles/:id/screenshots` | Get screenshot history for a profile |
| `GET` | `/api/screenshots/recent` | Get latest screenshots across all profiles |
| `POST` | `/api/subscription/manage` | Initiate Stripe billing session |

---

## 10. Data Model

### Users
| Field | Type | Notes |
|---|---|---|
| `id` | string | Replit user ID |
| `email` | string | From Replit Auth |
| `firstName` | string | |
| `lastName` | string | |
| `profileImageUrl` | string | |
| `stripeCustomerId` | string | Stripe billing reference |
| `stripeSubscriptionId` | string | Active subscription |
| `subscriptionTier` | string | `free`, `pro`, `premium` |

### Profiles
| Field | Type | Notes |
|---|---|---|
| `id` | uuid | Auto-generated |
| `userId` | string | FK to users |
| `platform` | string | e.g. `twitter`, `instagram` |
| `handle` | string | e.g. `elonmusk` |
| `displayName` | string | |
| `avatarUrl` | string | |
| `isActive` | boolean | Monitoring on/off |
| `needsReconnect` | boolean | Credential expired |
| `lastCapturedAt` | timestamp | |
| `totalScreenshots` | integer | |

### Screenshots
| Field | Type | Notes |
|---|---|---|
| `id` | uuid | Auto-generated |
| `profileId` | uuid | FK to profiles |
| `userId` | string | FK to users |
| `imageUrl` | string | Full-size S3 URL |
| `thumbnailUrl` | string | Thumbnail S3 URL |
| `postText` | text | Extracted text content |
| `postUrl` | string | Original post URL |
| `capturedAt` | timestamp | Capture time |

---

## 11. Technical Architecture

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript, Vite, shadcn/ui, Tailwind CSS |
| Routing | Wouter |
| State Management | TanStack React Query |
| Forms | React Hook Form + Zod |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL (Neon serverless) via Drizzle ORM |
| Auth | Replit Auth (OpenID Connect) |
| Payments | Stripe (Checkout + Customer Portal) |
| Storage | Amazon S3 (shared or BYO) |
| Screenshot Engine | Playwright (headless Chromium) |
| OCR / Text Extraction | DOM parsing + optional OCR service |

---

## 12. External Dependencies

| Service | Required | Purpose |
|---|---|---|
| Replit Auth | Yes | Authentication |
| Neon PostgreSQL | Yes | Database |
| Amazon S3 | Yes | Screenshot storage |
| Stripe | Yes | Subscription billing |
| Playwright | Yes | Headless browser capture |
| Dropbox | Optional | Alternative storage |
| OCR Service | Optional | Text extraction from images |

---

## 13. Constraints & Assumptions

- The platform only monitors **public** profiles in v1.0; authenticated (private) profile support is a future enhancement
- Screenshot capture accuracy depends on platform-specific DOM structure; updates to platforms may break capture logic
- Twitter API access is subject to Twitter's Developer Policy and rate limits
- Storage costs for screenshots scale with the number of profiles and capture frequency
- Retention policies are enforced per subscription tier

---

## 14. Success Metrics

| Metric | Target (6 months) |
|---|---|
| Registered users | 1,000 |
| Paid subscribers | 100 |
| Profiles actively monitored | 5,000 |
| Screenshots captured per day | 50,000 |
| Search queries per day | 2,000 |
| Uptime | 99.5% |

---

## 15. Milestones

| Milestone | Description | Status |
|---|---|---|
| M1 | MVP: Auth, profile management, UI, database schema | Complete |
| M2 | Real screenshot capture engine (Playwright) | Planned |
| M3 | Twitter/X API integration | Planned |
| M4 | Full-text search with OCR | Planned |
| M5 | Stripe billing and subscription enforcement | Planned |
| M6 | BYO S3 and Dropbox storage options | Planned |
| M7 | Alerting and notifications | Planned |
| M8 | Additional platforms (TikTok, YouTube, Reddit) | Planned |

---

## 16. Open Questions

1. Should authenticated (private) profile monitoring be supported in v2.0, and if so, how will user credentials be stored securely?
2. What is the expected screenshot retention policy for free-tier users when they exceed their storage limit — delete oldest first or lock the account?
3. Will the platform offer a public API for enterprise customers to access their captured data programmatically?
4. How will the platform handle DMCA or content takedown requests related to archived screenshots?
5. Should a content moderation layer be added to avoid capturing harmful or illegal content?
