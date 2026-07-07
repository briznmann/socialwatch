# SocialWatch - Social Media Monitoring Platform

## Overview

SocialWatch is a SaaS application that monitors designated public or authenticated social media profiles and continuously captures posts as high-fidelity screenshots. The platform supports multiple social media platforms (Twitter/X, Instagram, TikTok, Facebook, Threads, YouTube, Reddit) with real-time monitoring capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Authentication**: Replit Auth with OpenID Connect (OIDC)
- **Session Management**: Express sessions with PostgreSQL store

### Key Components

#### Authentication System
- Replit OAuth integration with automatic user provisioning
- Session-based authentication with secure cookie handling
- Mandatory user and session tables for Replit Auth compatibility
- Protected routes with authentication middleware

#### Database Schema
- **Users**: Core user data with subscription tiers and Stripe integration
- **Profiles**: Social media profiles being monitored with platform-specific metadata
- **Screenshots**: Captured content with timestamps and metadata
- **Sessions**: Required table for Replit Auth session management

#### Monitoring Engine
- Continuous monitoring capabilities (10-15 second intervals)
- Multi-platform support with platform-specific handling
- Screenshot capture via headless browser (Playwright ready)
- Text extraction and OCR capabilities

#### Storage Integration
- Default Amazon S3 bucket support
- Bring Your Own S3 (BYO S3) capability
- Optional Dropbox integration
- Image thumbnails and lifecycle management
- Configurable retention policies by subscription tier

#### Subscription Management
- Stripe integration for payment processing
- Tiered subscription model (free, paid plans)
- Usage tracking and limits enforcement

## Data Flow

1. **User Authentication**: Replit OAuth → Session creation → User provisioning
2. **Profile Management**: Add profiles → Platform validation → Monitoring activation
3. **Content Capture**: Scheduled monitoring → Screenshot capture → Storage upload → Database logging
4. **Content Retrieval**: API queries → Database fetch → S3 retrieval → Client display
5. **Search & Analytics**: Full-text search → Dashboard stats → Real-time updates

## External Dependencies

### Required Services
- **Neon Database**: PostgreSQL hosting for production
- **Replit Auth**: Authentication provider (mandatory)
- **Amazon S3**: Primary storage for screenshots and media
- **Stripe**: Payment processing and subscription management

### Optional Services
- **Dropbox**: Alternative storage option
- **Playwright**: Headless browser for screenshot capture
- **OCR Services**: Text extraction from images

### Development Tools
- **Replit Integration**: Development environment with cartographer plugin
- **Vite**: Development server with HMR and error overlay
- **Drizzle Kit**: Database migration and schema management

## Deployment Strategy

### Development Environment
- Replit-optimized setup with environment detection
- Hot module replacement for fast iteration
- Runtime error overlay for debugging
- Cartographer integration for code navigation

### Production Build
- Vite production build for optimized client bundle
- ESBuild compilation for server-side code
- Static asset serving with proper caching headers
- Database migrations via Drizzle Kit

### Environment Configuration
- DATABASE_URL for PostgreSQL connection
- SESSION_SECRET for secure session management
- REPLIT_DOMAINS and ISSUER_URL for authentication
- S3 credentials for storage integration
- Stripe API keys for payment processing

### Scalability Considerations
- Serverless-ready database configuration (Neon)
- Session store backed by PostgreSQL for horizontal scaling
- Stateless server design for easy deployment scaling
- CDN-ready static asset structure