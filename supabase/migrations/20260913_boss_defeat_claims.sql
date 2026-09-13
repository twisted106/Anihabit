-- =====================================================================
-- MIGRATION: BOSS MONSTER DEFEAT BOUNTY & CLAIMS TRACKING
-- Enforces: 50 Gold Coins awarded on defeat, capped strictly to once
-- per boss monster per leaderboard cycle.
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
