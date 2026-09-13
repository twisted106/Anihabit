# Anihabit — Resolved Reward/Penalty Math (supersedes placeholder values in v2 spec)

This document captures everything clarified in this conversation regarding task/habit rewards, penalties, and the reincarnation mechanic. It replaces the percentage-based x/y placeholders in `life-rpg-project-newv2.md` with exact flat numbers. Two items remain open — flagged at the bottom.

## 1. Task Completion — XP / Stat Gain

Flat gain, **no multiplier** (this fully retires the earlier Easy 1.0x / Medium 1.8x / Hard 3.0x multiplier system from v2):

| Difficulty | XP / Stat Points Gained |
|---|---|
| Easy | +1 |
| Medium | +2 |
| Hard | +3 |

Applied to the task's mapped category stat (Academics→Intellect, Fitness→Strength, Lifestyle→Discipline, Other→Willpower).

## 2. Task Failure (Expired, Unfinished) — Stat Penalty

**Reverse-scaled by design**: the easier the task, the bigger the penalty — the logic being "no excuse to fail the easy one."

| Difficulty | Stat Penalty (that category only) |
|---|---|
| Easy | −3 |
| Medium | −2 |
| Hard | −1 |

## 3. Reincarnation Bar — Now Flat Points, Not Percentages

The bar is 0–100, moved by fixed point amounts per event (not percentage-of-bar or percentage-of-anything-else). This replaces the old x=15%/y=8% placeholder from v2.

**On failure / uncompleted task:**

| Event | Reincarnation Added |
|---|---|
| Task fail — Hard | +8 |
| Task fail — Medium | +9 |
| Task fail — Easy | +10 |
| Habit fail (streak break) | +10 |

**On success — reduces the bar:**

| Event | Reincarnation Removed |
|---|---|
| Task complete — Easy | −1 |
| Task complete — Medium | −2 |
| Task complete — Hard | −3 |
| Habit complete | −2 |

Floored at 0, capped at 100.

## 4. Crisis Trade-Off Modal

Unchanged trigger condition from v2: fires when the meter hits **100**. Single choice, forced:

- **Sacrifice Stats**: −25% across all 4 category stats (leaderboard rank drops, coins unaffected), **or**
- **Sacrifice Coins**: −50% of coins (stats and leaderboard rank unaffected)

Meter resets to 0 after the choice is made.

## 5. Habit Streak-Break — Coin Penalty (resolves the old placeholder stub)

Independent mechanic from the Crisis Modal — does **not** interact with or feed the reincarnation bar's coin trade-off. Deliberately gentle/linear, not compounding, so one bad day isn't over-punished:

```
remaining_coins = original_coins * (1 − 0.10 × number_of_habits_broken_that_day)
```

Floored at 0%. Example: 1 habit broken → 90% remains; 2 broken same day → 80% remains; 3 → 70%, etc.

## 6. Notational Clarification

The row of "X — X — X — X — X" in the handwritten notes is only a visual column separator between the Task math and Habit math — it carries no formula meaning.

---

## Still Open (unresolved, needs your confirmation before locking to code)

1. **Two different scaling directions, confirm intentional:** Stat-fail penalties reverse-scale (Easy = worst), while reincarnation-fail penalties normal-scale (Hard = worst). This is defensible as "two different punishments for two different things" but should be documented in the codebase/README so it doesn't read as a bug to a future dev or judge.
2. **"Reincarnation bar can only increase, never decrease" vs. "reduced to 0 by completions"** — these two statements from the conversation conflict as written. Best guess: there may be a *separate, permanent lifetime counter* (e.g. `total_reincarnations`, incremented only when the Crisis Modal actually triggers) distinct from the day-to-day meter itself, which does go up and down. Needs explicit confirmation before adding to schema.
