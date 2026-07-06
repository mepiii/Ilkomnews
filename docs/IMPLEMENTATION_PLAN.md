# ILKOM NEWS - Complete Implementation Plan

## Session Date: July 3, 2026

---

# PART 1: QUIZ ANSWERS & DECISIONS

## Quiz 1: Core Architecture Decisions

### Q1: RAG Search System
**Answer:** Full Vector Embeddings (with MySQL instead of SQLite)
- Advanced: chunks content into vectors, stores in MySQL, uses cosine similarity for semantic search
- More accurate, more complex to build and maintain

### Q2: Chatbot Widget
**Answer:** Enhanced WolfyWidget (Recommended)
- Upgrade the existing WolfyWidget to include FAQ section + Online status header + scrollbar-gutter fix
- Keeps current AI integration

### Q3: Chat Memory
**Answer:** Yes, persist in MySQL
- Chat history saved to database
- Users can see previous conversations
- Survives server restarts

### Q4: Engagement Features (Love/Save/Seen)
**Answer:** Anonymous + Server Sync
- localStorage for fast access, optional server sync for persistence
- More complex but robust

### Q5: Chatbot Knowledge Base
**Answer:** All Database Content (Recommended)
- News, articles, events, project submissions
- Comprehensive but larger index

### Q6: Intro Animation
**Answer:** Wait until asked, but improve IntroScreen
- Better with more fluid flowy motion and smooth
- Not enabled yet, user will ask when ready

### Q7: Hosting Environment
**Answer:** Shared Hosting (cPanel)
- SSE streaming may not work
- Need polling or alternative approach

### Q8: Backup Strategy
**Answer:** Git branch (Recommended)
- Create a feature branch (git checkout -b feature/ui-rag-overhaul)
- Clean, reversible, professional

---

## Quiz 2: Critical LLM Provider Decision

### Q: GitHub Models is Retiring
**Answer:** Azure AI Foundry (GitHub's recommended replacement)
- Full access to GPT-4, Llama, Mistral, etc.
- Free tier available
- OpenAI-compatible API
- Drop-in replacement for GitHub Models

---

## Quiz 3: UI/UX Design Decisions

### Q1: Tiles Background Density
**Answer:** Optimized grid (50x8 cols) (Recommended)
- Fewer DOM elements (400 vs 1000)
- Still looks great
- Better performance on mobile/low-end devices

### Q2: Animation Intensity
**Answer:** Full animation suite (Recommended)
- Page transitions, scroll reveals, hover effects, parallax, staggered entrances
- Full cinematic experience

### Q3: Admin Security Level
**Answer:** Maximum security
- 2FA, IP whitelisting, RBAC, CSP reporting, brute-force protection, password complexity, request ID tracking

---

## Quiz 4: UI/UX Design Specifications (22 Questions)

### Q1: Glass Effect Intensity
**Answer:** Heavy glassmorphism (Recommended)
- Heavy blur (20px+), strong transparency, visible glass borders
- Very premium feel

### Q2: Animation Easing Style
**Answer:** Smooth spring (stiffness: 200, damping: 20)
- Smooth, flowing feel
- Elements glide into place
- Elegant

### Q3: Card Hover Effect
**Answer:** All effects combined
- Lift + shadow + scale
- 3D tilt follow cursor
- Glow border follow cursor
- Maximum interactive effect

### Q4: Button Style
**Answer:** Solid purple + glow (Recommended)
- Solid purple background, white text, rounded corners, glow on hover

### Q5: Typography Weight
**Answer:** Bold headings + regular body (Recommended)
- Headings: bold (700)
- Body: regular (400)
- Clean hierarchy

### Q6: Page Section Spacing
**Answer:** Large spacing (Recommended)
- Large gaps between sections (py-20 to py-32)
- Airy, premium feel

### Q7: Scroll Reveal Direction
**Answer:** Fade up (Recommended)
- Elements fade in and slide up from below
- Natural reading flow

### Q8: Image Treatment
**Answer:** Rounded + shadow + border (Recommended)
- Rounded corners (xl/2xl), subtle shadow, border on hover

### Q9: Tag/Chip Style
**Answer:** Purple tint pills (Recommended)
- Small pills with purple tint background, white text
- Subtle

### Q10: Dark Mode Preference
**Answer:** True black (Recommended)
- True black (#000000) background
- OLED-friendly, very dark

### Q11: Navbar Style
**Answer:** Floating pill (current) (Recommended)
- Floating pill navbar that hides on scroll down, shows on scroll up

### Q12: Footer Design
**Answer:** Gradient + glass sections (Recommended)
- Full gradient purple footer with glass sections inside

### Q13: Loading State Style
**Answer:** Skeleton shimmer (Recommended)
- Skeleton placeholders that shimmer
- Content-shaped loading

### Q14: Empty State Design
**Answer:** Illustration + CTA (Recommended)
- Illustration/icon + text + action button
- Friendly and helpful

### Q15: Chat Widget Size
**Answer:** Compact (360x480) (Recommended)
- Fits well on mobile and desktop

### Q16: Notification Toast Style
**Answer:** Glass toast top-right (Recommended)
- Glass card that slides in from top-right
- Purple accent border

### Q17: Admin Panel Theme
**Answer:** Same as frontend (Recommended)
- Same dark purple theme as frontend
- Unified experience

### Q18: Parallax Intensity
**Answer:** Subtle parallax (Recommended)
- Subtle parallax on background elements (orbs, tiles)
- Depth without distraction

### Q19: Form Input Style
**Answer:** Glass inputs (Recommended)
- Glass-style inputs with blur backdrop, purple focus ring

### Q20: Hero Section Animation
**Answer:** Typewriter + stagger fade (Recommended)
- Text types out character by character, then fades in remaining elements

### Q21: Grid Animation Pattern
**Answer:** Staggered waterfall (Recommended)
- Cards fade up one by one in sequence (waterfall effect)

### Q22: Transition Speed
**Answer:** Fast (0.2-0.3s) (Recommended)
- Fast transitions (0.2-0.3s)
- Snappy, responsive feel

### Q23: Scroll-to-Top Button
**Answer:** Floating purple button (Recommended)
- Floating purple circle with arrow, appears after scrolling down
- Fades in/out

---

## Quiz 5: RAG Chatbot System Configuration (22 Questions)

### Q1: Chat Rate Limits (per IP)
**Answer:** Very strict (2/min, 5/hr, 15/day)
- Maximum protection against abuse
- Very limited usage per IP

### Q2: Chat Word Limit
**Answer:** 50 words (Recommended)
- Max 50 words per message
- Short, focused queries

### Q3: Chat Character Limit
**Answer:** 200 chars
- Max 200 characters per message
- Very short messages

### Q4: AI Response Length
**Answer:** 200 chars (short)
- Max 200 characters per response
- Very concise answers

### Q5: Session History Limit
**Answer:** 10 messages
- Keep last 10 messages in conversation history
- Light context

### Q6: Concurrent Chat Limit
**Answer:** 10 concurrent
- Max 10 simultaneous chat sessions
- Light load

### Q7: Embedding Chunk Size
**Answer:** 200 tokens (fine-grained)
- ~200 tokens per chunk
- More chunks, more precise retrieval

### Q8: Vector Search Results
**Answer:** Top 3 (Recommended)
- Return top 3 most relevant chunks
- Very focused context

### Q9: Query Rewriting
**Answer:** Enable query rewriting (Recommended)
- Expand user query into multiple search terms
- Improves recall

### Q10: Re-ranking
**Answer:** Enable LLM re-ranking (Recommended)
- Use LLM to re-rank retrieved chunks by relevance
- More accurate but slower

### Q11: Context Compression
**Answer:** Enable compression (Recommended)
- Remove redundant sentences from context
- Reduces token usage

### Q12: Guardrails Strictness
**Answer:** Strict (ILKOM only) (Recommended)
- Refuse any question not related to ILKOM NEWS content
- Very strict

### Q13: Groundedness Check
**Answer:** Enable groundedness check (Recommended)
- Always verify answer is supported by retrieved context
- Reduces hallucination

### Q14: Chat Session Duration
**Answer:** 15 minutes
- Sessions expire after 15 minutes of inactivity

### Q15: Chat History Retention
**Answer:** 30 days (Recommended)
- Delete chat history after 30 days
- Standard retention

### Q16: Topic Guard
**Answer:** Block all off-topic (Recommended)
- Block programming, math, politics, religion, medical, financial advice

### Q17: Anti-Jailbreak
**Answer:** Full protection (Recommended)
- Block prompt injection, system prompt extraction, role-play attacks

### Q18: Streaming Response
**Answer:** Adaptive polling (Recommended)
- Use adaptive polling (2-15s intervals)
- Works on shared hosting

### Q19: Azure Model Selection
**Answer:** gpt-4o-mini (Recommended)
- Fast, cheap, good for chat
- $0.15/$0.60 per 1M tokens

### Q20: Gemini Fallback Model
**Answer:** gemini-2.5-flash (Recommended)
- Fast, cheap, good for chat
- Free tier: 10 RPM, 250 RPD

### Q21: Embedding Model
**Answer:** Azure text-embedding-3-small (Recommended)
- 1536 dimensions, cheap ($0.02/1M tokens), fast

### Q22: Chatbot Personality
**Answer:** Friendly
- Friendly, helpful, slightly casual
- Approachable tone

### Q23: Fallback Behavior
**Answer:** Error message (Recommended)
- If both LLMs fail, return "I'm having trouble right now. Please try again later."

---

# PART 2: COMPLETE IMPLEMENTATION PLAN

## All Final Decisions Summary

| Category | Decision |
|---|---|
| **Primary LLM** | Azure AI Foundry (`gpt-4o-mini`) |
| **Fallback LLM** | Gemini API (`gemini-2.5-flash`) |
| **Embedding Model** | Azure `text-embedding-3-small` (1536 dims) |
| **Database** | MySQL (migrate from SQLite) |
| **Vector Storage** | MySQL with JSON columns |
| **Chat Memory** | Persistent in MySQL (7 days retention) |
| **Chatbot Widget** | Enhanced WolfyWidget (compact 360x480) |
| **Chatbot Personality** | Friendly |
| **Engagement** | Anonymous + Server Sync |
| **Knowledge Base** | All database content |
| **Real-time** | Adaptive Short Polling (2-15s) |
| **Tiles Background** | Optimized 50x8 grid on all pages except hero/navbar/footer |
| **Glass Effect** | Heavy (20px+ blur, strong transparency) |
| **Animation Easing** | Smooth spring (stiffness: 200, damping: 20) |
| **Card Hover** | All effects combined (lift + 3D tilt + glow) |
| **Button Style** | Solid purple + glow on hover |
| **Typography** | Bold headings (700) + regular body (400) |
| **Section Spacing** | Large (py-20 to py-32) |
| **Scroll Reveal** | Fade up |
| **Image Treatment** | Rounded (xl) + shadow + border on hover |
| **Tags/Chips** | Purple tint pills |
| **Dark Mode** | True black (#000000) |
| **Navbar** | Floating pill (current, hide/show on scroll) |
| **Footer** | Gradient purple + glass sections |
| **Loading** | Skeleton shimmer |
| **Empty States** | Illustration + CTA button |
| **Notifications** | Glass toast top-right |
| **Admin Theme** | Same as frontend (dark purple) |
| **Parallax** | Subtle on background elements |
| **Form Inputs** | Glass style with purple focus ring |
| **Hero Animation** | Typewriter text + stagger fade |
| **Grid Animation** | Staggered waterfall |
| **Transition Speed** | Fast (0.2-0.3s) |
| **Scroll-to-Top** | Floating purple button |
| **Security** | Maximum hardening (2FA, IP whitelist, RBAC, CSP) |
| **Backup** | Git branch |

## Chatbot System Configuration Summary

| Setting | Value |
|---|---|
| **Rate Limits** | 2/min, 5/hr, 15/day per IP |
| **Word Limit** | 50 words per message |
| **Character Limit** | 200 chars per message |
| **AI Response Length** | 200 chars max |
| **Session History** | 10 messages |
| **Concurrent Sessions** | 10 max |
| **Chunk Size** | 200 tokens (fine-grained) |
| **Vector Search Results** | Top 3 |
| **Query Rewriting** | Enabled |
| **Re-ranking** | Enabled (LLM-based) |
| **Context Compression** | Enabled |
| **Guardrails** | Strict (ILKOM only) |
| **Groundedness Check** | Enabled |
| **Session Duration** | 15 minutes |
| **History Retention** | 30 days |
| **Topic Guard** | Block all off-topic |
| **Anti-Jailbreak** | Full protection |
| **Response Delivery** | Adaptive polling (2-15s) |
| **Fallback Behavior** | Error message |

---

## Phase 0: Safety & Setup

### 0.1 Create Backup Branch
```bash
git checkout -b feature/ui-rag-overhaul
```

### 0.2 Database Migration: SQLite → MySQL
- Update `.env` to use MySQL credentials
- Run all 16 existing migrations on MySQL
- Verify table creation

### 0.3 Environment Variables
Add to `.env`:
```
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_ENDPOINT=https://YOUR-RESOURCE.openai.azure.com/openai/v1
GEMINI_API_KEY=your-gemini-key
```

### 0.4 Fix Tiles Import Path
Add `@/` alias to `vite.config.js`:
```js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

---

## Phase 1: Database Schema Updates

### 1.1 New Table: `chat_conversations`
```sql
CREATE TABLE chat_conversations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(64) UNIQUE NOT NULL,
    visitor_id VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_visitor (visitor_id)
);
```

### 1.2 New Table: `chat_messages`
```sql
CREATE TABLE chat_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT UNSIGNED NOT NULL,
    role ENUM('user', 'assistant', 'system') NOT NULL,
    content TEXT NOT NULL,
    token_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id),
    INDEX idx_created (created_at)
);
```

### 1.3 New Table: `knowledge_chunks` (Vector Storage)
```sql
CREATE TABLE knowledge_chunks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    source_type ENUM('news', 'article', 'event', 'project') NOT NULL,
    source_id BIGINT UNSIGNED NOT NULL,
    chunk_text TEXT NOT NULL,
    summary TEXT,
    embedding JSON,
    embedding_model VARCHAR(64),
    token_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_source (source_type, source_id),
    INDEX idx_model (embedding_model)
);
```

### 1.4 New Table: `engagement_interactions`
```sql
CREATE TABLE engagement_interactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    visitor_id VARCHAR(64) NOT NULL,
    interactable_type VARCHAR(255) NOT NULL,
    interactable_id BIGINT UNSIGNED NOT NULL,
    type ENUM('love', 'save', 'seen') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_interaction (visitor_id, interactable_type, interactable_id, type),
    INDEX idx_interactable (interactable_type, interactable_id),
    INDEX idx_visitor (visitor_id)
);
```

### 1.5 Add Columns to Existing Tables
```sql
ALTER TABLE news ADD COLUMN love_count INT DEFAULT 0 AFTER views;
ALTER TABLE news ADD COLUMN save_count INT DEFAULT 0 AFTER love_count;

ALTER TABLE articles ADD COLUMN love_count INT DEFAULT 0 AFTER read_time;
ALTER TABLE articles ADD COLUMN save_count INT DEFAULT 0 AFTER love_count;

ALTER TABLE events ADD COLUMN love_count INT DEFAULT 0 AFTER capacity;
ALTER TABLE events ADD COLUMN save_count INT DEFAULT 0 AFTER love_count;

ALTER TABLE project_submissions ADD COLUMN love_count INT DEFAULT 0 AFTER github_link;
ALTER TABLE project_submissions ADD COLUMN save_count INT DEFAULT 0 AFTER love_count;
```

### 1.6 New Table: `admin_2fa`
```sql
CREATE TABLE admin_2fa (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED UNIQUE NOT NULL,
    secret VARCHAR(64) NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 1.7 New Table: `ip_whitelist`
```sql
CREATE TABLE ip_whitelist (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    label VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_ip (user_id, ip_address),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Phase 2: Backend - AI/RAG Services

### 2.1 Service: `AzureOpenAIService`
**File:** `app/Services/AzureOpenAIService.php`
- Chat completions via Azure AI Foundry
- Embeddings via Azure AI Foundry
- OpenAI-compatible format
- Timeout handling, retry logic

### 2.2 Service: `GeminiService`
**File:** `app/Services/GeminiService.php`
- Text generation via Gemini API (native format)
- Embeddings via Gemini API
- Fallback when Azure fails

### 2.3 Service: `LLMRouter`
**File:** `app/Services/LLMRouter.php`
- Route to Azure (primary) or Gemini (fallback)
- Monitor 429/5xx errors
- Cache provider health for 5 min

### 2.4 Service: `EmbeddingService`
**File:** `app/Services/EmbeddingService.php`
- Generate embeddings for text chunks
- Batch support
- Primary: Azure `text-embedding-3-small` (1536 dims)
- Fallback: Gemini `gemini-embedding-001` (3072 dims)

### 2.5 Service: `VectorSearchService`
**File:** `app/Services/VectorSearchService.php`
- Store embeddings in `knowledge_chunks`
- Cosine similarity calculation
- Hybrid search: vector + SQL LIKE
- Reciprocal Rank Fusion
- Top-K retrieval (Top 3)

### 2.6 Service: `KnowledgeIndexer`
**File:** `app/Services/KnowledgeIndexer.php`
- Semantic chunking (~200 token chunks, 50 token overlap)
- Generate embeddings for chunks
- Auto-reindex on content changes
- Artisan command: `php artisan knowledge:reindex`

### 2.7 Service: `RAGPipeline`
**File:** `app/Services/RAGPipeline.php`
- Query rewriting (expand user queries)
- Multi-vector retrieval
- Re-ranking (LLM-based)
- Context compression
- Guardrails (strict ILKOM only)
- Groundedness check

### 2.8 Update: `ChatController`
**File:** `app/Http/Controllers/ChatController.php`
- Replace LIKE search with `VectorSearchService`
- Use `RAGPipeline` for full RAG workflow
- Use `LLMRouter` for Azure/Gemini fallback
- Persist messages to `chat_messages`
- Adaptive polling support (`last_message_id`)
- Rate limits: 2/min, 5/hr, 15/day per IP
- Word limit: 50 words
- Character limit: 200 chars
- AI response: 200 chars max
- Session history: 10 messages
- Concurrent sessions: 10 max
- Session duration: 15 minutes

### 2.9 New: `InteractionController`
**File:** `app/Http/Controllers/InteractionController.php`
```
POST   /api/interactions          # Create (love/save/seen)
DELETE /api/interactions          # Remove
GET    /api/interactions/check    # Check visitor interaction
GET    /api/interactions/counts   # Get counts
```

### 2.10 New: `ChatHistoryController`
**File:** `app/Http/Controllers/ChatHistoryController.php`
```
GET /api/chat/{sessionId}/messages?last_id=0
```

### 2.11 Scheduled Job: `PruneChatHistory`
**File:** `app/Console/Commands/PruneChatHistory.php`
- Delete chat history older than 30 days
- Run daily via scheduler

---

## Phase 3: Frontend - Design System Specifications

### 3.1 CSS Variables Update
**File:** `index.css`

Update existing variables:

```css
:root {
  /* Glass - HEAVY */
  --glass-blur: blur(24px) saturate(200%);
  --glass-bg: rgba(255, 255, 255, 0.65);
  --glass-border: rgba(255, 255, 255, 0.5);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);

  /* Typography */
  --font-heading-weight: 700;
  --font-body-weight: 400;

  /* Transitions */
  --transition-fast: 0.2s cubic-bezier(0.20, 1.00, 0.20, 1.00);
  --transition-smooth: 0.3s cubic-bezier(0.20, 1.00, 0.20, 1.00);

  /* Spacing */
  --section-gap: 8rem; /* py-32 */
}

.dark {
  --bg-primary: #000000; /* TRUE BLACK */
  --glass-bg: rgba(28, 28, 30, 0.65);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}
```

---

## Phase 4: Frontend - Tiles Background System

### 4.1 Update Tiles Component
**File:** `components/ui/Tiles.jsx`

```jsx
import React, { memo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const tileSizes = {
  sm: "w-8 h-8",
  md: "w-9 h-9 md:w-12 md:h-12",
  lg: "w-12 h-12 md:w-16 md:h-16",
}

export const Tiles = memo(function Tiles({
  className,
  rows = 50,
  cols = 8,
  tileClassName,
  tileSize = "md",
}) {
  const rowsArray = new Array(rows).fill(1)
  const colsArray = new Array(cols).fill(1)

  return (
    <div
      className={cn(
        "pointer-events-none relative z-0 flex flex-col items-center justify-center",
        className
      )}
    >
      {rowsArray.map((_, i) => (
        <div key={`row-${i}`} className={cn("flex", tileClassName)}>
          {colsArray.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: "var(--tile)",
                transition: { duration: 0 }
              }}
              key={`col-${j}`}
              className={cn(
                tileSizes[tileSize],
                "border-r border-b dark:border-neutral-900/50 border-neutral-200/30",
                tileClassName
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
})
```

### 4.2 Create: `PageBackground` Component
**File:** `components/ui/PageBackground.jsx`

```jsx
import { cn } from "@/lib/utils"
import { Tiles } from "./Tiles"

export function PageBackground({ children, className }) {
  return (
    <div className={cn("relative min-h-screen", className)}>
      <Tiles
        className="fixed inset-0 z-0 opacity-20 dark:opacity-10"
        rows={50}
        cols={8}
        tileSize="md"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
```

### 4.3 Apply to All Pages
Pages to wrap with `PageBackground`:
- `NewsPage.jsx`
- `EventsPage.jsx`
- `IlkomGalleryPage.jsx`
- `DetailPage.jsx`
- `SubmitProjectPage.jsx`
- `TrackPage.jsx`
- `KoleksiPage.jsx`

Pages EXCLUDED (no Tiles):
- `HomePage.jsx` (HeroSection has its own background)
- `Navbar.jsx`
- `Footer.jsx`

---

## Phase 5: Frontend - Full Animation Suite

### 5.1 Page Transitions
**File:** `App.jsx`

```jsx
import { AnimatePresence } from "framer-motion"

<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    {/* routes */}
  </Routes>
</AnimatePresence>
```

Each page gets:
```jsx
import { motion } from "framer-motion"

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.20, 1.00, 0.20, 1.00] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
}

<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
  {/* page content */}
</motion.div>
```

### 5.2 Scroll-Triggered Animations
**File:** `hooks/useScrollAnimation.js`

Enhance with:
- `whileInView` for all section headers
- Staggered grid entrance
- Subtle parallax on background orbs
- Scale-on-scroll for cards (0.95 -> 1.0)

### 5.3 Hero Section Typewriter + Stagger
**File:** `components/home/HeroSection.jsx`

```jsx
const typewriterVariants = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: { duration: 1.5, ease: "easeInOut" }
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 1.5 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.20, 1.00, 0.20, 1.00] } }
}
```

### 5.4 Card Hover - All Effects Combined
**File:** `components/ui/GlowCard.jsx` + `ExpandableCard.jsx`

```jsx
const springConfig = { type: "spring", stiffness: 200, damping: 20 }

<motion.div
  whileHover={{
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(122, 71, 166, 0.3)",
    transition: springConfig
  }}
  style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
>
  {/* glow pseudo-element via CSS */}
</motion.div>
```

### 5.5 Button Styles
```jsx
const buttonVariants = {
  rest: { scale: 1, boxShadow: "0 4px 12px rgba(122, 71, 166, 0.2)" },
  hover: {
    scale: 1.05,
    boxShadow: "0 6px 24px rgba(122, 71, 166, 0.5)",
    transition: { type: "spring", stiffness: 200, damping: 20 }
  },
  tap: { scale: 0.95 }
}
```

### 5.6 Grid Animation - Staggered Waterfall
```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
}
```

### 5.7 Floating Scroll-to-Top Button
**File:** `components/ui/ScrollToTop.jsx`

```jsx
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1, boxShadow: "0 6px 24px rgba(122, 71, 166, 0.6)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
```

### 5.8 Navbar Enhancements
- Smooth hide/show on scroll (already exists)
- Active tab: animated sliding underline
- Dropdown: scale + fade + blur entrance
- Logo: subtle pulse on hover

### 5.9 Micro-Interactions
- Button hover: scale 1.05 + glow shadow
- Button tap: scale 0.95
- Input focus: border glow animation
- Tab switch: smooth underline slide
- Card hover: lift + tilt + glow
- Link hover: underline slide animation

### 5.10 Loading States
```jsx
// Skeleton shimmer
<div className="animate-pulse bg-[var(--bg-secondary)] rounded-xl h-48" />

// Content fade-in on load
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {/* loaded content */}
</motion.div>
```

### 5.11 Reduced Motion Support
```jsx
const prefersReducedMotion = useReducedMotion()

const springConfig = prefersReducedMotion
  ? { duration: 0 }
  : { type: "spring", stiffness: 200, damping: 20 }
```

---

## Phase 6: Frontend - Enhanced Chatbot Widget

### 6.1 WolfyWidget Enhancements
**File:** `components/chat/WolfyWidget.jsx`

Add:
- "Online" status header with green dot + pulse animation
- FAQ section (scrollable, 8 items)
- Typing indicator persists until AI responds
- Scrollbar-gutter fix
- Compact size: 360x480px
- Friendly personality in greeting

### 6.2 New Hook: `useAdaptivePolling.js`
Behavior:
- Active: 2s
- Idle 30s: 5s
- Tab hidden: 15s

### 6.3 New Hook: `useVisitorId.js`
- Generate unique ID
- Persist in localStorage

---

## Phase 7: Frontend - Detail Views Refactor

### 7.1 DetailPage.jsx Redesign
- Responsive grid
- Profile section for author/creator
- InteractionBar (Love/Save/Seen)
- Tag rendering fixes
- Smooth scroll

### 7.2 NewsPage.jsx
- Fix tag rendering
- Tag-based filtering
- Grid layout

### 7.3 EventsPage.jsx
- Event-specific features

### 7.4 IlkomGalleryPage.jsx
- Limit homepage to 4 newest

### 7.5 New: `InteractionBar.jsx`
Reusable Love/Save/Seen with:
- Animated icons
- Count display
- Optimistic UI
- localStorage + server sync

---

## Phase 8: Backend - Security Maximum Hardening

### 8.1 CSRF Protection
- Add CSRF middleware to all state-changing routes

### 8.2 Input Sanitization
- HTML purifier on all inputs
- Max length on all fields
- tech_stack: max 20 items, each max 64 chars
- collaborators: max 10 items, each max 128 chars

### 8.3 Rate Limiting
```
POST /submissions: 5/min per IP
POST /chat: 2/min, 5/hr, 15/day per IP (very strict)
POST /admin/login: 5/min per email+IP
All admin: 120/min per user
```

### 8.4 Admin 2FA
- TOTP-based (Google Authenticator)
- QR code setup
- Backup codes
- Required for all admin accounts

### 8.5 IP Whitelisting
- Optional per admin user
- Configurable in settings
- Block non-whitelisted IPs

### 8.6 Password Complexity
- Min 12 characters
- Uppercase + lowercase + number + special
- Check against breached databases

### 8.7 Session Security
- 30 min idle timeout
- 3 concurrent sessions max
- Session fingerprinting
- Force logout on password change

### 8.8 Audit Trail
- All admin actions logged
- IP, user agent, request hash
- Failed 2FA attempts logged

### 8.9 CSP Reporting
- `report-uri` directive
- Log violations to `audit_logs`
- Monitor XSS attempts

### 8.10 Request ID Tracking
- `X-Request-ID` per request
- Included in all logs

### 8.11 Login Cleanup
- Prune `login_attempts` older than 30 days

### 8.12 CORS Hardening
- `max_age: 86400`
- Validate `FRONTEND_URL`

### 8.13 APP_DEBUG Check
- Ensure `APP_DEBUG=false` in production

---

## Phase 9: Backend - Tech Stack Enhancement

### 9.1 Validation
```php
'tech_stack' => 'nullable|array|max:20',
'tech_stack.*' => 'string|max:64|regex:/^[a-zA-Z0-9\s\-\.\+#]+$/',
```

### 9.2 Sanitization
- Strip HTML
- Remove special chars
- Normalize whitespace

### 9.3 Admin Management
- Predefined list + custom entries
- Display in admin detail

---

## Phase 10: Knowledge Base Indexing

### 10.1 Artisan Command
```bash
php artisan knowledge:reindex
php artisan knowledge:reindex --type=news
php artisan knowledge:reindex --force
```

### 10.2 Chunking Strategy
- ~200 token chunks (fine-grained)
- 50 token overlap
- Summary per chunk
- Both vectors stored

### 10.3 Auto-Indexing
- Hook into CRUD operations
- Queue heavy re-indexing

---

## Implementation Order

| Phase | Priority | Effort | Dependencies |
|---|---|---|---|
| **Phase 0** | CRITICAL | 30 min | None |
| **Phase 1** | CRITICAL | 1-2 hrs | Phase 0 |
| **Phase 2** | CRITICAL | 4-6 hrs | Phase 1 |
| **Phase 3** | HIGH | 1-2 hrs | Phase 0 |
| **Phase 4** | HIGH | 2-3 hrs | Phase 3 |
| **Phase 5** | HIGH | 4-5 hrs | Phase 3, 4 |
| **Phase 6** | HIGH | 3-4 hrs | Phase 2 |
| **Phase 7** | MEDIUM | 3-4 hrs | Phase 5 |
| **Phase 8** | HIGH | 3-4 hrs | Phase 1 |
| **Phase 9** | MEDIUM | 1-2 hrs | Phase 1 |
| **Phase 10** | MEDIUM | 2-3 hrs | Phase 2 |

**Total estimated effort:** 28-39 hours

---

## Budget Estimate

| Service | Monthly Cost |
|---|---|
| Azure `gpt-4o-mini` (chat) | ~$0.10-$0.35 |
| Azure `text-embedding-3-small` | ~$0.01 |
| Gemini `gemini-2.5-flash` (fallback) | ~$0.00 (free tier) |
| **Total** | **~$0.11-$0.36/month** |

---

## Key Files Reference

### Frontend
- `frontend/src/App.jsx` - Main routing + layout
- `frontend/src/index.css` - CSS variables + theme
- `frontend/src/components/ui/Tiles.jsx` - Background tiles
- `frontend/src/components/ui/GlowCard.jsx` - Glow effect card
- `frontend/src/components/ui/ExpandableCard.jsx` - 3D tilt card
- `frontend/src/components/chat/WolfyWidget.jsx` - Chatbot widget
- `frontend/src/components/home/HeroSection.jsx` - Hero section
- `frontend/src/components/layout/Navbar.jsx` - Navigation
- `frontend/src/components/layout/Footer.jsx` - Footer
- `frontend/src/hooks/useScrollAnimation.js` - Scroll animations
- `frontend/src/hooks/useReducedMotion.js` - Reduced motion
- `frontend/src/pages/` - All page components

### Backend
- `backend/app/Http/Controllers/ChatController.php` - Chat API
- `backend/app/Models/LlmProvider.php` - LLM provider model
- `backend/app/Http/Middleware/SecurityHeaders.php` - Security headers
- `backend/app/Http/Middleware/AdminOnly.php` - Admin guard
- `backend/routes/api.php` - API routes
- `backend/config/cors.php` - CORS config
- `backend/config/sanctum.php` - Auth config
- `backend/database/migrations/` - All migrations

---

*Plan created: July 3, 2026*
*Status: Ready for implementation*
