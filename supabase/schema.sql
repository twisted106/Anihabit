-- =====================================================================
-- LIFE RPG (AMPLIFY) DATABASE SCHEMA & GAME ENGINE (PostgreSQL / Supabase)
-- =====================================================================

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    current_level INT DEFAULT 1 CHECK (current_level >= 1),
    current_xp NUMERIC DEFAULT 0 CHECK (current_xp >= 0),
    coin_balance INT DEFAULT 0 CHECK (coin_balance >= 0),
    reincarnation_meter NUMERIC DEFAULT 0 CHECK (reincarnation_meter >= 0 AND reincarnation_meter <= 100),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. STATS TABLE (Core RPG attributes tied to categories)
-- Academics -> Intellect, Fitness -> Strength, Lifestyle -> Discipline, Other -> Willpower
CREATE TABLE IF NOT EXISTS public.stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    intellect NUMERIC DEFAULT 10 CHECK (intellect >= 0),
    strength NUMERIC DEFAULT 10 CHECK (strength >= 0),
    discipline NUMERIC DEFAULT 10 CHECK (discipline >= 0),
    willpower NUMERIC DEFAULT 10 CHECK (willpower >= 0),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TASKS TABLE (One-off, 24-hour rolling deadline)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (char_length(trim(title)) > 0),
    category TEXT NOT NULL CHECK (category IN ('Academics', 'Fitness', 'Lifestyle', 'Other')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    deadline_at TIMESTAMPTZ DEFAULT (timezone('utc'::text, now()) + interval '24 hours') NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMPTZ
);

-- 4. HABITS TABLE (Recurring, streak-based coin generator)
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK (char_length(trim(title)) > 0),
    category TEXT NOT NULL CHECK (category IN ('Academics', 'Fitness', 'Lifestyle', 'Other')),
    current_streak INT DEFAULT 0 CHECK (current_streak >= 0) NOT NULL,
    longest_streak INT DEFAULT 0 CHECK (longest_streak >= 0) NOT NULL,
    last_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ITEMS CATALOG (Shop cosmetics purchased with coins)
CREATE TABLE IF NOT EXISTS public.items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'title', 'avatar_frame', 'badge'
    cost INT NOT NULL CHECK (cost >= 0),
    icon TEXT NOT NULL,
    description TEXT
);

-- 6. USER INVENTORY JOIN TABLE
CREATE TABLE IF NOT EXISTS public.user_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    is_equipped BOOLEAN DEFAULT FALSE NOT NULL,
    purchased_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, item_id)
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- Profiles: Users manage their own profile; public can view rank/stats for leaderboard
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Stats: Users manage their own stats
CREATE POLICY "Users can view their own stats" 
    ON public.stats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
    ON public.stats FOR UPDATE 
    USING (auth.uid() = user_id);

-- Tasks: Full CRUD for own tasks
CREATE POLICY "Users can view their own tasks" 
    ON public.tasks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" 
    ON public.tasks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
    ON public.tasks FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
    ON public.tasks FOR DELETE 
    USING (auth.uid() = user_id);

-- Habits: Full CRUD for own habits
CREATE POLICY "Users can view their own habits" 
    ON public.habits FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits" 
    ON public.habits FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" 
    ON public.habits FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" 
    ON public.habits FOR DELETE 
    USING (auth.uid() = user_id);

-- Items: Readable by all authenticated users
CREATE POLICY "Items catalog is viewable by authenticated users" 
    ON public.items FOR SELECT 
    TO authenticated 
    USING (true);

-- User Inventory: Manage own inventory
CREATE POLICY "Users can view their inventory" 
    ON public.user_inventory FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their inventory" 
    ON public.user_inventory FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their inventory" 
    ON public.user_inventory FOR UPDATE 
    USING (auth.uid() = user_id);

-- =====================================================================
-- AUTOMATIC USER REGISTRATION TRIGGER
-- =====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, current_level, current_xp, coin_balance, reincarnation_meter)
    VALUES (new.id, new.email, 1, 0, 0, 0);

    INSERT INTO public.stats (user_id, intellect, strength, discipline, willpower)
    VALUES (new.id, 10, 10, 10, 10);

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- GAME ENGINE RPC FUNCTIONS (Server-side validation & anti-cheat)
-- =====================================================================

-- TUNABLE GAME CONSTANTS ENFORCED IN ENGINE:
-- RECEIVE_ON_FAIL = 15 (x, added to meter on expiration)
-- REDUCE_ON_COMPLETE = 8 (y, subtracted from meter on completion)
-- Constraint: x > y (15 > 8)
-- MAX_HABIT_DAILY_COINS = 10

-- 1. COMPLETE TASK RPC
CREATE OR REPLACE FUNCTION public.complete_task(p_task_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_category TEXT;
    v_difficulty TEXT;
    v_is_completed BOOLEAN;
    v_base_xp NUMERIC := 15;
    v_base_stat NUMERIC := 3;
    v_multiplier NUMERIC := 1.0;
    v_xp_gain NUMERIC;
    v_stat_gain NUMERIC;
    v_reduce_on_complete NUMERIC := 8; -- y
    v_current_level INT;
    v_current_xp NUMERIC;
    v_xp_needed NUMERIC;
    v_uncompleted_in_category INT;
    v_is_all_clear BOOLEAN := FALSE;
    v_clear_bonus_xp NUMERIC := 0;
    v_clear_bonus_stat NUMERIC := 0;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Fetch task with lock
    SELECT category, difficulty, is_completed 
    INTO v_category, v_difficulty, v_is_completed
    FROM public.tasks
    WHERE id = p_task_id AND user_id = v_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Task not found or access denied';
    END IF;

    IF v_is_completed THEN
        RAISE EXCEPTION 'Task already completed';
    END IF;

    -- Difficulty Multipliers
    IF v_difficulty = 'Medium' THEN
        v_multiplier := 1.8;
    ELSIF v_difficulty = 'Hard' THEN
        v_multiplier := 3.0;
    END IF;

    v_xp_gain := round(v_base_xp * v_multiplier);
    v_stat_gain := round(v_base_stat * v_multiplier);

    -- Mark task completed
    UPDATE public.tasks
    SET is_completed = TRUE,
        completed_at = timezone('utc'::text, now())
    WHERE id = p_task_id;

    -- Check if category is now completely cleared of active tasks
    SELECT count(*) INTO v_uncompleted_in_category
    FROM public.tasks
    WHERE user_id = v_user_id 
      AND category = v_category 
      AND is_completed = FALSE;

    IF v_uncompleted_in_category = 0 THEN
        v_is_all_clear := TRUE;
        -- Bonus scaled by sum of difficulty of cleared tasks in category
        v_clear_bonus_xp := 25 * v_multiplier;
        v_clear_bonus_stat := 5 * v_multiplier;
        v_xp_gain := v_xp_gain + v_clear_bonus_xp;
        v_stat_gain := v_stat_gain + v_clear_bonus_stat;
    END IF;

    -- Update Category Stat
    IF v_category = 'Academics' THEN
        UPDATE public.stats SET intellect = intellect + v_stat_gain, updated_at = now() WHERE user_id = v_user_id;
    ELSIF v_category = 'Fitness' THEN
        UPDATE public.stats SET strength = strength + v_stat_gain, updated_at = now() WHERE user_id = v_user_id;
    ELSIF v_category = 'Lifestyle' THEN
        UPDATE public.stats SET discipline = discipline + v_stat_gain, updated_at = now() WHERE user_id = v_user_id;
    ELSIF v_category = 'Other' THEN
        UPDATE public.stats SET willpower = willpower + v_stat_gain, updated_at = now() WHERE user_id = v_user_id;
    END IF;

    -- Fetch current player XP and Level
    SELECT current_level, current_xp INTO v_current_level, v_current_xp
    FROM public.profiles WHERE id = v_user_id FOR UPDATE;

    v_current_xp := v_current_xp + v_xp_gain;

    -- Non-linear Leveling Check: xp_to_next = 100 * (level ^ 1.5)
    LOOP
        v_xp_needed := round(100 * power(v_current_level, 1.5));
        IF v_current_xp >= v_xp_needed THEN
            v_current_level := v_current_level + 1;
            v_current_xp := v_current_xp - v_xp_needed;
        ELSE
            EXIT;
        END IF;
    END LOOP;

    -- Relieve Reincarnation Meter (-y) with floor of 0
    UPDATE public.profiles
    SET current_level = v_current_level,
        current_xp = v_current_xp,
        reincarnation_meter = GREATEST(0, reincarnation_meter - v_reduce_on_complete)
    WHERE id = v_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'xp_gained', v_xp_gain,
        'stat_gained', v_stat_gain,
        'category', v_category,
        'category_all_clear', v_is_all_clear,
        'new_level', v_current_level,
        'reincarnation_reduced_by', v_reduce_on_complete
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. COMPLETE HABIT RPC (Escalating Coins: Day 1=1, Day 2=2... up to cap)
CREATE OR REPLACE FUNCTION public.complete_habit(p_habit_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_current_streak INT;
    v_longest_streak INT;
    v_last_completed TIMESTAMPTZ;
    v_coins_awarded INT;
    v_max_coins INT := 10; -- Tunable constant cap
    v_today_date DATE := (timezone('utc'::text, now()))::DATE;
    v_last_date DATE;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT current_streak, longest_streak, last_completed_at
    INTO v_current_streak, v_longest_streak, v_last_completed
    FROM public.habits
    WHERE id = p_habit_id AND user_id = v_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Habit not found or access denied';
    END IF;

    IF v_last_completed IS NOT NULL THEN
        v_last_date := (timezone('utc'::text, v_last_completed))::DATE;
        IF v_last_date = v_today_date THEN
            RAISE EXCEPTION 'Habit already completed today';
        ELSIF v_last_date = (v_today_date - interval '1 day')::DATE THEN
            -- Consecutive day check-in
            v_current_streak := v_current_streak + 1;
        ELSE
            -- Missed days: reset streak to 1
            v_current_streak := 1;
        END IF;
    ELSE
        -- First time completion
        v_current_streak := 1;
    END IF;

    -- Update longest streak
    IF v_current_streak > v_longest_streak THEN
        v_longest_streak := v_current_streak;
    END IF;

    -- Calculate escalating coins up to cap
    v_coins_awarded := LEAST(v_current_streak, v_max_coins);

    -- Update habit
    UPDATE public.habits
    SET current_streak = v_current_streak,
        longest_streak = v_longest_streak,
        last_completed_at = timezone('utc'::text, now())
    WHERE id = p_habit_id;

    -- Award coins to profile (Habits are the SOLE source of coins)
    UPDATE public.profiles
    SET coin_balance = coin_balance + v_coins_awarded
    WHERE id = v_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'coins_awarded', v_coins_awarded,
        'current_streak', v_current_streak,
        'longest_streak', v_longest_streak
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. HABIT STREAK BREAK PENALTY STUB
-- Note: This is an intentional placeholder for future drop-in redesign
CREATE OR REPLACE FUNCTION public.stub_handle_habit_streak_break(p_habit_id UUID)
RETURNS VOID AS $$
BEGIN
    -- [INTENTIONAL PLACEHOLDER]:
    -- Streak-break penalty logic is currently deferred and being designed separately.
    -- Stored procedure stub exists to preserve API surface without future schema changes.
    NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. CHECK EXPIRED TASKS RPC (Applies penalty + adds x to reincarnation bar)
CREATE OR REPLACE FUNCTION public.check_expired_tasks()
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_task RECORD;
    v_receive_on_fail NUMERIC := 15; -- x (x > y enforced: 15 > 8)
    v_penalty NUMERIC;
    v_expired_count INT := 0;
    v_reincarnation_increase NUMERIC := 0;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    FOR v_task IN 
        SELECT id, category, difficulty
        FROM public.tasks
        WHERE user_id = v_user_id
          AND is_completed = FALSE
          AND deadline_at < timezone('utc'::text, now())
    LOOP
        v_expired_count := v_expired_count + 1;
        v_reincarnation_increase := v_reincarnation_increase + v_receive_on_fail;

        -- Difficulty scaled penalty to category stat
        IF v_task.difficulty = 'Hard' THEN
            v_penalty := 7;
        ELSIF v_task.difficulty = 'Medium' THEN
            v_penalty := 4;
        ELSE
            v_penalty := 2;
        END IF;

        IF v_task.category = 'Academics' THEN
            UPDATE public.stats SET intellect = GREATEST(0, intellect - v_penalty) WHERE user_id = v_user_id;
        ELSIF v_task.category = 'Fitness' THEN
            UPDATE public.stats SET strength = GREATEST(0, strength - v_penalty) WHERE user_id = v_user_id;
        ELSIF v_task.category = 'Lifestyle' THEN
            UPDATE public.stats SET discipline = GREATEST(0, discipline - v_penalty) WHERE user_id = v_user_id;
        ELSIF v_task.category = 'Other' THEN
            UPDATE public.stats SET willpower = GREATEST(0, willpower - v_penalty) WHERE user_id = v_user_id;
        END IF;

        -- Remove expired task or mark failed
        DELETE FROM public.tasks WHERE id = v_task.id;
    END LOOP;

    IF v_reincarnation_increase > 0 THEN
        UPDATE public.profiles
        SET reincarnation_meter = LEAST(100, reincarnation_meter + v_reincarnation_increase)
        WHERE id = v_user_id;
    END IF;

    RETURN jsonb_build_object(
        'expired_tasks_count', v_expired_count,
        'reincarnation_added', v_reincarnation_increase
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. RESOLVE REINCARNATION TRADE-OFF RPC
CREATE OR REPLACE FUNCTION public.resolve_reincarnation_tradeoff(p_choice TEXT)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_stat_penalty_ratio NUMERIC := 0.25; -- Lose 25% stats
    v_coin_penalty_ratio NUMERIC := 0.50; -- Lose 50% coins
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    IF p_choice = 'stats' THEN
        -- Option A: Sacrifice 25% of all 4 category stats
        UPDATE public.stats
        SET intellect = round(intellect * (1 - v_stat_penalty_ratio)),
            strength = round(strength * (1 - v_stat_penalty_ratio)),
            discipline = round(discipline * (1 - v_stat_penalty_ratio)),
            willpower = round(willpower * (1 - v_stat_penalty_ratio)),
            updated_at = now()
        WHERE user_id = v_user_id;
    ELSIF p_choice = 'coins' THEN
        -- Option B: Sacrifice coins (coins drop heavily, stats preserved)
        UPDATE public.profiles
        SET coin_balance = round(coin_balance * (1 - v_coin_penalty_ratio))
        WHERE id = v_user_id;
    ELSE
        RAISE EXCEPTION 'Invalid sacrifice choice. Must be "stats" or "coins"';
    END IF;

    -- Reset Reincarnation Meter to 0
    UPDATE public.profiles
    SET reincarnation_meter = 0
    WHERE id = v_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'tradeoff_selected', p_choice,
        'reincarnation_meter_reset', 0
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6. GLOBAL LEADERBOARD VIEW FUNCTION
-- Ranked by the average of the four category stats: (intellect + strength + discipline + willpower) / 4
CREATE OR REPLACE FUNCTION public.get_global_leaderboard()
RETURNS TABLE (
    rank BIGINT,
    user_id UUID,
    display_name TEXT,
    current_level INT,
    average_stat NUMERIC,
    intellect NUMERIC,
    strength NUMERIC,
    discipline NUMERIC,
    willpower NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY ((s.intellect + s.strength + s.discipline + s.willpower) / 4.0) DESC) as rank,
        p.id as user_id,
        split_part(p.email, '@', 1) as display_name,
        p.current_level,
        round(((s.intellect + s.strength + s.discipline + s.willpower) / 4.0), 1) as average_stat,
        s.intellect,
        s.strength,
        s.discipline,
        s.willpower
    FROM public.profiles p
    JOIN public.stats s ON p.id = s.user_id
    ORDER BY average_stat DESC
    LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================================
-- SEED DATA: COSMETIC ITEMS CATALOG
-- =====================================================================

INSERT INTO public.items (id, name, category, cost, icon, description) VALUES
('title_novice', 'Novice Adventurer', 'title', 5, '⚔️', 'For those taking their first steps in discipline'),
('title_scholar', 'Arcane Scholar', 'title', 15, '📜', 'Granted to masters of the Intellect realm'),
('title_titan', 'Iron Titan', 'title', 25, '🛡️', 'Forged through unyielding physical effort'),
('frame_ember', 'Ember Aura Frame', 'avatar_frame', 35, '🔥', 'A blazing red border radiating boundless energy'),
('frame_astral', 'Astral Void Frame', 'avatar_frame', 50, '✨', 'A shimmering violet cosmic ring of sheer willpower'),
('badge_conqueror', 'Dungeon Conqueror', 'badge', 60, '👑', 'Reserved for heroes who keep the reincarnation meter at zero')
ON CONFLICT (id) DO NOTHING;
