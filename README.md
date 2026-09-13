# 🎮 Anihabit — Life RPG

> **Turn your real-life productivity into an RPG progression system.**
> Complete tasks, build habits, level up your character, and fight back against the Reincarnation Crisis — all powered by what you actually accomplish each day.

---

## 📖 Table of Contents

- [What Is Anihabit?](#-what-is-anihabit)
- [How the Game Works](#-how-the-game-works)
  - [Categories & Stats](#categories--stats)
  - [Tasks](#tasks-one-off-quests)
  - [Habits & Streaks](#habits--streaks)
  - [Reincarnation Meter](#reincarnation-meter--the-crisis-system)
  - [Leveling System](#leveling-system)
  - [Coins & Economy](#coins--economy)
  - [Boss Monsters](#boss-monsters--arena)
  - [Leaderboard](#leaderboard)
  - [Shop & Cosmetics](#shop--cosmetics)
  - [Player Profile](#player-profile--customization)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [AI Tools Used](#-ai-tools-used)
- [Features Checklist](#-features-checklist)

---

## 🧠 What Is Anihabit?

Anihabit solves the **delayed gratification problem** of normal to-do apps. Crossing off a task gives you nothing. In Anihabit, every task you complete gives you XP, boosts your character's stats, and relieves pressure on the Reincarnation meter — while every missed task punishes you. The stakes are real (within the game), and that makes the grind worth it.

It is a **full-stack Life RPG** where:
- **Tasks** are one-off quests with a 24-hour deadline
- **Habits** are recurring daily check-ins that build escalating coin rewards through streaks
- **Stats** grow with every task you complete in that category
- **Reincarnation** is a global pressure meter that rises when you fail and falls when you succeed — if it maxes out, you face a crisis trade-off
- **The Leaderboard** ranks every player by their average stat score

---

## 🎲 How the Game Works

### Categories & Stats

Every task and habit belongs to one of four categories. Each category maps directly to a character stat:

| Category | Stat | Arena Boss |
|---|---|---|
| 📚 Academics | Intellect | Chronos of Procrastination |
| 💪 Fitness | Strength | The Sloth Behemoth |
| 🌿 Lifestyle | Discipline | Chaos Chimera |
| 🔮 Other | Willpower | Phantom of Hesitation |

When you complete a task in a category, that category's stat grows. When you fail a task, that same stat takes a penalty.

---

### Tasks (One-Off Quests)

Tasks are single-use quests with a **24-hour rolling deadline** from the moment you create them.

**On Creation:**
- Choose a **Category** (Academics / Fitness / Lifestyle / Other) — required
- Choose a **Difficulty** (Easy / Medium / Hard) — required

**On Completion — rewards scale by difficulty:**

| Difficulty | XP Gained | Stat Gained | Pressure Relief |
|---|---|---|---|
| Easy | +1 XP | +1 to category stat | -1 pressure |
| Medium | +2 XP | +2 to category stat | -2 pressure |
| Hard | +3 XP | +3 to category stat | -3 pressure |

**On Expiry (not completed in time) — reverse-scaled penalties:**

> Harder tasks penalise *less* on expiry — failing an Easy task hurts more than failing a Hard one, since you had less excuse.

| Difficulty | Stat Penalty | Pressure Added |
|---|---|---|
| Easy | -3 to category stat | +10 pressure |
| Medium | -2 to category stat | +9 pressure |
| Hard | -1 to category stat | +8 pressure |

**Boss Defeat Bounty:**
When you complete **all active tasks in a category at once** (clearing the entire category), you defeat that category's Boss Monster and earn **+50 Gold Coins**. This bounty is claimable **once per boss per weekly leaderboard cycle** — not infinitely farmable.

---

### Habits & Streaks

Habits are **recurring daily check-ins** — the only source of coins in the entire game.

- Check in a habit each day to maintain your streak
- **Coins awarded = current streak day (capped at 10)**:
  - Day 1 → 1 coin, Day 2 → 2 coins … Day 10+ → 10 coins every day
- Completing a habit also relieves **-2 pressure** from the Reincarnation meter
- **Missing a day breaks your streak** and triggers the streak-break penalty:
  - Reincarnation pressure increases by **+10**
  - Coin balance is reduced: `remaining = original × (1 - 0.10 × habits_broken_that_day)`

> **Habits are the ONLY source of coins.** Tasks give XP and stats, but never coins.

---

### Reincarnation Meter — The Crisis System

The Reincarnation meter is a **single global pressure bar (0–100)** that tracks how much you are neglecting your real-life goals.

**Key rule — failure hurts more than success helps:**
- A single failed task adds more pressure than a single completed task removes
- Sustained neglect compounds: you cannot simply offset one failure with one success

**When the meter reaches 100**, a **Reincarnation Crisis** is triggered and you must choose one of two trade-offs:

| Trade-off | Effect |
|---|---|
| ⚔️ Sacrifice Stats | Lose 25% of all four category stats (leaderboard rank drops) |
| 💰 Sacrifice Coins | Lose 50% of your current coin balance (stats and rank unaffected) |

Both choices reset the Reincarnation meter to 0. This mechanic forces you to decide what matters more — your competitive standing or your in-game wealth.

---

### Leveling System

Anihabit uses a **non-linear leveling formula** that makes each level progressively harder to reach:

```
XP required for next level = 100 × (current_level ^ 1.5)
```

| Level | XP to Next Level |
|---|---|
| 1 | 100 |
| 5 | 559 |
| 10 | 1,582 |
| 20 | 5,657 |

This prevents level inflation and rewards long-term consistent play over short bursts.

---

### Coins & Economy

- Coins are earned **exclusively through habit check-ins and boss defeat bounties**
- Coins are spent in the **Shop** on cosmetic leaderboard border effects
- Coins have **zero effect on leaderboard rank** — ranking is purely stat-based
- Coins are at risk during a Reincarnation Crisis (50% loss if you choose the coin trade-off)

---

### Boss Monsters — Arena

Each category has a **thematic Boss Monster** displayed in the Battleground view:

| Category | Boss | Title |
|---|---|---|
| Academics | Chronos of Procrastination | Distortion of Thought |
| Fitness | The Sloth Behemoth | Weight of Lethargy |
| Lifestyle | Chaos Chimera | Disorder of Habit |
| Other | Phantom of Hesitation | Shadow of Doubt |

> Bosses are **cosmetic only** — they do not directly affect any game logic. Clearing all tasks in a category "defeats" the boss and triggers the 50-coin bounty reward.

---

### Leaderboard

- **Global leaderboard** — all registered players compete
- Ranked by **Power Score = average of (Intellect + Strength + Discipline + Willpower) / 4**
- Refreshes on a **weekly cycle** (Monday 00:00 IST boundary)
- Players can display a cosmetic **leaderboard border effect** purchased from the Shop
- Coins have **no influence** on ranking

---

### Shop & Cosmetics

The Shop sells **leaderboard border effects** — decorative frames that appear on your leaderboard row. Zero gameplay advantage; purely cosmetic status symbols.

| Item | Tier | Cost |
|---|---|---|
| ⛓️ Iron Band | Common | 20 coins |
| ⚜️ Bronze Sigil Frame | Rare | 100 coins |
| 🔥 Ember Rune Border | Legendary | 500 coins |

- Only **one border can be equipped at a time**
- Items are owned permanently once purchased — no re-purchase needed

---

### Player Profile & Customization

Every player can personalise their in-game identity:
- **Champion Moniker** — your display name shown in the leaderboard and profile panel
- **Avatar** — choose from 6 preset RPG-themed avatars (3 male, 3 female archetypes), or upload your own custom PNG image (max 5 MB)

| Preset Avatars | |
|---|---|
| 🗡️ Shadow Shinobi (M) | ⚔️ Valkyrie Warrior (F) |
| 🧙 Arcane Sorcerer (M) | 🌿 Forest Huntress (F) |
| 🥷 Blade Ronin (M) | 🔮 Aether Sorceress (F) |

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.3 | UI component framework |
| **Vite** | 5.4 | Build tool and development server |
| **Tailwind CSS** | 3.4 | Utility-first CSS styling system |
| **Lucide React** | 1.16 | Icon library |
| **canvas-confetti** | 1.9 | Celebration particle animations |

### Backend & Database

| Technology | Purpose |
|---|---|
| **Supabase** | Backend-as-a-Service platform |
| **PostgreSQL** | Relational database (hosted via Supabase) |
| **Supabase Auth** | Secure email/password signup, login, session management |
| **Row Level Security (RLS)** | Database-level policy enforcement — users can only read/write their own data |
| **PL/pgSQL RPC Functions** | Server-side game engine — all reward and penalty calculations run on the server, never trusted from the client |

### Game Engine (Server-Side RPC Functions)

All critical game logic runs as PostgreSQL `SECURITY DEFINER` functions to prevent client-side manipulation:

| RPC Function | Purpose |
|---|---|
| `complete_task` | Validates ownership, grants XP + stat + pressure relief |
| `complete_habit` | Validates IST midnight boundary, awards escalating coins, grows streak |
| `stub_handle_habit_streak_break` | Resets streak, applies coin deduction + pressure increase |
| `check_expired_tasks` | Scans overdue tasks, applies reverse-scaled stat penalty + pressure |
| `resolve_reincarnation_tradeoff` | Executes stat or coin sacrifice, resets meter to 0 |
| `get_global_leaderboard` | Returns power-score ranked leaderboard (top 100 players) |
| `buy_shop_item` | Validates coin balance, atomically deducts coins and adds item to inventory |
| `toggle_equip_item` | Enforces single-border exclusivity, syncs equipped state |
| `claim_boss_defeat_reward` | Awards 50-coin boss bounty, enforces once-per-cycle uniqueness |

---

## 🗄 Database Schema

```
profiles
├── id (UUID, FK → auth.users)
├── email
├── display_name
├── avatar_url
├── current_level
├── current_xp
├── coin_balance
├── reincarnation_meter (0–100)
├── equipped_leaderboard_effect
└── created_at

stats
├── id
├── user_id (FK → profiles)
├── intellect   ← Academics
├── strength    ← Fitness
├── discipline  ← Lifestyle
└── willpower   ← Other

tasks
├── id
├── user_id (FK → profiles)
├── title
├── category (Academics | Fitness | Lifestyle | Other)
├── difficulty (Easy | Medium | Hard)
├── is_completed
├── deadline_at (created_at + 24 hours)
├── created_at
└── completed_at

habits
├── id
├── user_id (FK → profiles)
├── title
├── category
├── current_streak
├── longest_streak
├── last_completed_at
└── created_at

items (shop catalog — admin-managed)
├── id (e.g. 'border_iron_band')
├── name
├── category ('border')
├── effect_type ('border')
├── tier (Common | Rare | Legendary)
├── cost
├── icon
└── description

user_inventory
├── id
├── user_id (FK → profiles)
├── item_id (FK → items)
├── is_equipped
└── purchased_at

boss_defeat_claims
├── id
├── user_id (FK → profiles)
├── category
├── boss_name
├── cycle_id (ISO week, e.g. '2026-W37')
├── reward_coins
└── claimed_at
    UNIQUE: (user_id, category, cycle_id)
```

---

## 📁 Project Structure

```
Anihabit/
├── public/
│   └── images/
│       └── avatars/              # Preset RPG avatar images
├── src/
│   ├── components/
│   │   ├── GameView.jsx              # Main game dashboard
│   │   ├── BattlegroundView.jsx      # Arena / boss monsters
│   │   ├── DashboardView.jsx         # Character + stat overview
│   │   ├── Navbar.jsx                # Navigation + profile button
│   │   ├── TaskBoard.jsx             # Task list UI
│   │   ├── HabitBoard.jsx            # Habit list UI
│   │   ├── ReincarnationBar.jsx      # Global pressure bar
│   │   ├── CharacterPanel.jsx        # Level, XP, stats display
│   │   ├── ShopView.jsx              # Shop catalog
│   │   ├── LeaderboardView.jsx       # Global rankings
│   │   ├── CustomizeProfileModal.jsx # Name + avatar picker
│   │   ├── AddChallengeModal.jsx     # Create task/habit modal
│   │   ├── CardDetailModal.jsx       # Task/habit detail & actions
│   │   ├── TradeoffModal.jsx         # Reincarnation crisis modal
│   │   ├── AuthModal.jsx             # Login / signup modal
│   │   └── ToastContainer.jsx        # Notification toasts
│   ├── hooks/
│   │   └── useGameState.js           # Central game state & all actions
│   ├── constants/
│   │   ├── gameConfig.js             # All tunable game constants & formulas
│   │   └── avatarPresets.js          # Preset avatar definitions
│   ├── lib/
│   │   ├── supabase.js               # Supabase client initialisation
│   │   └── audio.js                  # Sound effect handlers
│   ├── App.jsx                       # Root router + modal host
│   ├── main.jsx                      # React entry point
│   └── index.css                     # Global styles + Tailwind base
├── supabase/
│   ├── schema.sql                    # Full DB schema, RLS, RPCs, seed data
│   └── migrations/                   # Incremental migration files
├── .env.example                      # Environment variable template
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A free [Supabase](https://supabase.com) account

### 1. Clone the Repository
```bash
git clone https://github.com/twisted106/Anihabit.git
cd Anihabit
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Open the **SQL Editor** in your Supabase dashboard
3. Run the full contents of `supabase/schema.sql` — this creates all tables, RLS policies, trigger functions, RPC functions, and seed data

### 4. Configure Environment Variables
```bash
cp .env.example .env
```
Fill in your Supabase credentials (see [Environment Variables](#-environment-variables) below).

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Demo Mode:** If no Supabase credentials are provided, the app automatically runs in offline demo mode with pre-seeded data — no account required to explore the game.

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Both values are found in your Supabase project under **Project Settings → API**.

> The app works in demo mode without these keys. Set them to enable real auth and database persistence.

---

## 🤖 AI Tools Used

This project was built with assistance from several AI tools, each serving a distinct role in the development process:

### 📐 Planning & System Design
**Claude (Anthropic)**
Used for the entire architecture and game design phase — defining the problem statement, designing the core game mechanics (Reincarnation system, stat-category mapping, non-linear leveling formula, RLS security strategy, database schema), and producing the master specification document that guided all development decisions.

### 🎨 Asset Generation
**ChatGPT (OpenAI) & Gemini (Google DeepMind)**
Used for generating visual assets — RPG character avatar artwork, background imagery, and UI concept art referenced during the design phase.

### 🖌️ Frontend UI Design
**Stitch (Google DeepMind)**
Used for frontend UI/UX design — creating the visual design system, component layouts, colour palettes, and interactive prototypes for the game interface before implementation.

### 💻 Development & Implementation
**AntiGravity (Google DeepMind)**
Used as the primary AI coding agent for all development work — writing and iterating on React components, the game state hook, Supabase RPC integration, game logic implementation, and full codebase refactoring and cleanup.

---

## ✅ Features Checklist

| Feature | Status |
|---|---|
| Secure signup / login / session management | ✅ |
| Row Level Security — users only access their own data | ✅ |
| Full CRUD on Tasks | ✅ |
| Full CRUD on Habits | ✅ |
| Non-linear leveling system (`100 × level^1.5`) | ✅ |
| Streak tracking for habits (IST midnight boundary) | ✅ |
| Stats tied to task category | ✅ |
| Reincarnation pressure meter with crisis trade-off | ✅ |
| Coin economy (habits-only source) | ✅ |
| In-game Shop with cosmetic items | ✅ |
| Global Leaderboard (power score ranked) | ✅ |
| Weekly leaderboard cycle (ISO week, IST boundary) | ✅ |
| Boss defeat bounty (50 coins, once per cycle) | ✅ |
| Player profile customisation (name + avatar) | ✅ |
| Custom PNG avatar upload (5 MB limit, PNG-only) | ✅ |
| Preset avatar gallery (male & female archetypes) | ✅ |
| Fully responsive layout (mobile to desktop) | ✅ |
| Keyboard-navigable UI (semantic HTML elements) | ✅ |
| Optimistic UI updates (instant feedback, then sync) | ✅ |
| Demo mode (offline, no account required) | ✅ |
| Graceful error handling and toast notifications | ✅ |
| Server-side anti-cheat (all rewards via RPC) | ✅ |

---

## 📜 License

This project was built for a hackathon. All game mechanics, design, and code are original work by the Anihabit team.
