# Life RPG — Full Project Context

This document summarizes an entire planning conversation for a hackathon project. Paste this whole document into a new Claude conversation so it has full context before asking follow-up questions.

## The Hackathon Brief (original problem statement)

Build a full-stack "Life RPG" web app that turns real-life productivity into an RPG progression system, solving the "delayed gratification" problem of normal to-do apps. Requirements include:
- Secure auth, real database persistence (no localStorage), full CRUD on tasks
- Non-linear leveling system
- Streaks (consecutive days of activity)
- Attributes tied to task categories (e.g. coding → Intellect)
- Currency/economy with a shop for virtual items
- Fully responsive (mobile–desktop) and fully keyboard-navigable UI
- Deliverables: public GitHub repo (3+ real commits, backend included), live deployed URL, and a 90–180 second demo video (under 100MB) showing signup/login, task completion, leveling up, and a refresh proving persistence
- Zero-tolerance disqualifiers: broken links, localStorage-only persistence, deploy/build failures, console crashes, thin/invalid repo, missing video
- Judged on: design/UX, performance/SEO, gamification creativity, robustness/edge cases, accessibility/responsiveness

## The Core Concept We Designed

Instead of a flat XP bar, tasks and habits build up per-category **stats**, and a single **global reincarnation meter** tracks neglect over time. Category "enemies" shown in an in-app "Arena" are **purely visual/cosmetic** — they do not affect game logic at all.

## Screen Structure (Dashboard = the hub)

One home screen, no wizard flow. Regions:
- **Character panel** (top): level, XP, coin balance, stat summary
- **Arena**: visual-only enemy per category, for theme/feel
- **Task list**: grouped by category
- **Shop**: cosmetics, purchased with coins
- **Reincarnation bar**: single global meter

Every user action (add task, complete task, open shop) returns to this same dashboard. Non-linear/non-sequential — no fixed order of operations.

## Categories → Stats (final, locked)

| Category | Stat |
|---|---|
| Academics | Intellect |
| Fitness | Strength |
| Lifestyle | Discipline |
| Other | Willpower |

Category is chosen at task/habit creation and is not editable afterward.

## Tasks (one-off, 24-hour rolling deadline)

- At creation: user selects **category** (required) and **difficulty level** (required — e.g. easy/medium/hard)
- Completing a task grants XP + stat points to that category's stat, scaled by difficulty
- If a task expires unfinished: deduct stat from that category only (scaled by difficulty — harder task = bigger penalty), and add a fixed amount **x** to the global reincarnation meter
- **No penalty if a category simply has zero tasks** — penalty only applies to a task that was registered and then expired unfinished
- Completing every active task in a category at once grants a bonus scaled by the **sum of difficulty** across that category's tasks (not just task count — this prevents gaming the bonus with trivial filler tasks)

## Habits (recurring, streak-based)

- Consecutive-day completion pays escalating coins: day 1 = 1 coin, day 2 = 2 coins, day 3 = 3 coins, etc.
- There will be a cap/ceiling on this escalation — **exact number not yet decided**
- **Habit streak-break penalty is an intentional placeholder — not yet designed.** This is being worked on separately; leave a stub for it in code.
- Habits are the **only source of coins** in the entire game

## Currency (Coins)

- Earned only through habits
- Spent on: shop cosmetics, and reincarnation trade-offs (see below)
- **Coins have zero effect on the leaderboard**

## Reincarnation System (global meter, formula still placeholder)

- **One single global bar**, not per-category
- Each expired/failed task adds a fixed amount **x** to the meter
- Each completed task subtracts a fixed amount **y** from the meter
- **IMPORTANT, confirmed correction: x > y** — a single failure adds more to the meter than a single success removes. This is intentional: recovering from one missed task requires more than one completed task to offset it, so sustained neglect compounds faster than good behavior can undo it. (An earlier version of this conversation incorrectly stated x < y — that was wrong and has been corrected.)
- When the meter fills, the player must choose one of two trade-offs:
  - **Lose a large amount of stats** (leaderboard position drops, coins unaffected)
  - **Lose a large amount of coins** (stats and leaderboard position unaffected)
- Exact x/y values and loss-amount formulas are placeholders — use named constants, not final numbers
- **Known unresolved exploit** (deliberately deferred by the user): if a player keeps their coin balance near zero, "losing money" at reincarnation costs almost nothing, making the dilemma one-sided for competitive players. Not being fixed yet — flagged for later.

## Leaderboard

- Global only, no custom rooms/chat for MVP (explicitly descoped to keep this hackathon-feasible)
- Ranked by the **average of the four category stats**
- Coins have zero influence on ranking
- Note: an average rewards generalists and can slightly punish specialists — this was flagged as worth being aware of, not necessarily a problem to fix

## Database Schema (minimum viable)

- **Users**: id, email, password_hash, current_level, current_xp, coin_balance, reincarnation_meter
- **Tasks**: id, user_id, title, category, difficulty, is_completed, deadline_at, created_at, completed_at
- **Habits**: id, user_id, title, current_streak, longest_streak, last_completed_at
- **Stats**: id, user_id, intellect, strength, discipline, willpower
- **Inventory/Items**: id, name, cost; plus a UserInventory join table

## Non-linear Leveling Formula

```
xp_to_next_level = base * (level ^ 1.5)
```

## Tech Stack (all free)

- Frontend: React (via Vite) + Tailwind CSS
- Backend/DB/Auth: Supabase (Postgres, built-in auth, Row Level Security)
- Deployment: Vercel (frontend) + Render or Supabase Edge Functions (backend logic)
- Assets: Tabler Icons / Lucide / game-icons.net for icons, itch.io / OpenGameArt for sprites, Google Fonts, Kenney.nl for free CC0 game asset packs

## 15–16 Hour Build Timeline

| Time | Task |
|---|---|
| 0:00–1:00 | Lock all open decisions; scaffold repo, Supabase project, deploy "hello world" live |
| 1:00–3:00 | Auth + full DB schema with Row Level Security |
| 3:00–6:00 | Task/Habit CRUD |
| 6:00–9:00 | Core engine: stat updates, penalties, leveling formula |
| 9:00–11:00 | Dashboard UI, optimistic updates |
| 11:00–12:00 | Shop |
| 12:00–13:00 | Leaderboard |
| 13:00–14:30 | Responsive + accessibility pass |
| 14:30–15:30 | Bug bash, verify live deploy and commit history |
| 15:30–16:00 | Record demo video, finish README, submit |

If behind schedule, cut in this order: custom room leaderboards, boss/enemy animations, guilt-trip reward enforcement, any chat/social feature — never cut auth, persistence, working deploy, or the demo video.

## Required Feature Checklist (must all be present)

1. Secure signup/login/session management
2. Row Level Security — users only see/modify their own data
3. Full CRUD on tasks and habits
4. Non-linear leveling
5. Streak tracking for habits
6. Stats tied to task category
7. Currency/economy with a shop
8. Fully responsive layout (flex/grid, not fixed widths)
9. Fully keyboard-navigable — use semantic `<button>`/`<a>`/`<input>` elements, never `<div onClick>` (this is what makes Tab-navigation and screen readers work automatically)
10. Graceful handling of edge cases (empty task, dropped connection, duplicate actions)

## Zero-Tolerance Rules (never deprioritize these under time pressure)

- Real database persistence (no localStorage as primary storage)
- Public GitHub repo, backend code included, 3+ real incremental commits
- Live deployed URL that works at judging time
- No unhandled console errors or crashes
- Public demo video, 90–180 seconds, under 100MB, showing signup/login → add/complete task → level up → refresh (proving persistence)

## Explicitly Deferred / Not Yet Designed

- Habit streak-break penalty logic (placeholder only)
- Exact numeric values for x, y, reincarnation loss amounts, streak coin cap
- The near-zero-coin-balance reincarnation loophole
- Custom room-ID leaderboards and any live chat/"leader role" feature (out of scope for MVP)

## Frontend Development Approach

The person building this has no coding background. The recommended approach: describe the desired UI/behavior in plain language to an AI coding tool (Claude, Antigravity, v0.dev, bolt.new, etc.), review the generated result, and give precise, specific feedback to iterate — rather than trying to learn React/CSS from scratch under time pressure. All the design decisions above (screen layout, mechanics, schema) should be given to the AI dev tool as context before requesting code.

## Ready-to-Use Master Prompt for an AI Coding Agent (e.g. Antigravity)

Use everything above as the working specification. When handing this off to a coding agent, emphasize:
- Enemies in the Arena are cosmetic only — do not wire them into any game logic
- All reward/penalty math must be server-side, never trusted from client input
- Use named constants for all placeholder numbers (x, y, streak caps, loss percentages) so they can be tuned later without code changes
- Leave explicit stub functions for the habit streak-break penalty and the reincarnation loss formulas, clearly commented as "not yet finalized"
- Prioritize the zero-tolerance requirements and required feature checklist above any additional polish
