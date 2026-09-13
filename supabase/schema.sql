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
    equipped_leaderboard_effect TEXT,
    display_name TEXT DEFAULT 'Knight Protector',
    avatar_url TEXT DEFAULT '/images/avatars/knight_protector.jpg',
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
    category TEXT NOT NULL DEFAULT 'border', -- 'border'
    effect_type TEXT NOT NULL DEFAULT 'border' CHECK (effect_type IN ('border')),
    tier TEXT NOT NULL DEFAULT 'Common', -- 'Common', 'Rare', 'Legendary'
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
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Profiles: INSERT allowed only when id = auth.uid() (used by handle_new_user trigger)
DROP POLICY IF EXISTS "Service can insert new profile on signup" ON public.profiles;
CREATE POLICY "Service can insert new profile on signup"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);
-- Note: No DELETE policy on profiles — deletion cascades from auth.users and is not
-- permitted via direct client calls (blocked by default without a permissive policy).

-- Stats: Users manage their own stats
DROP POLICY IF EXISTS "Users can view their own stats" ON public.stats;
CREATE POLICY "Users can view their own stats" 
    ON public.stats FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own stats" ON public.stats;
CREATE POLICY "Users can update their own stats" 
    ON public.stats FOR UPDATE 
    USING (auth.uid() = user_id);

-- Stats: INSERT allowed only when user_id = auth.uid() (used by handle_new_user trigger)
DROP POLICY IF EXISTS "Service can insert stats on signup" ON public.stats;
CREATE POLICY "Service can insert stats on signup"
    ON public.stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);
-- Note: No DELETE policy on stats — deletion cascades from profiles and is not
-- permitted via direct client calls.

-- Tasks: Full CRUD for own tasks
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
CREATE POLICY "Users can view their own tasks" 
    ON public.tasks FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
CREATE POLICY "Users can insert their own tasks" 
    ON public.tasks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
CREATE POLICY "Users can update their own tasks" 
    ON public.tasks FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
CREATE POLICY "Users can delete their own tasks" 
    ON public.tasks FOR DELETE 
    USING (auth.uid() = user_id);

-- Habits: Full CRUD for own habits
DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;
CREATE POLICY "Users can view their own habits" 
    ON public.habits FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own habits" ON public.habits;
CREATE POLICY "Users can insert their own habits" 
    ON public.habits FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
CREATE POLICY "Users can update their own habits" 
    ON public.habits FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;
CREATE POLICY "Users can delete their own habits" 
    ON public.habits FOR DELETE 
    USING (auth.uid() = user_id);

-- Items: Readable by all authenticated users (catalog is admin-managed; no write policies granted)
DROP POLICY IF EXISTS "Items catalog is viewable by authenticated users" ON public.items;
CREATE POLICY "Items catalog is viewable by authenticated users" 
    ON public.items FOR SELECT 
    TO authenticated 
    USING (true);
-- Note: No INSERT/UPDATE/DELETE policies on items — catalog rows are managed
-- via migrations/admin only. Client writes are blocked by default.

-- User Inventory: Manage own inventory
DROP POLICY IF EXISTS "Users can view their inventory" ON public.user_inventory;
CREATE POLICY "Users can view their inventory" 
    ON public.user_inventory FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert into their inventory" ON public.user_inventory;
CREATE POLICY "Users can insert into their inventory" 
    ON public.user_inventory FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their inventory" ON public.user_inventory;
CREATE POLICY "Users can update their inventory" 
    ON public.user_inventory FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from their inventory" ON public.user_inventory;
CREATE POLICY "Users can delete from their inventory"
    ON public.user_inventory FOR DELETE
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

    -- Flat Gain, No Multiplier: Easy (+1), Medium (+2), Hard (+3)
    -- Pressure Relief: Easy (-1), Medium (-2), Hard (-3)
    IF v_difficulty = 'Hard' THEN
        v_xp_gain := 3;
        v_stat_gain := 3;
        v_reduce_on_complete := 3;
    ELSIF v_difficulty = 'Medium' THEN
        v_xp_gain := 2;
        v_stat_gain := 2;
        v_reduce_on_complete := 2;
    ELSE
        v_xp_gain := 1;
        v_stat_gain := 1;
        v_reduce_on_complete := 1;
    END IF;

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

    -- Award coins to profile and relieve Reincarnation pressure (-2, floored at 0)
    UPDATE public.profiles
    SET coin_balance = coin_balance + v_coins_awarded,
        reincarnation_meter = GREATEST(0, reincarnation_meter - 2)
    WHERE id = v_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'coins_awarded', v_coins_awarded,
        'current_streak', v_current_streak,
        'longest_streak', v_longest_streak,
        'reincarnation_reduced_by', 2
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. HABIT STREAK BREAK PENALTY
-- Adds +10 Reincarnation Bar and deducts coins linearly based on broken count
-- remaining_coins = original_coins * (1 - 0.10 * number_of_habits_broken_that_day)
CREATE OR REPLACE FUNCTION public.stub_handle_habit_streak_break(p_habit_id UUID, p_broken_count INT DEFAULT 1)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_coin_retention NUMERIC;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Reset streak on the habit
    UPDATE public.habits
    SET current_streak = 0
    WHERE id = p_habit_id AND user_id = v_user_id;

    -- Linear coin retention: GREATEST(0.0, 1.0 - (0.10 * p_broken_count))
    v_coin_retention := GREATEST(0.0, 1.0 - (0.10 * COALESCE(p_broken_count, 1)));

    UPDATE public.profiles
    SET coin_balance = round(coin_balance * v_coin_retention),
        reincarnation_meter = LEAST(100, reincarnation_meter + 10)
    WHERE id = v_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'reincarnation_added', 10,
        'coin_retention_rate', v_coin_retention
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. CHECK EXPIRED TASKS RPC (Reverse-scaled stat penalty + normal-scaled reincarnation pressure)
-- Easy: -3 stat / +8 pressure
-- Medium: -2 stat / +9 pressure
-- Hard: -1 stat / +10 pressure
CREATE OR REPLACE FUNCTION public.check_expired_tasks()
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_task RECORD;
    v_receive_on_fail NUMERIC;
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

        -- Reverse-scaled stat penalty & reverse-scaled reincarnation pressure:
        -- Hard not complete: -1 stat, +8 pressure
        -- Medium not complete: -2 stat, +9 pressure
        -- Easy not complete: -3 stat, +10 pressure
        IF v_task.difficulty = 'Hard' THEN
            v_penalty := 1;
            v_receive_on_fail := 8;
        ELSIF v_task.difficulty = 'Medium' THEN
            v_penalty := 2;
            v_receive_on_fail := 9;
        ELSE
            v_penalty := 3;
            v_receive_on_fail := 10;
        END IF;

        v_reincarnation_increase := v_reincarnation_increase + v_receive_on_fail;

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
    willpower NUMERIC,
    equipped_leaderboard_effect TEXT
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
        s.willpower,
        p.equipped_leaderboard_effect
    FROM public.profiles p
    JOIN public.stats s ON p.id = s.user_id
    ORDER BY average_stat DESC
    LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 7. BUY SHOP ITEM RPC (Server-side coin balance validation & atomic insert)
CREATE OR REPLACE FUNCTION public.buy_shop_item(p_item_id TEXT)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_cost INT;
    v_current_coins INT;
    v_already_owned BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Fetch item cost with validation
    SELECT cost INTO v_cost
    FROM public.items
    WHERE id = p_item_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Item not found in catalog';
    END IF;

    -- Check if user already owns the item
    SELECT EXISTS (
        SELECT 1 FROM public.user_inventory
        WHERE user_id = v_user_id AND item_id = p_item_id
    ) INTO v_already_owned;

    IF v_already_owned THEN
        RAISE EXCEPTION 'Item already owned';
    END IF;

    -- Fetch user coins with row-level lock
    SELECT coin_balance INTO v_current_coins
    FROM public.profiles
    WHERE id = v_user_id
    FOR UPDATE;

    IF v_current_coins < v_cost THEN
        RAISE EXCEPTION 'Insufficient coins: need %, have %', v_cost, v_current_coins;
    END IF;

    -- Deduct coins
    UPDATE public.profiles
    SET coin_balance = coin_balance - v_cost
    WHERE id = v_user_id;

    -- Insert into user_inventory
    INSERT INTO public.user_inventory (user_id, item_id, is_equipped)
    VALUES (v_user_id, p_item_id, FALSE);

    RETURN jsonb_build_object(
        'success', true,
        'item_id', p_item_id,
        'coins_spent', v_cost,
        'remaining_coins', v_current_coins - v_cost
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 8. TOGGLE EQUIP ITEM RPC (Server-side single-effect exclusivity)
CREATE OR REPLACE FUNCTION public.toggle_equip_item(p_item_id TEXT)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_is_currently_equipped BOOLEAN;
    v_new_equipped_state BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Verify ownership
    SELECT is_equipped INTO v_is_currently_equipped
    FROM public.user_inventory
    WHERE user_id = v_user_id AND item_id = p_item_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Item is not owned by user';
    END IF;

    v_new_equipped_state := NOT v_is_currently_equipped;

    IF v_new_equipped_state THEN
        -- Unequip any other border item first (only 1 equippable at once)
        UPDATE public.user_inventory
        SET is_equipped = FALSE
        WHERE user_id = v_user_id;

        -- Equip this item
        UPDATE public.user_inventory
        SET is_equipped = TRUE
        WHERE user_id = v_user_id AND item_id = p_item_id;

        -- Update profile equipped effect
        UPDATE public.profiles
        SET equipped_leaderboard_effect = p_item_id
        WHERE id = v_user_id;
    ELSE
        -- Unequip this item
        UPDATE public.user_inventory
        SET is_equipped = FALSE
        WHERE user_id = v_user_id AND item_id = p_item_id;

        -- Clear profile equipped effect
        UPDATE public.profiles
        SET equipped_leaderboard_effect = NULL
        WHERE id = v_user_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'item_id', p_item_id,
        'is_equipped', v_new_equipped_state,
        'equipped_leaderboard_effect', CASE WHEN v_new_equipped_state THEN p_item_id ELSE NULL END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================================
-- SEED DATA: LEADERBOARD BORDER EFFECTS CATALOG
-- =====================================================================

INSERT INTO public.items (id, name, category, effect_type, tier, cost, icon, description) VALUES
('border_iron_band', 'Iron Band', 'border', 'border', 'Common', 20, '⛓️', 'A simple, solid iron-gray border with a subtle carved inset.'),
('border_bronze_sigil', 'Bronze Sigil Frame', 'border', 'border', 'Rare', 100, '⚜️', 'A thick bronze border styled with carved corner flourishes.'),
('border_ember_rune', 'Ember Rune Border', 'border', 'border', 'Legendary', 500, '🔥', 'An animated glowing border of slow-moving deep red and orange embers.')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    effect_type = EXCLUDED.effect_type,
    tier = EXCLUDED.tier,
    cost = EXCLUDED.cost,
    icon = EXCLUDED.icon,
    description = EXCLUDED.description;


-- =====================================================================
-- 10. BOSS MONSTER DEFEAT CLAIMS & BOUNTY RPC
-- Awards 50 Gold Coins upon defeat, strictly once per boss per cycle
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.boss_defeat_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    boss_name TEXT NOT NULL,
    cycle_id TEXT NOT NULL,
    reward_coins INT NOT NULL DEFAULT 50,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_boss_cycle UNIQUE (user_id, category, cycle_id)
);

ALTER TABLE public.boss_defeat_claims ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename = 'boss_defeat_claims' 
          AND policyname = 'Users can read own boss defeat claims'
    ) THEN
        CREATE POLICY "Users can read own boss defeat claims"
            ON public.boss_defeat_claims FOR SELECT
            USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename = 'boss_defeat_claims' 
          AND policyname = 'Users can insert own boss defeat claims'
    ) THEN
        CREATE POLICY "Users can insert own boss defeat claims"
            ON public.boss_defeat_claims FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

CREATE OR REPLACE FUNCTION public.claim_boss_defeat_reward(
    p_category TEXT,
    p_boss_name TEXT,
    p_cycle_id TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_already_claimed BOOLEAN := FALSE;
    v_new_coins INT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Check if already claimed for this category and cycle
    SELECT EXISTS (
        SELECT 1 FROM public.boss_defeat_claims
        WHERE user_id = v_user_id 
          AND category = p_category 
          AND cycle_id = p_cycle_id
    ) INTO v_already_claimed;

    IF v_already_claimed THEN
        RETURN jsonb_build_object(
            'success', false,
            'coins_awarded', 0,
            'already_claimed', true,
            'reason', 'ALREADY_CLAIMED_IN_THIS_CYCLE',
            'category', p_category,
            'cycle_id', p_cycle_id
        );
    END IF;

    -- Record claim
    INSERT INTO public.boss_defeat_claims (user_id, category, boss_name, cycle_id, reward_coins)
    VALUES (v_user_id, p_category, p_boss_name, p_cycle_id, 50);

    -- Award 50 Gold Coins to user's profile
    UPDATE public.profiles
    SET coin_balance = COALESCE(coin_balance, 0) + 50
    WHERE id = v_user_id
    RETURNING coin_balance INTO v_new_coins;

    RETURN jsonb_build_object(
        'success', true,
        'coins_awarded', 50,
        'already_claimed', false,
        'new_coin_balance', v_new_coins,
        'boss_name', p_boss_name,
        'category', p_category,
        'cycle_id', p_cycle_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

