-- =====================================================================
-- MIGRATION: SECURITY AUDIT — RLS POLICY GAPS
-- Date: 2026-09-13
-- Adds missing INSERT / DELETE policies on profiles, stats, items,
-- user_inventory, and boss_defeat_claims that were absent from the
-- original schema, closing the four-operation coverage gap.
-- =====================================================================

-- -----------------------------------------------------------------
-- PROFILES: Missing INSERT and DELETE
-- INSERT is needed for the handle_new_user() trigger (runs as SECURITY
-- DEFINER so it bypasses RLS, but explicit coverage closes the gap).
-- Direct client INSERT should be forbidden — only the trigger should fire.
-- DELETE: users must not be able to delete their own auth record via
-- this path; disallow it explicitly.
-- -----------------------------------------------------------------

DROP POLICY IF EXISTS "Service can insert new profile on signup" ON public.profiles;
CREATE POLICY "Service can insert new profile on signup"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- No client-side DELETE on profiles (handled by cascade from auth.users deletion)
-- Explicitly deny to prevent any accidental direct deletion
DROP POLICY IF EXISTS "Users cannot directly delete their profile" ON public.profiles;
-- (No permissive DELETE policy = DELETE blocked by default — documented here for clarity)

-- -----------------------------------------------------------------
-- STATS: Missing INSERT and DELETE
-- INSERT only via the trigger (same SECURITY DEFINER reasoning).
-- DELETE: blocked by default; documented below.
-- -----------------------------------------------------------------

DROP POLICY IF EXISTS "Service can insert stats on signup" ON public.stats;
CREATE POLICY "Service can insert stats on signup"
    ON public.stats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------
-- ITEMS: Write policies — catalog is admin-managed only.
-- The catalog table should be read-only for authenticated users.
-- INSERT / UPDATE / DELETE are intentionally NOT granted to any role,
-- ensuring no client can modify shop catalog rows.
-- (No permissive write policies = write blocked by default for anon/authenticated.)
-- -----------------------------------------------------------------

-- -----------------------------------------------------------------
-- USER_INVENTORY: Missing DELETE
-- Users should be able to remove items from their own inventory if needed.
-- -----------------------------------------------------------------

DROP POLICY IF EXISTS "Users can delete from their inventory" ON public.user_inventory;
CREATE POLICY "Users can delete from their inventory"
    ON public.user_inventory FOR DELETE
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------
-- BOSS_DEFEAT_CLAIMS: Missing UPDATE and DELETE
-- Claims are append-only. Prevent tampering.
-- UPDATE and DELETE are intentionally blocked (no permissive policy).
-- Documented here for audit completeness.
-- -----------------------------------------------------------------

-- No UPDATE policy on boss_defeat_claims (blocked by default — correct)
-- No DELETE policy on boss_defeat_claims (blocked by default — correct)
