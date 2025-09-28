# Onboarding Flow

This directory contains the onboarding flow for new users after they log in to the Legali platform.

## Purpose

The onboarding page (`/onboard`) helps users choose how they want to use the Legali platform by presenting three main options:

1. **Use Legali AI** - AI-powered legal assistance (`/`)
2. **Legal Consultation & Marketplace** - Connect with lawyers (`/lawyers`)
3. **Litigation Crowdfunding** - Investment opportunities (`/litigation-crowdfunding`)

## User Flow

1. User logs in successfully
2. Redirected to `/onboard` (this page)
3. User selects their primary purpose
4. Redirected to the appropriate section of the platform
5. Alternative: User can "Skip for now" and go directly to `/profile`

## Components

- `layout.tsx` - Layout wrapper with authentication guard
- `page.tsx` - Main onboarding page with purpose selection
- `PurposeSelectionForm` - The interactive selection component

## Authentication

This page requires authentication and will redirect unauthenticated users to `/login`.
