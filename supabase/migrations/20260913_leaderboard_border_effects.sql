-- =====================================================================
-- MIGRATION: LEADERBOARD BORDER EFFECTS SYSTEM
-- Date: 2026-09-13
-- Purpose: Replace placeholder shop items with 3 Leaderboard Border Effects,
-- add RPCs for server-side purchase and equip integrity.
-- =====================================================================

-- 1. ADD COLUMNS TO public.items AND public.profiles
ALTER TABLE public.items 
    ADD COLUMN IF NOT EXISTS effect_type TEXT NOT NULL DEFAULT 'border',
    ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'Common';

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS equipped_leaderboard_effect TEXT REFERENCES public.items(id) ON DELETE SET NULL;

-- 2. CLEAN UP LEGACY PLACEHOLDER ITEMS FROM USER INVENTORIES AND CATALOG
-- Remove legacy inventory rows that reference old frames, titles, badges
DELETE FROM public.user_inventory 
WHERE item_id NOT IN ('border_iron_band', 'border_bronze_sigil', 'border_ember_rune');

DELETE FROM public.items 
WHERE id NOT IN ('border_iron_band', 'border_bronze_sigil', 'border_ember_rune');

-- 3. SEED THE THREE NEW LEADERBOARD BORDER ITEMS
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

-- 4. UPDATE get_global_leaderboard RPC TO RETURN EQUIPPED EFFECT
DROP FUNCTION IF EXISTS public.get_global_leaderboard();

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

-- 5. BUY SHOP ITEM RPC (Server-side coin balance validation & atomic insert)
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

-- 6. TOGGLE EQUIP ITEM RPC (Server-side single-effect exclusivity)
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
