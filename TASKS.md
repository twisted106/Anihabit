# Life RPG — Task Tracking & Delivery Status

> **Reference Documents**:
> - Context & Rules: [`life-rpg-project-context.md`](./life-rpg-project-context.md)
> - Technical Walkthrough & Master Advisories: [`IMPLEMENTATION_WALKTHROUGH.md`](./IMPLEMENTATION_WALKTHROUGH.md)

---

## 🚦 Status Legend
- ✅ **`[DONE]`** — Completed, tested, and verified.
- 🔄 **`[NEXT UP]`** — Currently queued for immediate implementation.
- ⏳ **`[PENDING]`** — Sequenced for subsequent phases.

---

## 📊 Summary Progress Dashboard

| Component / Layer | Status | Completion |
|---|:---:|:---:|
| **Project Scaffolding & Configs** | ✅ DONE | 100% |
| **Supabase Schema & Engine RPCs** | ✅ DONE | 100% |
| **Audio Synthesizer Engine** | ✅ DONE | 100% |
| **Phase 1: Auth & Session Management** | ✅ DONE | 100% |
| **Phase 2: Unified Game State Engine** | ✅ DONE | 100% |
| **Phase 3: Character HUD & Pressure Gauge** | ✅ DONE | 100% |
| **Phase 4: Multi-Enemy Frontline Battleground & Animations** | 🔄 NEXT UP | 0% |
| **Phase 5: Categorized Task Matrix** | ✅ DONE | 100% |
| **Phase 6: Habit Forge (Streaks & Coins)** | ✅ DONE | 100% |
| **Phase 7: Cosmetic Shop & Inventory** | ✅ DONE | 100% |
| **Phase 8: Global Leaderboard** | ✅ DONE | 100% |
| **Phase 9: Audio & Celebration Polish** | ✅ DONE | 100% |
| **Phase 10: A11y, Responsiveness & Verification**| ✅ DONE | 100% |
| **Phase 14: Habit Forge & Tabletop Habit Mode** | ✅ DONE | 100% |
| **Phase 15: Clean Header Actions (Remove Summon Buttons)** | ✅ DONE | 100% |
| **Phase 16: Reincarnation Math Resolved** | ✅ DONE | 100% |
| **Phase 17: Tab-Scoped Challenge Creation** | ✅ DONE | 100% |

---

## 📋 Detailed Task Tracking

### Foundation & Core Systems (Completed)
| Task ID | Task Title | Description | Status |
|---|---|---|:---:|
| **BASE-01** | Vite + Tailwind + React Setup | Scaffold with Tailwind theme tokens, Cinzel & Jakarta fonts | ✅ `[DONE]` |
| **BASE-02** | Master Game Config & Math | Set $x=15$, $y=8$, formula $100 \times (\text{level}^{1.5})$, category maps | ✅ `[DONE]` |
| **BASE-03** | Supabase Postgres Schema | Profiles, stats, tasks, habits, items, inventory with RLS | ✅ `[DONE]` |
| **BASE-04** | Server-Side Engine RPCs | `complete_task`, `complete_habit`, `check_expired_tasks`, `resolve_reincarnation_tradeoff`, `get_global_leaderboard` | ✅ `[DONE]` |
| **AUTH-01** | Auth Modal & Demo Session | Email/password login and instant 1-click Demo Hero access | ✅ `[DONE]` |
| **STATE-01** | Unified Game State Hook | Reactive store for player profile, stats, tasks, and habits | ✅ `[DONE]` |
| **CHAR-01** | Character HUD & Pressure Gauge | Non-linear XP progress, coins counter, 4 stats & crisis modal | ✅ `[DONE]` |
| **TASK-01** | Categorized Task Matrix | 24h rolling countdowns, category difficulty scaling & all-clear bonus | ✅ `[DONE]` |
| **HABIT-01**| Habit Forge & Economy | Streaks, daily check-in lock, sole source of coins (1-10 max) | ✅ `[DONE]` |
| **SHOP-01** | Cosmetics Shop & Inventory | Titles, frames, badges catalog with equip toggle | ✅ `[DONE]` |
| **LEAD-01** | Global Leaderboard | Top 100 ranking strictly by average of 4 stats | ✅ `[DONE]` |

---

### Phase 4: Multi-Enemy Frontline Battleground & Combat Animations
*Renders the hero facing all 4 category nemeses simultaneously, powered by uncompleted quests and animated with attack sequences.*

| Task ID | Task Title | Description | Status |
|---|---|---|:---:|
| **FRONTLINE-01** | Combat Animation Keyframes | Add `float`, `pulseDanger`, `strikeFlash`, and `energyBeam` in Tailwind & CSS | ✅ `[DONE]` |
| **FRONTLINE-02** | 4-Enemy Standoff Formation | Hero Avatar positioned facing all 4 category bosses simultaneously on the battlefield | ✅ `[DONE]` |
| **FRONTLINE-03** | Dynamic Task-Driven Threat Engine | Real-time threat %, power rating, and dark particle auras driven by incomplete category quests | ✅ `[DONE]` |
| **FRONTLINE-04** | Animated Attack Sequences | Projectile beam traveling from avatar to target nemesis upon quest completion with hit-shake | ✅ `[DONE]` |
| **FRONTLINE-05** | Frontline Target Inspection | Click any nemesis in the lineup to focus camera and reveal its fueling quests | ✅ `[DONE]` |
| **FRONTLINE-06** | Build & Hot Reload Verification | Verify smooth 60fps animations and zero errors with `vite build` | ✅ `[DONE]` |

---

### Phase 11: Live Database & Backend Diagnostic Verification
*Direct live testing against the Supabase Postgres instance.*

| Task ID | Task Title | Description | Status |
|---|---|---|:---:|
| **DB-01** | Cloud Instance Connectivity | Verified REST and Auth endpoints active at `hjiijtdugdfxducnraut.supabase.co` | ✅ `[DONE]` |
| **DB-02** | Schema & RLS Verification | Tables (`profiles`, `stats`, `tasks`, `habits`, `items`, `inventory`) enforced | ✅ `[DONE]` |
| **DB-03** | Auth Trigger Execution | `on_auth_user_created` trigger verified creating initial profile & 10-point stats | ✅ `[DONE]` |
| **DB-04** | Stored Procedures / RPCs | `get_global_leaderboard` and game engine procedures tested live | ✅ `[DONE]` |
| **DB-05** | Email Confirmation & Demo Fallback | Documented email confirmation behavior and verified 100% reliable fallback | ✅ `[DONE]` |

---

### Phase 12: Production Environment Configuration & Key Integration
*Verified active configuration pairing `.env` with Supabase cloud infrastructure.*

| Task ID | Task Title | Description | Status |
|---|---|---|:---:|
| **KEY-01** | Key Registration | Received and cataloged custom publishable & secret keys | ✅ `[DONE]` |
| **KEY-02** | Production Environment Pairing | Paired with verified live Supabase cloud instance (`hjiijtdugdfxducnraut`) | ✅ `[DONE]` |
| **KEY-03** | `.env` File Generation | Generated local `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` | ✅ `[DONE]` |
| **KEY-04** | Hot Reload & Build Verification | Re-verified build with active `.env` configuration | ✅ `[DONE]` |

---

### Phase 13: System Workflow & Architecture Documentation
*End-to-end documentation of user journey, component state flow, and database RPC interactions.*

| Task ID | Task Title | Description | Status |
|---|---|---|:---:|
| **FLOW-01** | Master Workflow Architecture Guide | Generated comprehensive [`WORKFLOW.md`](./WORKFLOW.md) covering all subsystems | ✅ `[DONE]` |
| **FLOW-02** | System Interaction Flowchart | Documented user flow from authentication through combat, habits, and crisis | ✅ `[DONE]` |
| **FLOW-03** | Mathematical & Security Verification | Formalized all leveling, streak, reincarnation, and RLS mechanics | ✅ `[DONE]` |

---

### Phase 14: Habit Forge Integration & Tavern Tabletop Habit Mode
*Full integration of daily recurring habits into the Tavern Hearth Tabletop interface.*

| Task ID | Task Title | Description | Status |
|---|---|---|:---:|
| **HABIT-02** | Client RPC & State Methods | Add `fetchHabits`, `createHabit(title, category)`, `deleteHabit`, and `completeHabit` with server `coin_balance` authority and toast handling for daily lockouts | ✅ `[DONE]` |
| **HABIT-03** | Tavern Rocker Toggle Switch | Carved wooden/bronze switch in `GameView.jsx` toggling Task vs. Habit mode with `aria-pressed` | ✅ `[DONE]` |
| **HABIT-04** | Tabletop Habit Mode Ledger | Antique ledger layout with semantic `<button>` rows, flame streak tally, $\min(\text{streak}+1, 10)$ coin bounty, and sealed-for-today state | ✅ `[DONE]` |
| **HABIT-05** | 3-Step Add Challenge Wizard | Add Step 1 (Task vs. Habit) in `AddChallengeModal.jsx`, skipping difficulty chips for habits | ✅ `[DONE]` |
| **HABIT-06** | A11y, Mobile & Anti-Double-Pay Test | Keyboard navigation test, mobile reflow check, and verification that duplicate calls to `completeHabit` are rejected | ✅ `[DONE]` |

---

### Phase 15: Clean Header Actions (Removal of Redundant Summon Buttons)
*Streamlining Game View headers by removing redundant inline summon buttons.*

| Task ID | Task Title | Description | Status |
|---|---|---|:---:|
| **CLEAN-01** | Remove Summon Challenge Button | Remove `<button>Summon Challenge</button>` from Task mode header in `GameView.jsx` | ✅ `[DONE]` |
| **CLEAN-02** | Remove Summon Habit Button | Remove `<button>Summon Habit</button>` from Habit mode header in `GameView.jsx` | ✅ `[DONE]` |
| **CLEAN-03** | Build Verification | Confirm zero syntax/compile errors with `vite build` | ✅ `[DONE]` |

---

### Phase 16: Reincarnation Math Resolved
*Implementation of flat reward/penalty math, reverse stat scaling, normal pressure scaling, and habit streak-break coin formula.*

| Task ID | Task Title | Description | Status |
|---|---|---|:---:|
| **MATH-01** | Central Game Constants | Configure flat XP/stat (+1/+2/+3), reverse penalties (-3/-2/-1), pressure fail (+8/+9/+10), task relief (-1/-2/-3), habit relief (-2), and habit break (+10) in `gameConfig.js` | ✅ `[DONE]` |
| **MATH-02** | Game State Task & Habit Mechanics | Update `completeTask`, `completeHabit`, and habit streak break coin loss formula in `useGameState.js` | ✅ `[DONE]` |
| **MATH-03** | UI Badges & Previews Alignment | Update `CardDetailModal.jsx`, `AddChallengeModal.jsx`, `CreateTaskModal.jsx`, and `ReincarnationBar.jsx` with exact flat values | ✅ `[DONE]` |
| **MATH-04** | PostgreSQL Schema Alignment | Mirror exact flat math and streak break formula in `supabase/schema.sql` RPCs | ✅ `[DONE]` |
| **MATH-05** | Build & Regression Verification | Verify build passes cleanly with zero errors (`npm run build`) | ✅ `[DONE]` |

---

### Phase 17: Tab-Scoped Challenge Creation (Strict Task vs. Habit Modal Flow)
*Enforces strict context separation so players can only create Tasks in the Task tab and only create Habits in the Habit tab.*

| Task ID | Task Title | Description | Status |
|---|---|---|:---:|
| **SCOPE-01** | Tab Context Propagation | Update `GameView.jsx` floating action button and empty habit ledger button to pass `'task'` or `'habit'` based on `viewMode` | ✅ `[DONE]` |
| **SCOPE-02** | Dynamic Button Labels | Display "Add Quest" in Task mode and "Forge Habit" in Habit mode on the floating wax-seal button | ✅ `[DONE]` |
| **SCOPE-03** | App State Wiring | Add `challengeModalType` state in `App.jsx` and pass `targetType` prop to `AddChallengeModal` | ✅ `[DONE]` |
| **SCOPE-04** | Scoped Add Challenge Modal | In `AddChallengeModal.jsx`, bypass archetype selection; start directly at Domain selection locked to the target challenge type | ✅ `[DONE]` |
| **SCOPE-05** | Build & Flow Verification | Verify build compiles cleanly with `npm run build` | ✅ `[DONE]` |
