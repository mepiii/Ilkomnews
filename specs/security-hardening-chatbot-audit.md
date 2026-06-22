---
name: ILKOM Security Hardening, Chatbot RAG & Bug Audit
created: 2026-06-22
status: complete
---

# ILKOM Security Hardening, Chatbot RAG & Bug Audit

## Objective
Harden the existing ILKOM website (Laravel 13 + React 19) with production-grade security, strict RAG chatbot, admin dashboard enhancements, and comprehensive testing. Deploy on Hostinger shared hosting.

## Existing Codebase
- **Backend:** Laravel 13 + Sanctum + MySQL (basic rate limiting, admin middleware, Breeze auth)
- **Frontend:** React 19 + Vite + Tailwind CSS + framer-motion (admin CRUD, public pages, Wolfy chatbot widget)
- **Chatbot:** Gemini 2.0 Flash with keyword-based LIKE search (no vector DB, no embeddings)
- **Admin:** Login, Dashboard, News CRUD, Project accept/reject
- **Tests:** Default Breeze tests only — zero custom tests

## Phase 1: Security Hardening
- [ ] SEC-1: Security headers middleware (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- [ ] SEC-2: File upload endpoint with MIME/magic bytes/extension/size validation (jpg/jpeg/png/webp only, 10MB max)
- [ ] SEC-3: Admin auth hardening — account lockout (5 failed = 15min lock), login throttling, session rotation, IP logging
- [ ] SEC-4: CSRF protection for state-changing operations
- [ ] SEC-5: CORS lockdown to production domain only
- [ ] SEC-6: Sensitive data exposure prevention (no stack traces, no debug info in production)

## Phase 2: Chatbot Hardening
- [ ] CHAT-1: Input limits — 200 chars, 40 words, 1 question, reject prompt injection
- [ ] CHAT-2: Output limits — 800 chars, 5 bullets, 3 chunks, 3 references, 250 tokens
- [ ] CHAT-3: Strict topic guard — reject non-website topics with standard message
- [ ] CHAT-4: Zero-hallucination enforcement — require retrieved source, reject if no match
- [ ] CHAT-5: Rate limiting — 5/min, 20/hr, 50/day per IP + device fingerprint
- [ ] CHAT-6: Global concurrent limit — 20 max, queue excess

## Phase 3: Admin Dashboard Enhancements
- [ ] ADMIN-1: Audit logging system (log all admin actions with IP, timestamp, user)
- [ ] ADMIN-2: Chatbot statistics endpoint (queries, rejections, topics, rate limit hits)
- [ ] ADMIN-3: Health monitoring endpoint (DB connection, cache, disk, memory)
- [ ] ADMIN-4: Security center page (failed logins, blocked IPs, recent threats)
- [ ] ADMIN-5: AI usage analytics page (token usage, cost tracking, query patterns)

## Phase 4: Testing
- [ ] TEST-1: API feature tests for all public endpoints (News, Articles, Events, Careers, Projects, Chat)
- [ ] TEST-2: Admin API tests (auth, CRUD, accept/reject)
- [ ] TEST-3: Chatbot guardrail tests (topic rejection, input limits, hallucination prevention)
- [ ] TEST-4: Security tests (unauthorized access, rate limiting, file upload validation)
- [ ] TEST-5: Target 90%+ coverage on custom code

## Constraints
- **Tech stack:** Laravel 13, React 19, Vite, Tailwind — no new frameworks
- **No TypeScript** — keep existing JS pattern
- **Hosting:** Hostinger shared hosting
- **AI:** Gemini 2.0 Flash (existing key)
- **Database:** MySQL (existing)

## Out of Scope
- Vector database / embedding model (keyword RAG is sufficient for this content volume)
- TOTP MFA (optional per spec — skip for now)
- Cloudflare/WAF configuration (infrastructure, not code)
- Frontend design changes (security + backend focus)

## Definition of Done
- [ ] All security headers return A+ on securityheaders.com
- [ ] File uploads reject all non-image files
- [ ] Admin lockout triggers after 5 failed attempts
- [ ] Chatbot rejects all forbidden topics
- [ ] Chatbot never generates without a retrieved source
- [ ] Rate limits enforced at all specified tiers
- [ ] All admin actions logged
- [ ] 90%+ test coverage on custom code
- [ ] No critical security findings
- [ ] All routes, forms, APIs functional
