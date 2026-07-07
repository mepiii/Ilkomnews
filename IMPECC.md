# /impeccable Orchestrator Prompt
## Systematic Design & Build Workflow

**Purpose**: Full-cycle website design audit, refinement, and polish using specialized skill-based passes. Verification-first, no speculation, actionable output only.

---

## Phase 0: Init & Context Gathering
**Command**: `/impeccable init [project-name]`

**Goal**: Establish design system baseline, document existing patterns, set build constraints.

### Steps
1. **Audit existing state**
   - Scan codebase structure (React/Vue/HTML layout)
   - Identify current design tokens (colors, spacing, typography)
   - List all active components and their variants
   - Document design system existence (or lack thereof)

2. **Generate PRODUCT.md**
   - User persona + use cases
   - Core user flows
   - Success metrics (KPIs)
   - Constraints (hosting, performance budget, device targets)

3. **Generate DESIGN.md**
   - Current palette with hex/var references
   - Typography rules (font family, scale, line-height)
   - Spacing scale and grid system
   - Component inventory with screenshots
   - Dark/light mode spec
   - Responsive breakpoints

4. **Configure live mode**
   - Dev server with hot reload (Vite/Next.js)
   - Browser DevTools setup (responsive view, Lighthouse)
   - Screenshot comparison baseline

5. **Next steps**
   - Recommend top 3 problem areas from audit
   - Suggest priority order (quick wins → structural)
   - Set acceptance criteria per phase

**Output**: PRODUCT.md, DESIGN.md, baseline screenshots, audit report (no speculation)

---

## Phase 1: Shape (UX/UI Planning)
**Commands**: `/impeccable shape`, `/impeccable critique`

### /impeccable shape
**Goal**: Plan interaction design and visual hierarchy before code changes.

1. **Analyze current UX**
   - Trace user journeys (happy path + error cases)
   - Identify clarity gaps, cognitive load points
   - Spot missing states (empty, loading, error, locked)

2. **Design improvements**
   - Wireframe key screens (ASCII or simple SVG)
   - Define interaction patterns (click → feedback → result)
   - Map information hierarchy (primary → secondary → tertiary)
   - Specify motion triggers (where, why, duration)

3. **Validate against personas**
   - Does this solve the stated user problem?
   - Is it faster/clearer than current state?
   - Accessibility check (keyboard nav, screen reader, color contrast)

**Output**: Interaction specs, wireframes, before/after comparison

### /impeccable critique
**Goal**: UX design review—catch clarity and emotional resonance issues early.

1. **Hierarchy review**
   - Is the primary action obvious?
   - Do secondary elements distract?
   - Is progressive disclosure used?

2. **Clarity check**
   - Can a new user understand this flow in 5 seconds?
   - Are error messages actionable?
   - Are labels/placeholders clear?

3. **Emotional resonance**
   - Does it feel polished or rough?
   - Does tone match brand (professional, playful, minimal)?
   - Are micro-interactions delightful or jarring?

**Output**: Critique checklist with specific fixes

---

## Phase 2: Document (Design System Extraction)
**Commands**: `/impeccable document`, `/impeccable extract`

### /impeccable document
**Goal**: Generate DESIGN.md from existing code.

1. **Scan source files** (CSS/Tailwind/Styled Components)
   - Extract color definitions (CSS vars, Hex, RGB)
   - List typography usage (font-family, font-size, font-weight)
   - Map spacing values (padding, margin, gap)
   - Identify shadows, borders, border-radius patterns

2. **Catalog components**
   - Component name, file path, variants
   - Props/states (default, hover, active, disabled, loading, error)
   - Screenshot of each variant
   - Used in: [list of pages]

3. **Document patterns**
   - Breakpoints in use
   - Dark/light mode approach (CSS vars, Tailwind toggling, etc.)
   - Animation library and conventions
   - Icons system (SVG, icon font, sprite)

**Output**: DESIGN.md with all values, component grid, usage counts

### /impeccable extract
**Goal**: Pull reusable components and tokens into formal design system.

1. **Token extraction**
   - Create tokens.json or similar (color, spacing, typography, shadows)
   - Namespace tokens logically (color.bg.primary, spacing.sm, etc.)
   - Document token naming rules for consistency

2. **Component identification**
   - Which components are reusable vs. one-offs?
   - What variants exist?
   - What's duplicated across projects?

3. **Design system file structure**
   - /design/tokens.ts (or .json)
   - /design/components/
   - /design/patterns.md (when to use which component)

**Output**: Formal design system, tokens file, component inventory

---

## Phase 3: Build Quality Passes
**Commands**: `/impeccable audit`, `/impeccable harden`, `/impeccable optimize`

### /impeccable audit
**Goal**: Technical quality checks—a11y, performance, responsive design.

1. **Accessibility audit**
   - WCAG 2.1 AA compliance check
   - Color contrast ratios (target 4.5:1 text, 3:1 graphics)
   - Keyboard navigation (Tab order, focus states visible)
   - Screen reader testing (ARIA labels, semantic HTML)
   - Form labels linked to inputs

2. **Performance audit**
   - Lighthouse score (target 90+)
   - Core Web Vitals: LCP, FID, CLS
   - Bundle size (JS/CSS/images)
   - Image optimization (modern formats, srcset)
   - Network waterfall analysis

3. **Responsive audit**
   - Test breakpoints: 375px, 768px, 1024px, 1440px
   - Touch target sizes (min 44×44px)
   - Text readability on small screens
   - Layout stability (no jumps on load)

4. **Cross-browser testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Android Chrome)
   - Report inconsistencies

**Output**: Audit report with specific fixes, pass/fail per criterion

### /impeccable harden
**Goal**: Edge case handling—error states, i18n, text overflow, slow networks.

1. **Error state coverage**
   - Network timeout, 404, 500 handlers
   - Form validation errors (per-field + summary)
   - Loading state UX (skeleton screens, spinners, estimated time)
   - Empty state copy and imagery

2. **Text overflow protection**
   - Text truncation (ellipsis or wrapping)
   - Long URLs, emails, usernames
   - Multi-language text expansion (German +30%, Arabic RTL)

3. **i18n readiness**
   - Strings extracted from UI
   - Pluralization rules
   - Date/number/currency formatting
   - RTL text support if needed

4. **Performance under constraints**
   - Low bandwidth (fast 3G: >3s load is OK but not good)
   - Low-end devices (slow JS execution)
   - Offline capability (if applicable)

**Output**: Hardening checklist with code diffs

### /impeccable optimize
**Goal**: Performance improvements—code splitting, caching, rendering optimization.

1. **Bundle analysis**
   - Identify large dependencies (use bundlesize tools)
   - Tree-shake unused code
   - Code-split by route (lazy load)

2. **Rendering optimization**
   - Memoization (React.memo, useMemo)
   - Reduce re-render triggers
   - Defer non-critical rendering

3. **Caching strategy**
   - HTTP cache headers (max-age, immutable)
   - Service Worker for offline + fast reload
   - Image caching (CDN)

4. **Image optimization**
   - Use next-gen formats (WebP with JPEG fallback)
   - Responsive images (srcset)
   - Lazy-load below the fold

**Output**: Performance plan with metrics before/after

---

## Phase 4: Visual Design Passes
**Commands**: `/impeccable typeset`, `/impeccable layout`, `/impeccable colorize`, `/impeccable distill`

### /impeccable typeset
**Goal**: Fix font choices, hierarchy, and sizing.

1. **Font audit**
   - Current fonts vs. brand guidelines
   - Are we using system fonts or web fonts?
   - Load time impact (Google Fonts, local, variable fonts)

2. **Hierarchy refinement**
   - H1 → H6 sizing scale (check 1.25× or 1.5× ratio)
   - Body text: 16px (16/1.5 line-height) minimum on mobile
   - Line length 50–75 characters (optimal readability)

3. **Font pairing**
   - Serif + Sans pairing (if applicable)
   - Monospace for code/data
   - Font weights available (regular, medium, bold, extra-bold)

4. **Spacing refinement**
   - Letter-spacing for headlines (tighter is modern)
   - Line-height for readability (1.5 body, 1.2 headings)
   - Paragraph spacing (1em–1.5em gap)

**Output**: Typography spec (CSS with values), updated type scale

### /impeccable layout
**Goal**: Fix layout, spacing, and visual rhythm.

1. **Grid & alignment**
   - Define grid system (8px, 12-column, etc.)
   - Check all elements align to grid
   - Consistent gutter sizes

2. **Whitespace audit**
   - Too tight (elements feel cramped)?
   - Too loose (elements feel disconnected)?
   - Apply spacing scale consistently (4px → 8px → 16px → 32px)

3. **Visual rhythm**
   - Section heights proportional?
   - Repeating pattern (cards, lists) feel balanced?
   - Breathing room around call-to-action elements

4. **Component spacing**
   - Padding rules inside components (p-xs, p-sm, p-md)
   - Margin rules between components (gap scale)
   - Consistent button sizes, form field heights

**Output**: Layout spec (CSS grid values), spacing scale table

### /impeccable colorize
**Goal**: Introduce strategic color (or simplify if oversaturated).

1. **Color audit**
   - Count unique colors in use
   - Identify primary, secondary, accent roles
   - Check contrast ratios again

2. **Strategic color application**
   - Primary: main CTA, key accent
   - Secondary: supporting CTAs, highlights
   - Error/Warning/Success: semantic colors
   - Neutral scale: backgrounds, borders, text

3. **Dark mode audit**
   - Sufficient contrast in dark mode too?
   - Colors readable when inverted?
   - Shadows/glows work in dark?

4. **Color meaning**
   - Does color communicate function (danger = red)?
   - Is it culturally appropriate?
   - Sufficient distinction from background?

**Output**: Color palette spec (with semantic roles and contrast ratios)

### /impeccable distill
**Goal**: Strip to essence—remove unnecessary visual noise.

1. **Element audit**
   - Every element serve a purpose?
   - Redundant labels/icons?
   - Over-decorated components?

2. **Visual debt identification**
   - Outdated effects (skeuomorphism, excessive shadows)?
   - Inconsistent element styles?
   - Noise (borders, backgrounds, dividers) that don't add clarity?

3. **Minimization passes**
   - Remove 30% of borders
   - Reduce color count by 20%
   - Simplify shadows (1–2px blur only)
   - Delete decorative elements that don't reinforce brand

4. **Refinement**
   - Focus on content clarity
   - Use negative space strategically
   - Let typography breathe

**Output**: Simplified design, before/after comparison

---

## Phase 5: Delight & Polish
**Commands**: `/impeccable animate`, `/impeccable delight`, `/impeccable overdrive`, `/impeccable bolder`, `/impeccable quieter`

### /impeccable animate
**Goal**: Add purposeful motion (not decoration).

1. **Identify motion opportunities**
   - Page transitions (fade, slide)
   - Button feedback (ripple, scale on click)
   - Hover states (color change, subtle lift)
   - Loading states (spinners, skeleton screens, progress bars)
   - Scrolling reveals (fade-in on scroll, parallax if justified)

2. **Motion principles**
   - Easing: ease-out for entrance, ease-in for exit
   - Duration: 200–300ms for micro-interactions, 500ms+ for page transitions
   - Don't animate: transform and opacity only (GPU-accelerated)
   - Avoid motion if prefers-reduced-motion is set

3. **Implementation**
   - CSS transitions for simple state changes
   - Framer Motion or GSAP for complex sequences
   - Test on low-end devices (should still feel smooth)

**Output**: Animation spec with timings, easing curves, and code examples

### /impeccable delight
**Goal**: Add moments of joy (micro-interactions that surprise positively).

1. **Identify delight moments**
   - Success state (check animation, confetti on form submit?)
   - Empty state (friendly illustration, encouraging copy)
   - 404 error (playful message, helpful suggestions)
   - First-time user (onboarding tour, easter eggs)

2. **Delight principles**
   - Unexpected but not jarring
   - Reinforce brand personality
   - Don't disrupt core task
   - Optional (never mandatory to understand)

3. **Implementation examples**
   - Cursor effects (follow, color change on hover)
   - Easter eggs (Konami code, hidden animations)
   - Sound effects (optional, small file sizes)
   - Particle effects (confetti, stars on success)

**Output**: Delight spec with locations, trigger conditions, and code

### /impeccable overdrive
**Goal**: Add technically extraordinary effects (WebGL, advanced CSS, etc.).

1. **Identify high-impact moments**
   - Hero section (immersive background, 3D parallax)
   - Data visualization (interactive charts, animated graphs)
   - Product showcase (3D model viewer, morphing shapes)
   - Transitions (page wipes, dissolves, complex animations)

2. **Technique options**
   - Three.js for 3D (models, particles, shaders)
   - Lottie for complex animations
   - Advanced CSS (clip-path, blend-modes, filters)
   - Canvas for custom graphics

3. **Performance trade-off**
   - Impact on Core Web Vitals?
   - Can it be disabled gracefully?
   - Does it work on low-end devices?

4. **Justification check**
   - Does it add emotional impact or just novelty?
   - Is it worth the bundle size increase?
   - Does it reinforce brand or feel tacked-on?

**Output**: Overdrive spec with technique, implementation, and fallbacks

### /impeccable bolder
**Goal**: Amplify boring designs—add contrast, personality, distinctive patterns.

1. **Identify flatness**
   - Low color contrast (all muted grays)?
   - Weak typography hierarchy?
   - Generic component styling?
   - Missing brand personality?

2. **Amplification strategies**
   - Increase contrast (darker darks, brighter brights)
   - Add brand color strategically
   - Use expressive typography (larger headlines, varied weights)
   - Introduce textures or patterns
   - Add distinctive shapes (border-radius variance, unusual component shapes)

3. **Brand reinforcement**
   - Color should communicate brand (not just random bright colors)
   - Typography should feel intentional
   - Components should have distinctive style

**Output**: Bolder design spec with specific color/typography/shape changes

### /impeccable quieter
**Goal**: Tone down overly bold designs—reduce visual noise, simplify.

1. **Identify excess**
   - Too many colors competing?
   - Typography hierarchy unclear (too many sizes)?
   - Excessive borders, shadows, textures?
   - Visual chaos makes scanning hard?

2. **Simplification strategies**
   - Reduce color palette (target 3–4 primary colors max)
   - Decrease font size range (fewer scales)
   - Remove decorative elements
   - Increase whitespace
   - Subtle shadows instead of strong ones

3. **Clarity maintenance**
   - Hierarchy must still be clear
   - Brand still recognizable
   - Professional appearance

**Output**: Quieter design spec with removals and simplifications documented

---

## Phase 6: Content & UX Refinement
**Commands**: `/impeccable clarify`, `/impeccable onboard`

### /impeccable clarify
**Goal**: Improve unclear UX copy—labels, CTAs, error messages, hints.

1. **Copy audit**
   - Is every label clear (not jargon)?
   - Are CTAs action-focused (not "Submit")?
   - Are error messages actionable?
   - Are hints/placeholders helpful?

2. **CTA audit**
   - "Buy now" vs. "Add to cart"
   - "Learn more" vs. "Explore our library"
   - Button text matches user intent
   - Microcopy context-specific

3. **Error message refinement**
   - Technical error → user-friendly explanation
   - Suggested action (not just "Error 400")
   - Tone matches brand

4. **Form clarity**
   - Labels above inputs (not inside)
   - Required/optional clearly marked
   - Helper text for complex fields
   - Inline validation feedback

**Output**: Copy spec with before/after, updated strings

### /impeccable onboard
**Goal**: First-run flows, empty states, activation paths.

1. **First-time user experience**
   - Welcome screen with clear value prop
   - Quick setup flow (3–5 steps max)
   - Calls to action for next steps
   - Escape hatch (skip onboarding)

2. **Empty state design**
   - Illustration + friendly copy
   - Guidance (how to populate this state)
   - CTA to create first item
   - Example data if helpful

3. **Activation paths**
   - What's the first "aha" moment?
   - Fastest path to core value
   - Social proof/data if applicable

4. **Persistence**
   - Remember onboarding complete
   - Reveal advanced features gradually
   - Progressive disclosure

**Output**: Onboarding flow spec, empty state designs, activation checklist

---

## Phase 7: Responsive & Cross-Device
**Commands**: `/impeccable adapt`

**Goal**: Optimize for different devices (mobile, tablet, desktop).

1. **Breakpoint testing**
   - 375px (iPhone SE)
   - 768px (iPad)
   - 1024px (iPad Pro)
   - 1440px (desktop)
   - 1920px (ultrawide)

2. **Mobile-first audit**
   - Stacking vs. side-by-side layout
   - Touch targets (44×44px minimum)
   - Single-column or 2-column at tablet
   - Megamenu vs. hamburger

3. **Desktop optimizations**
   - Multi-column layouts
   - Hover states (popovers, previews)
   - Keyboard shortcuts
   - Richer information density (if justified)

4. **Orientation handling**
   - Portrait vs. landscape on mobile
   - iPad in both orientations

**Output**: Responsive spec with breakpoint rules, layouts per size

---

## Phase 8: Shipping Readiness
**Commands**: `/impeccable polish`, `/impeccable live`

### /impeccable polish
**Goal**: Final pass—design system alignment, shipping readiness.

1. **System alignment check**
   - All components match design system tokens?
   - Spacing consistent with scale?
   - Typography using defined styles?
   - Color palette matches spec?

2. **Cross-component consistency**
   - Button styles match everywhere
   - Form fields consistent
   - Modals/dialogs follow pattern
   - Cards and containers aligned

3. **Browser/device consistency**
   - Rendered identically on Chrome, Firefox, Safari, Edge?
   - Mobile and desktop render correctly?
   - Dark mode consistent?

4. **Shipping checklist**
   - No console errors or warnings
   - No layout shifts (CLS < 0.1)
   - Images optimized
   - Code minified and split
   - Tests passing
   - Analytics tracked
   - Error logging configured

**Output**: Polish checklist with pass/fail status, shipping sign-off

### /impeccable live
**Goal**: Visual variant mode—iterate on elements in browser.

1. **Enable variant mode**
   - Create /variants route or page
   - Display all components in all states (default, hover, active, disabled, loading, error)
   - Interactive controls to toggle variant properties

2. **Element library view**
   - Buttons (all sizes, colors, states)
   - Form fields (text, select, checkbox, radio, etc.)
   - Cards, modals, dropdowns, tooltips
   - Typography scale
   - Color palette
   - Icons

3. **Interactive iteration**
   - Toggle dark/light mode
   - Adjust spacing, color interactively
   - Test responsive breakpoints
   - Screenshot variants for export

4. **Documentation**
   - Copy component code
   - Document prop requirements
   - Link to design spec

**Output**: Live component library, variant grid, exportable screenshots

---

## Execution Model: Verification-First

### Per-Phase Workflow
1. **Plan**: State goal and acceptance criteria
2. **Execute**: Make changes to code/design
3. **Verify**: Check against criteria (no speculation)
4. **Report**: Document what changed and why
5. **Next**: Move to next phase or iterate if criteria unmet

### Verification Rules
- No "probably works" claims
- Test every assertion (Lighthouse, manual, code inspection)
- If can't verify, note as assumption
- Screenshot before/after whenever possible
- Metrics backed by tools (not intuition)

### Context Window Strategy
- Work with one phase at a time
- Full project load on `/impeccable init`
- Subsequent commands assume context from previous phases
- Clear handoff notes between phases

---

## Quick Reference: When to Use Each Command

| Goal | Command |
|------|---------|
| Start a project audit | `/impeccable init` |
| Plan UX before coding | `/impeccable shape` |
| Review design for clarity | `/impeccable critique` |
| Extract design system | `/impeccable document` + `/impeccable extract` |
| Check a11y + performance | `/impeccable audit` |
| Handle edge cases | `/impeccable harden` |
| Speed up website | `/impeccable optimize` |
| Fix typography | `/impeccable typeset` |
| Fix spacing & alignment | `/impeccable layout` |
| Simplify noise | `/impeccable distill` |
| Add motion | `/impeccable animate` |
| Add magic moments | `/impeccable delight` |
| Go next-level technical | `/impeccable overdrive` |
| Make design pop | `/impeccable bolder` |
| Tame visual chaos | `/impeccable quieter` |
| Improve copy | `/impeccable clarify` |
| Add onboarding | `/impeccable onboard` |
| Fix responsive design | `/impeccable adapt` |
| Final check before ship | `/impeccable polish` |
| Build component library | `/impeccable live` |

---

## Usage Examples

### Improve Apti's design end-to-end
```
1. /impeccable init apti
   → Gather context, document current state, identify top issues
   
2. /impeccable shape
   → Plan UX improvements for decision flow
   
3. /impeccable critique
   → Review clarity and emotional fit
   
4. /impeccable audit
   → Check a11y and performance
   
5. /impeccable typeset + /impeccable layout
   → Refine typography and spacing
   
6. /impeccable colorize
   → Add strategic brand color
   
7. /impeccable animate
   → Add feedback animations for decisions
   
8. /impeccable polish
   → Final check, ship
```

### Quick polish on SAPA
```
1. /impeccable audit
   → Identify blockers
   
2. /impeccable harden
   → Add error states
   
3. /impeccable optimize
   → Performance improvements
   
4. /impeccable polish
   → Ship
```

### Redesign IlkomNews hero section
```
1. /impeccable shape
   → Wireframe new hero
   
2. /impeccable colorize
   → Strategic color palette
   
3. /impeccable overdrive
   → Add parallax or 3D effect
   
4. /impeccable animate
   → Motion on scroll
   
5. /impeccable polish
   → Check all states
```

---

## Configuration for Projects

### Apti (React/Vite, decision-support app)
- Design tokens: /src/styles/tokens.ts
- Components: /src/components/
- Design system: /docs/DESIGN.md
- Live variant page: /src/routes/variants.jsx

### SAPA (student feedback platform)
- Design tokens: /src/theme/index.ts
- Components: /src/components/
- Design system: /docs/DESIGN.md
- Live variant page: /src/pages/design-system.jsx

### IlkomNews (news portal with RAG chatbot)
- Design tokens: /app/styles/tokens.ts
- Components: /app/components/
- Design system: /public/docs/DESIGN.md
- Live variant page: /app/pages/design-system.jsx

### Spark (PKKMB Faculty 2026 website)
- Design tokens: /public/design/tokens.json
- Components: /components/
- Design system: /public/DESIGN.md
- Live variant page: /pages/design-system.html

---

## Notes

- This prompt is reusable. Copy it to your project and customize per-project sections.
- Run phases sequentially; each builds on the previous.
- Use `/impeccable live` to create an interactive component variant viewer for ongoing iteration.
- Always verify before claiming completion. Intuition ≠ fact.
- When unsure about a change, defer to data (Lighthouse, contrast checker, user testing).
