# Tasks: 복지집사 (Benefit Chat) MVP

This file tracks the implementation tasks derived from the feature specification.

## Frontend Development (UI/UX)

- [ ] Integrate TailwindCSS color palette, typography, and box shadows as per design spec.
- [ ] Implement Landing Page (Onboarding) UI with CTA button.
- [ ] Develop Hybrid Chat UI component (input, quick replies, typing animations).
- [ ] Create Bot Bubble and User Bubble components (Toss style).
- [ ] Design and implement Results Report Card UI (carousel, badges, icons, amounts).
- [ ] Implement sticky footer for Disclaimer.

## Backend Development (API & Logic)

- [ ] Implement POST `/api/chat` endpoint in Cloudflare Worker.
- [ ] Develop Intent Parsing logic (interface with AI service for variable extraction).
- [ ] Implement Policy Matching Engine logic (query database solution based on parsed intent).
- [ ] Develop Response Generation logic (interface with AI service for RAG based on matched policy data).
- [ ] Implement error handling for `/api/chat` endpoint.
- [ ] Implement Rate Limiting for `/api/chat` endpoint.

## Infrastructure & Configuration

- [ ] Set up Cloudflare Pages for frontend deployment.
- [ ] Configure Cloudflare Workers for backend API.
- [ ] Initialize database solution (Cloudflare D1) and create `policies` table schema.
- [ ] Configure `wrangler.toml` with database and AI service bindings.
- [ ] Develop seed script to populate `policies` table with initial 50 welfare policies.

## Testing & QA

- [ ] Develop unit/integration tests for `/api/chat` endpoint logic.
- [ ] Develop end-to-end tests for User Story 1 (Personalized Benefit Lookup).
- [ ] Develop end-to-end tests for User Story 2 (Overview of Matched Benefits).
- [ ] Verify policy matching accuracy (SC-001) through testing.
- [ ] Measure and optimize API response time (SC-002).
- [ ] Validate coverage of 50 policies for MVP (SC-003).
- [ ] Test hallucination rate of conversational replies (SC-005).