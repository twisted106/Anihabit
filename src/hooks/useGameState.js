/**
 * @file useGameState.js
 * @description Central reactive game engine hook for the Life RPG application.
 * Manages player profile, category stats, task CRUD, habit streaks, shop inventory,
 * and server-side RPC sync with optimistic local updates.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  RECEIVE_ON_FAIL, 
  REDUCE_ON_COMPLETE, 
  REINCARNATION_MAX,
  MAX_HABIT_DAILY_COINS,
  HABIT_PRESSURE_RELIEF,
  HABIT_STREAK_BREAK_PRESSURE,
  calculateStreakBreakCoinRetention,
  REINCARNATION_STAT_SACRIFICE_PERCENT,
  REINCARNATION_COIN_SACRIFICE_PERCENT,
  DIFFICULTY_CONFIG,
  CATEGORIES,
  calculateXpToNextLevel,
  calculatePowerScore,
  getMostRecentMidnightIST,
  LEADERBOARD_BORDER_ITEMS,
  BOSS_DEFEAT_COIN_REWARD,
  CATEGORY_BOSS_MAP,
  getCurrentLeaderboardCycleId
} from '../constants/gameConfig';
import { sound } from '../lib/audio';
import confetti from 'canvas-confetti';

// =====================================================================
// INITIAL DEMO STATE (Used for offline development & instant evaluation)
// =====================================================================
const DEMO_PROFILE = {
  id: 'demo-hero-id',
  email: 'hero@anihabit.rpg',
  display_name: 'Knight Protector',
  avatar_url: '/images/avatars/knight_protector.jpg',
  current_level: 1,
  current_xp: 35,
  coin_balance: 14,
  reincarnation_meter: 25, // Initial pressure for visual indicator
  created_at: new Date().toISOString()
};

const DEMO_STATS = {
  intellect: 18,  // Academics
  strength: 14,   // Fitness
  discipline: 22, // Lifestyle
  willpower: 12   // Other
};

const DEMO_TASKS = [
  {
    id: 'task-1',
    user_id: 'demo-hero-id',
    title: 'Study Data Structures & Algorithms',
    category: 'Academics',
    difficulty: 'Hard',
    is_completed: false,
    deadline_at: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'task-2',
    user_id: 'demo-hero-id',
    title: 'Run 5km Morning Cardio',
    category: 'Fitness',
    difficulty: 'Medium',
    is_completed: false,
    deadline_at: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'task-3',
    user_id: 'demo-hero-id',
    title: 'Prepare Healthy Meal Plan',
    category: 'Lifestyle',
    difficulty: 'Easy',
    is_completed: false,
    deadline_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'task-4',
    user_id: 'demo-hero-id',
    title: 'Meditate for 15 Minutes',
    category: 'Other',
    difficulty: 'Easy',
    is_completed: false,
    deadline_at: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'task-5',
    user_id: 'demo-hero-id',
    title: 'Review Operating Systems Chapters',
    category: 'Academics',
    difficulty: 'Medium',
    is_completed: false,
    deadline_at: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    created_at: new Date().toISOString()
  }
];

const DEMO_HABITS = [
  {
    id: 'habit-1',
    user_id: 'demo-hero-id',
    title: 'Daily Code Practice',
    category: 'Academics',
    current_streak: 4,
    longest_streak: 7,
    last_completed_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'habit-2',
    user_id: 'demo-hero-id',
    title: 'Hydration (3L Water)',
    category: 'Fitness',
    current_streak: 2,
    longest_streak: 5,
    last_completed_at: null,
    created_at: new Date().toISOString()
  },
  {
    id: 'habit-3',
    user_id: 'demo-hero-id',
    title: 'Sleep Before 11 PM',
    category: 'Lifestyle',
    current_streak: 1,
    longest_streak: 3,
    last_completed_at: null,
    created_at: new Date().toISOString()
  }
];

const DEFAULT_SHOP_ITEMS = LEADERBOARD_BORDER_ITEMS;

const getStoredInventory = () => {
  try {
    const raw = localStorage.getItem('anihabit_user_inventory');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredInventory = (inv) => {
  try {
    localStorage.setItem('anihabit_user_inventory', JSON.stringify(inv));
  } catch {}
};

const getDemoBossClaims = (cycleId) => {
  try {
    const raw = localStorage.getItem(`demo_boss_defeat_claims_${cycleId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveDemoBossClaims = (cycleId, claims) => {
  try {
    localStorage.setItem(`demo_boss_defeat_claims_${cycleId}`, JSON.stringify(claims));
  } catch {}
};

const getStoredCustomProfile = () => {
  try {
    const raw = localStorage.getItem('anihabit_custom_profile');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveStoredCustomProfile = (customData) => {
  try {
    localStorage.setItem('anihabit_custom_profile', JSON.stringify(customData));
  } catch {}
};

export function useGameState() {
  // Session & Authentication
  const [sessionUser, setSessionUser] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);
  const [isLoading, setIsLoading] = useState(true);

  // Core RPG Entities
  const [profile, setProfile] = useState(() => {
    const custom = getStoredCustomProfile();
    return {
      ...DEMO_PROFILE,
      ...custom
    };
  });
  const [stats, setStats] = useState(DEMO_STATS);
  const [tasks, setTasks] = useState(DEMO_TASKS);
  const [habits, setHabits] = useState(DEMO_HABITS);
  const [shopItems, setShopItems] = useState(DEFAULT_SHOP_ITEMS);
  const [userInventory, setUserInventory] = useState(getStoredInventory);
  const [leaderboard, setLeaderboard] = useState([]);

  // Boss Defeat Claims in current leaderboard cycle: array of category keys, e.g. ['Fitness']
  const [claimedBossesThisCycle, setClaimedBossesThisCycle] = useState(() => {
    const currentCycle = getCurrentLeaderboardCycleId();
    return getDemoBossClaims(currentCycle);
  });

  // UI Modals & Notifications
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isTradeoffModalOpen, setIsTradeoffModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Notification Dispatcher
  const notify = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Check Reincarnation Danger Condition
  useEffect(() => {
    if (profile.reincarnation_meter >= REINCARNATION_MAX && !isTradeoffModalOpen) {
      sound.playTradeoffAlert();
      setIsTradeoffModalOpen(true);
      notify('CRITICAL ALERT: Reincarnation meter at maximum capacity! A sacrifice is demanded.', 'danger');
    }
  }, [profile.reincarnation_meter, isTradeoffModalOpen, notify]);

  // Load Data from Supabase or Fallback to Demo Mode
  const refreshGameData = useCallback(async (userId) => {
    if (!isSupabaseConfigured || !userId) return;

    try {
      setIsLoading(true);
      // 1. Fetch Profile
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData && !profileErr) {
        const custom = getStoredCustomProfile();
        setProfile({
          ...profileData,
          display_name: profileData.display_name || custom.display_name || 'Knight Protector',
          avatar_url: profileData.avatar_url || custom.avatar_url || '/images/avatars/knight_protector.jpg'
        });
      }

      // 2. Fetch Stats
      const { data: statsData, error: statsErr } = await supabase
        .from('stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (statsData && !statsErr) {
        setStats({
          intellect: Number(statsData.intellect),
          strength: Number(statsData.strength),
          discipline: Number(statsData.discipline),
          willpower: Number(statsData.willpower)
        });
      }

      // 3. Fetch Tasks
      const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (tasksData) setTasks(tasksData);

      // 4. Fetch Habits
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (habitsData) setHabits(habitsData);

      // 5. Fetch Shop Items Catalog (Leaderboard Border Effects only)
      const { data: catalogData } = await supabase
        .from('items')
        .select('*');

      if (catalogData && catalogData.length > 0) {
        const borderCatalog = catalogData.filter(
          (i) => i.effect_type === 'border' || i.id?.startsWith('border_')
        );
        setShopItems(borderCatalog.length > 0 ? borderCatalog : LEADERBOARD_BORDER_ITEMS);
      } else {
        setShopItems(LEADERBOARD_BORDER_ITEMS);
      }

      // 6. Fetch User Inventory
      const { data: inventoryData } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('user_id', userId);

      const localInv = getStoredInventory();
      const remoteValid = (inventoryData || []).filter(inv => inv.item_id?.startsWith('border_'));

      // Merge: remote takes precedence, but preserve local purchases if remote DB migration is pending
      const mergedMap = new Map();
      for (const item of localInv) {
        if (item.item_id?.startsWith('border_')) {
          mergedMap.set(item.item_id, item);
        }
      }
      for (const item of remoteValid) {
        mergedMap.set(item.item_id, item);
      }
      const finalInventory = Array.from(mergedMap.values());
      setUserInventory(finalInventory);
      saveStoredInventory(finalInventory);

      // 7. Fetch Boss Defeat Claims for Current Cycle
      const currentCycle = getCurrentLeaderboardCycleId();
      try {
        const { data: claimsData } = await supabase
          .from('boss_defeat_claims')
          .select('category')
          .eq('user_id', userId)
          .eq('cycle_id', currentCycle);

        if (claimsData) {
          setClaimedBossesThisCycle(claimsData.map((c) => c.category));
        }
      } catch (claimsErr) {
        console.warn('Could not fetch boss defeat claims:', claimsErr);
      }

    } catch (err) {
      console.error('Error hydrating game data from Supabase:', err);
      notify('Failed to sync remote data. Running in offline view.', 'warning');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  // Handle Supabase Auth Initialization
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsDemoMode(true);
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSessionUser(session.user);
        setIsDemoMode(false);
        refreshGameData(session.user.id);
      } else {
        setIsDemoMode(true);
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSessionUser(session.user);
        setIsDemoMode(false);
        refreshGameData(session.user.id);
      } else {
        setSessionUser(null);
        setIsDemoMode(true);
        const custom = getStoredCustomProfile();
        setProfile({ ...DEMO_PROFILE, ...custom });
        setStats(DEMO_STATS);
        setTasks(DEMO_TASKS);
        setHabits(DEMO_HABITS);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshGameData]);

  // Fetch Global Leaderboard
  const fetchLeaderboard = useCallback(async () => {
    if (isSupabaseConfigured && !isDemoMode) {
      try {
        const { data, error } = await supabase.rpc('get_global_leaderboard');
        if (!error && data) {
          setLeaderboard(data);
          return;
        }
      } catch (err) {
        console.warn('Could not call get_global_leaderboard RPC', err);
      }
    }

    // Demo Leaderboard Mock Data (Showcasing Border Effects)
    const activeEquippedBorder = userInventory.find((inv) => inv.is_equipped)?.item_id || profile?.equipped_leaderboard_effect || null;

    const mockRanks = [
      { rank: 1, user_id: 'mock-1', display_name: 'AetherMage', current_level: 12, average_stat: 48.5, intellect: 65, strength: 40, discipline: 45, willpower: 44, equipped_leaderboard_effect: 'border_ember_rune' },
      { rank: 2, user_id: 'mock-2', display_name: 'ValkyriePrime', current_level: 10, average_stat: 41.2, intellect: 35, strength: 58, discipline: 38, willpower: 34, equipped_leaderboard_effect: 'border_bronze_sigil' },
      { rank: 3, user_id: sessionUser?.id || 'demo-hero-id', display_name: profile.display_name || (sessionUser?.email ? sessionUser.email.split('@')[0] : 'Hero (You)'), current_level: profile.current_level, average_stat: calculatePowerScore(stats), intellect: stats.intellect, strength: stats.strength, discipline: stats.discipline, willpower: stats.willpower, equipped_leaderboard_effect: activeEquippedBorder },
      { rank: 4, user_id: 'mock-4', display_name: 'ShadowBlade', current_level: 8, average_stat: 28.0, intellect: 20, strength: 34, discipline: 32, willpower: 26, equipped_leaderboard_effect: 'border_iron_band' },
      { rank: 5, user_id: 'mock-5', display_name: 'ZenDisciple', current_level: 7, average_stat: 24.5, intellect: 22, strength: 18, discipline: 38, willpower: 20, equipped_leaderboard_effect: null }
    ].sort((a, b) => b.average_stat - a.average_stat).map((item, idx) => ({ ...item, rank: idx + 1 }));

    setLeaderboard(mockRanks);
  }, [isDemoMode, sessionUser, profile.current_level, profile.display_name, profile?.equipped_leaderboard_effect, userInventory, stats]);

  // =====================================================================
  // ACTIONS: TASK MANAGEMENT
  // =====================================================================
  const createTask = useCallback(async ({ title, category, difficulty }) => {
    if (!title?.trim()) {
      notify('Please enter a task title', 'warning');
      return false;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      user_id: sessionUser?.id || 'demo-hero-id',
      title: title.trim(),
      category,
      difficulty,
      is_completed: false,
      deadline_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && !isDemoMode && sessionUser) {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert([{
            user_id: sessionUser.id,
            title: title.trim(),
            category,
            difficulty,
            deadline_at: newTask.deadline_at
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) newTask.id = data.id;
      } catch (err) {
        console.error('Task insertion error:', err);
        notify('Failed to save task to database', 'danger');
        return false;
      }
    }

    setTasks((prev) => [newTask, ...prev]);
    notify(`Quest registered: "${title}" (${category} - ${difficulty})`, 'success');
    return true;
  }, [isDemoMode, sessionUser, notify]);

  const completeTask = useCallback(async (taskId) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask || targetTask.is_completed) return;

    sound.playTaskComplete();

    // Optimistic UI calculation
    const diffConfig = DIFFICULTY_CONFIG[targetTask.difficulty] || DIFFICULTY_CONFIG.Easy;
    const xpGained = diffConfig.xp;
    const statGained = diffConfig.stat;
    const pressureRelief = diffConfig.pressureRelief || 1;
    const statKey = CATEGORIES[targetTask.category]?.stat || 'intellect';

    // Check if category will be all clear after completing this task
    const remainingInCategory = tasks.filter(
      (t) => t.category === targetTask.category && !t.is_completed && t.id !== taskId
    );
    const isCategoryAllClear = remainingInCategory.length === 0;

    let totalXpGain = xpGained;
    let totalStatGain = statGained;

    // Boss Monster Defeat Bounty (50 Gold Coins on First Defeat per Leaderboard Cycle)
    const currentCycle = getCurrentLeaderboardCycleId();
    const bossInfo = CATEGORY_BOSS_MAP[targetTask.category] || { name: `${targetTask.category} Boss`, category: targetTask.category };
    const alreadyClaimedInCycle = claimedBossesThisCycle.includes(targetTask.category);

    let coinsToAdd = 0;
    if (isCategoryAllClear) {
      if (!alreadyClaimedInCycle) {
        coinsToAdd = BOSS_DEFEAT_COIN_REWARD;
        confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
        sound.playPurchase?.();
        notify(`BOSS DEFEATED: ${bossInfo.name} subdued! +${BOSS_DEFEAT_COIN_REWARD} Gold Coins claimed! (Cycle ${currentCycle})`, 'gold');

        const nextClaims = [...claimedBossesThisCycle.filter((c) => c !== targetTask.category), targetTask.category];
        setClaimedBossesThisCycle(nextClaims);
        saveDemoBossClaims(currentCycle, nextClaims);

        if (isSupabaseConfigured && !isDemoMode && sessionUser) {
          try {
            await supabase.rpc('claim_boss_defeat_reward', {
              p_category: targetTask.category,
              p_boss_name: bossInfo.name,
              p_cycle_id: currentCycle
            });
          } catch (claimErr) {
            try {
              await supabase.from('boss_defeat_claims').insert([{
                user_id: sessionUser.id,
                category: targetTask.category,
                boss_name: bossInfo.name,
                cycle_id: currentCycle,
                reward_coins: BOSS_DEFEAT_COIN_REWARD
              }]);
            } catch (fbErr) {}
          }
        }
      } else {
        // Repeat Defeat in same cycle: 0 additional coins (Loophole Closed)
        confetti({ particleCount: 40, spread: 40, origin: { y: 0.7 } });
        notify(`${targetTask.category} realm cleared! (${bossInfo.name} bounty already claimed for cycle ${currentCycle})`, 'gold');
      }
    }

    // Target Reincarnation meter after strictly decreasing by difficulty relief:
    // Easy (-1), Medium (-2), Hard (-3)
    const currentMeter = Number(profile?.reincarnation_meter || 0);
    const targetMeter = Math.max(0, currentMeter - pressureRelief);

    // Call server-side RPC if connected
    if (isSupabaseConfigured && !isDemoMode && sessionUser) {
      try {
        const { data, error } = await supabase.rpc('complete_task', { p_task_id: taskId });
        if (error) {
          console.error('complete_task RPC failed:', error);
          notify('Server error completing task', 'danger');
          return;
        }

        // Overwrite cloud profile's reincarnation_meter to guarantee exact flat decrement (-1, -2, -3)
        try {
          await supabase
            .from('profiles')
            .update({ reincarnation_meter: targetMeter })
            .eq('id', sessionUser.id);
        } catch (updateErr) {
          console.warn('Could not sync reincarnation_meter directly to profiles table:', updateErr);
        }

        if (coinsToAdd > 0) {
          try {
            const { data: curProf } = await supabase.from('profiles').select('coin_balance').eq('id', sessionUser.id).single();
            const curBal = Number(curProf?.coin_balance || 0);
            await supabase.from('profiles').update({ coin_balance: curBal + coinsToAdd }).eq('id', sessionUser.id);
          } catch (profErr) {
            console.warn('Could not sync coin_balance to Supabase profiles:', profErr);
          }
        }

        await refreshGameData(sessionUser.id);

        // Force local state to targetMeter and ensure bounty coins are credited
        setProfile((prev) => ({
          ...prev,
          reincarnation_meter: targetMeter,
          coin_balance: Math.max(Number(prev?.coin_balance || 0), Number(profile?.coin_balance || 0) + coinsToAdd)
        }));

        notify(`Task Completed! +${totalXpGain} XP, +${totalStatGain} ${CATEGORIES[targetTask.category]?.statLabel} | Pressure -${pressureRelief}`, 'success');
        return;
      } catch (err) {
        console.error('complete_task error:', err);
      }
    }

    // Local / Demo State Update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, is_completed: true, completed_at: new Date().toISOString() } : t))
    );

    // Update Stats
    setStats((prev) => ({
      ...prev,
      [statKey]: prev[statKey] + totalStatGain
    }));

    // Update Profile & Check Non-linear Leveling, adding bounty coins atomically
    setProfile((prev) => {
      let currentXp = prev.current_xp + totalXpGain;
      let currentLevel = prev.current_level;
      let needed = calculateXpToNextLevel(currentLevel);
      let didLevelUp = false;

      while (currentXp >= needed) {
        currentXp -= needed;
        currentLevel += 1;
        needed = calculateXpToNextLevel(currentLevel);
        didLevelUp = true;
      }

      if (didLevelUp) {
        sound.playLevelUp();
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        notify(`HEROIC ADVANCEMENT! Reached Level ${currentLevel}!`, 'gold');
      }

      return {
        ...prev,
        current_level: currentLevel,
        current_xp: currentXp,
        // Relieve reincarnation meter strictly by task difficulty relief: Easy (-1), Medium (-2), Hard (-3)
        reincarnation_meter: targetMeter,
        // Atomically add coins directly here upon enemy defeat
        coin_balance: Number(prev?.coin_balance || 0) + coinsToAdd
      };
    });

    notify(`Task Completed! +${totalXpGain} XP, +${totalStatGain} ${CATEGORIES[targetTask.category]?.statLabel} | Pressure -${pressureRelief}`, 'success');
  }, [tasks, profile?.reincarnation_meter, profile?.coin_balance, isDemoMode, sessionUser, refreshGameData, notify, claimedBossesThisCycle]);

  // Expire / Fail Task (When task is not completed / 24h expires)
  // Reincarnation Bar increased by: Easy (+8), Medium (+9), Hard (+10)
  // Category Stat penalized by: Easy (-3), Medium (-2), Hard (-1)
  const failTask = useCallback(async (taskId) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask || targetTask.is_completed) return;

    const diffConfig = DIFFICULTY_CONFIG[targetTask.difficulty] || DIFFICULTY_CONFIG.Easy;
    const statKey = CATEGORIES[targetTask.category]?.stat || 'intellect';
    const statPenalty = diffConfig.penalty; // Easy: 3, Medium: 2, Hard: 1
    const pressureIncrease = diffConfig.pressureFail; // Easy: 8, Medium: 9, Hard: 10

    const currentMeter = Number(profile?.reincarnation_meter || 0);
    const targetMeter = Math.min(100, currentMeter + pressureIncrease);

    // Remove task from active list
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    // Deduct category stat with floor of 0
    setStats((prev) => ({
      ...prev,
      [statKey]: Math.max(0, (prev[statKey] || 10) - statPenalty)
    }));

    // Increase Reincarnation Bar strictly by +8, +9, or +10
    setProfile((prev) => ({
      ...prev,
      reincarnation_meter: targetMeter
    }));

    if (isSupabaseConfigured && !isDemoMode && sessionUser) {
      try {
        await supabase.from('tasks').delete().eq('id', taskId);
        await supabase.from('stats').update({ [statKey]: Math.max(0, (stats[statKey] || 10) - statPenalty) }).eq('user_id', sessionUser.id);
        await supabase.from('profiles').update({ reincarnation_meter: targetMeter }).eq('id', sessionUser.id);
      } catch (err) {
        console.error('Failed to sync failed task to database:', err);
      }
    }

    notify(`Task Uncompleted / Expired! -${statPenalty} ${CATEGORIES[targetTask.category]?.statLabel} | Pressure +${pressureIncrease}`, 'danger');
  }, [tasks, stats, profile?.reincarnation_meter, isSupabaseConfigured, isDemoMode, sessionUser, notify]);

  const deleteTask = useCallback(async (taskId) => {
    if (isSupabaseConfigured && !isDemoMode && sessionUser) {
      try {
        await supabase.from('tasks').delete().eq('id', taskId);
      } catch (err) {
        console.error('Delete task error:', err);
      }
    }
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    notify('Task dismissed from quest journal', 'info');
  }, [isDemoMode, sessionUser, notify]);

  // =====================================================================
  // ACTIONS: HABIT FORGE & STREAKS (SOLE SOURCE OF COINS)
  // =====================================================================
  const fetchHabits = useCallback(async () => {
    if (!isSupabaseConfigured || isDemoMode || !sessionUser) return;
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', sessionUser.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setHabits(data);
      }
    } catch (err) {
      console.error('fetchHabits error:', err);
    }
  }, [isDemoMode, sessionUser]);

  const createHabit = useCallback(async (titleOrObj, maybeCategory) => {
    const title = typeof titleOrObj === 'object' && titleOrObj !== null ? titleOrObj?.title : titleOrObj;
    const category = typeof titleOrObj === 'object' && titleOrObj !== null ? titleOrObj?.category : maybeCategory;

    if (!title?.trim()) {
      notify('Please enter a habit title', 'warning');
      return false;
    }

    const habitCategory = category || 'Lifestyle';

    const newHabit = {
      id: `habit-${Date.now()}`,
      user_id: sessionUser?.id || 'demo-hero-id',
      title: title.trim(),
      category: habitCategory,
      current_streak: 0,
      longest_streak: 0,
      last_completed_at: null,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && !isDemoMode && sessionUser) {
      try {
        const { data, error } = await supabase
          .from('habits')
          .insert([{
            user_id: sessionUser.id,
            title: title.trim(),
            category: habitCategory,
            current_streak: 0,
            longest_streak: 0,
            last_completed_at: null
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) newHabit.id = data.id;
      } catch (err) {
        console.error('Habit insertion error:', err);
        notify('Failed to save habit', 'danger');
        return false;
      }
    }

    setHabits((prev) => [newHabit, ...prev]);
    notify(`Habit forged: "${title}" (${habitCategory})`, 'success');
    return true;
  }, [isDemoMode, sessionUser, notify]);

  const deleteHabit = useCallback(async (habitId) => {
    if (isSupabaseConfigured && !isDemoMode && sessionUser) {
      try {
        await supabase.from('habits').delete().eq('id', habitId);
      } catch (err) {
        console.error('Delete habit error:', err);
      }
    }
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    notify('Habit banished from discipline ledger', 'info');
  }, [isDemoMode, sessionUser, notify]);

  const completeHabit = useCallback(async (habitId) => {
    const targetHabit = habits.find((h) => h.id === habitId);
    if (!targetHabit) return { success: false, error: 'Habit not found' };

    // Check if already completed today (since most recent midnight IST boundary)
    const midnightIST = getMostRecentMidnightIST();
    if (targetHabit.last_completed_at) {
      const lastDate = new Date(targetHabit.last_completed_at);
      if (lastDate >= midnightIST) {
        notify('This habit is already sealed for today! Return tomorrow.', 'info', '⏳');
        return { success: false, reason: 'already_completed' };
      }
    }

    sound.playCoin();

    // Call Supabase RPC if connected
    if (isSupabaseConfigured && !isDemoMode && sessionUser) {
      try {
        const { data, error } = await supabase.rpc('complete_habit', { p_habit_id: habitId });
        if (error) {
          // Handle "already completed today" rejection as an expected state (surface as a toast), not an error state
          if (error.message && error.message.toLowerCase().includes('already completed today')) {
            notify('This habit is already sealed for today! Return tomorrow.', 'info', '⏳');
            return { success: false, reason: 'already_completed' };
          }
          console.error('complete_habit RPC error:', error);
          notify(error.message || 'Error checking in habit', 'danger');
          return { success: false, error };
        }
        if (data) {
          // coin_balance in client state must be set from what the RPC / server returns, never incremented locally
          const { data: profileData } = await supabase
            .from('profiles')
            .select('coin_balance, current_level, current_xp')
            .eq('id', sessionUser.id)
            .single();

          if (profileData) {
            setProfile((prev) => ({
              ...prev,
              coin_balance: profileData.coin_balance
            }));
          }

          // Refresh habits state from database
          await fetchHabits();

          notify(`Streak ${data.current_streak} Days! Earned +${data.coins_awarded} Gold Coins!`, 'gold');
          return data;
        }
      } catch (err) {
        console.error('Habit completion error:', err);
      }
    }

    // Local / Demo Calculation
    const newStreak = (targetHabit.current_streak || 0) + 1;
    const coinsAwarded = Math.min(newStreak, MAX_HABIT_DAILY_COINS);
    const newLongest = Math.max(targetHabit.longest_streak || 0, newStreak);

    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? { ...h, current_streak: newStreak, longest_streak: newLongest, last_completed_at: now.toISOString() }
          : h
      )
    );

    setProfile((prev) => ({
      ...prev,
      coin_balance: (prev.coin_balance || 0) + coinsAwarded,
      reincarnation_meter: Math.max(0, (prev.reincarnation_meter || 0) - HABIT_PRESSURE_RELIEF)
    }));

    notify(`Streak increased to ${newStreak}! +${coinsAwarded} Gold Coins | Pressure -${HABIT_PRESSURE_RELIEF}`, 'gold');
    return {
      success: true,
      coins_awarded: coinsAwarded,
      current_streak: newStreak,
      longest_streak: newLongest
    };
  }, [habits, isDemoMode, sessionUser, fetchHabits, notify]);

  // Backward compatibility alias
  const checkInHabit = completeHabit;

  // Habit Streak-Break Action (Adds +10 Pressure, linear coin deduction)
  // remaining_coins = original_coins * (1 - 0.10 * brokenCount)
  const handleHabitStreakBreak = useCallback(async (habitId, brokenCount = 1) => {
    // 1. Reset streak for target habit
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, current_streak: 0 } : h))
    );

    // 2. Linear coin reduction
    const retentionRate = calculateStreakBreakCoinRetention(brokenCount);
    let lostCoins = 0;

    setProfile((prev) => {
      const originalCoins = prev.coin_balance || 0;
      const remainingCoins = Math.round(originalCoins * retentionRate);
      lostCoins = originalCoins - remainingCoins;
      const newMeter = Math.min(100, (prev.reincarnation_meter || 0) + HABIT_STREAK_BREAK_PRESSURE);
      return {
        ...prev,
        coin_balance: remainingCoins,
        reincarnation_meter: newMeter
      };
    });

    if (isSupabaseConfigured && !isDemoMode && sessionUser) {
      try {
        await supabase.rpc('stub_handle_habit_streak_break', { p_habit_id: habitId });
      } catch (err) {
        console.warn('Could not call stub_handle_habit_streak_break:', err);
      }
    }

    notify(`Streak severed! Lost ${lostCoins} Coins (${Math.round((1 - retentionRate) * 100)}%) | Pressure +${HABIT_STREAK_BREAK_PRESSURE}`, 'danger');
  }, [isSupabaseConfigured, isDemoMode, sessionUser, notify]);


  // =====================================================================
  // ACTIONS: REINCARNATION CRISIS TRADEOFF RESOLUTION
  // =====================================================================
  const resolveTradeoff = useCallback(async (choice) => {
    // choice: 'stats' or 'coins'
    if (isSupabaseConfigured && !isDemoMode && sessionUser) {
      try {
        const { data, error } = await supabase.rpc('resolve_reincarnation_tradeoff', { p_choice: choice });
        if (error) throw error;
        if (data) {
          refreshGameData(sessionUser.id);
          setIsTradeoffModalOpen(false);
          notify('Reincarnation crisis resolved. Pressure reset to 0.', 'info');
          return;
        }
      } catch (err) {
        console.error('resolve_reincarnation_tradeoff error:', err);
      }
    }

    // Local / Demo Resolution
    if (choice === 'stats') {
      setStats((prev) => ({
        intellect: Math.round(prev.intellect * (1 - REINCARNATION_STAT_SACRIFICE_PERCENT)),
        strength: Math.round(prev.strength * (1 - REINCARNATION_STAT_SACRIFICE_PERCENT)),
        discipline: Math.round(prev.discipline * (1 - REINCARNATION_STAT_SACRIFICE_PERCENT)),
        willpower: Math.round(prev.willpower * (1 - REINCARNATION_STAT_SACRIFICE_PERCENT))
      }));
      notify('Sacrificed 25% of all Stats to reset the Reincarnation pressure.', 'warning');
    } else {
      setProfile((prev) => ({
        ...prev,
        coin_balance: Math.round(prev.coin_balance * (1 - REINCARNATION_COIN_SACRIFICE_PERCENT))
      }));
      notify('Sacrificed 50% of Coin pouch to satisfy the Reincarnation debt.', 'warning');
    }

    setProfile((prev) => ({ ...prev, reincarnation_meter: 0 }));
    setIsTradeoffModalOpen(false);
  }, [isDemoMode, sessionUser, refreshGameData, notify]);

  // =====================================================================
  // ACTIONS: REINCARNATION TESTING HELPER
  // =====================================================================
  const adjustReincarnationPressure = useCallback(async (amount) => {
    const current = Number(profile?.reincarnation_meter || 0);
    const newMeter = Math.min(100, Math.max(0, current + amount));
    setProfile((prev) => ({ ...prev, reincarnation_meter: newMeter }));

    if (isSupabaseConfigured && !isDemoMode && sessionUser) {
      try {
        await supabase.from('profiles').update({ reincarnation_meter: newMeter }).eq('id', sessionUser.id);
      } catch (err) {
        console.warn('Could not sync demo reincarnation_meter change to database:', err);
      }
    }

    if (newMeter >= 100) {
      setIsTradeoffModalOpen(true);
      notify('Reincarnation Pressure reached 100%! Crisis initiated!', 'danger');
    } else if (amount > 0) {
      notify(`Simulated missed task: +${amount}% Pressure (Current: ${newMeter}%)`, 'warning');
    } else if (amount < 0 && newMeter === 0) {
      notify('Reincarnation Pressure reset to 0%', 'info');
    } else {
      notify(`Reincarnation pressure set to ${newMeter}%`, 'info');
    }
  }, [profile?.reincarnation_meter, isSupabaseConfigured, isDemoMode, sessionUser, setIsTradeoffModalOpen, notify]);

  // =====================================================================
  // ACTIONS: COSMETICS SHOP & INVENTORY (Strict Single-Border Exclusivity)
  // =====================================================================
  const buyShopItem = useCallback(async (item) => {
    if (profile.coin_balance < item.cost) {
      notify(`Insufficient coins! You need ${item.cost} coins but have ${profile.coin_balance}. Complete daily habits to earn more!`, 'warning');
      return false;
    }

    // Check if already owned
    const alreadyOwned = userInventory.some((inv) => inv.item_id === item.id);
    if (alreadyOwned) {
      notify(`You already own "${item.name}"! Click "Equip Border" to adorn your row.`, 'info');
      return false;
    }

    sound.playCoin();

    // 1. Immediately update local inventory & coin balance for instantaneous UI feedback
    const newInvItem = { item_id: item.id, is_equipped: false };
    const nextInv = [...userInventory.filter(i => i.item_id !== item.id), newInvItem];
    setUserInventory(nextInv);
    saveStoredInventory(nextInv);
    setProfile((prev) => ({ ...prev, coin_balance: Math.max(0, prev.coin_balance - item.cost) }));

    notify(`Purchased "${item.name}"! Click "Equip Border" to adorn your leaderboard row.`, 'gold');

    // 2. Synchronize to Supabase if connected
    if (isSupabaseConfigured && !isDemoMode && sessionUser) {
      try {
        const { error: rpcErr } = await supabase.rpc('buy_shop_item', { p_item_id: item.id });
        if (rpcErr) {
          // Direct table fallback
          await supabase
            .from('user_inventory')
            .upsert([{ user_id: sessionUser.id, item_id: item.id, is_equipped: false }], { onConflict: 'user_id,item_id' });
          await supabase
            .from('profiles')
            .update({ coin_balance: Math.max(0, profile.coin_balance - item.cost) })
            .eq('id', sessionUser.id);
        }
      } catch (err) {
        console.warn('Background Supabase purchase sync skipped or pending migration:', err);
      }
    }

    return true;
  }, [profile.coin_balance, userInventory, isDemoMode, sessionUser, notify]);

  const toggleEquipItem = useCallback(async (itemId) => {
    const targetItem = shopItems.find((i) => i.id === itemId);
    if (!targetItem) return;

    // Determine target equipped state (toggle)
    const isCurrentlyEquipped = userInventory.find((inv) => inv.item_id === itemId)?.is_equipped;
    const willBeEquipped = !isCurrentlyEquipped;

    // Strict Mutual Exclusivity: ONLY ONE BORDER EQUIPPED AT ANY TIME
    const nextInventory = userInventory.map((inv) => {
      if (inv.item_id === itemId) {
        return { ...inv, is_equipped: willBeEquipped };
      }
      // Unequip all other border items
      return willBeEquipped ? { ...inv, is_equipped: false } : inv;
    });

    // 1. Immediately update state and storage
    setUserInventory(nextInventory);
    saveStoredInventory(nextInventory);
    setProfile((p) => ({
      ...p,
      equipped_leaderboard_effect: willBeEquipped ? itemId : null
    }));

    notify(
      willBeEquipped 
        ? `Equipped "${targetItem.name}" to your leaderboard row!` 
        : `Unequipped "${targetItem.name}".`,
      'info');

    // 2. Synchronize with Supabase in background
    if (isSupabaseConfigured && !isDemoMode && sessionUser) {
      try {
        const { error: rpcErr } = await supabase.rpc('toggle_equip_item', { p_item_id: itemId });
        if (rpcErr) {
          // Direct table fallback
          await supabase.from('user_inventory').update({ is_equipped: false }).eq('user_id', sessionUser.id);
          if (willBeEquipped) {
            await supabase.from('user_inventory').update({ is_equipped: true }).eq('user_id', sessionUser.id).eq('item_id', itemId);
          }
          await supabase.from('profiles').update({ equipped_leaderboard_effect: willBeEquipped ? itemId : null }).eq('id', sessionUser.id);
        }
      } catch (err) {
        console.warn('Background Supabase equip sync skipped or pending migration:', err);
      }
    }
  }, [shopItems, userInventory, isDemoMode, sessionUser, notify]);

  // Profile Customization Action (Player Name & Avatar)
  const updateProfile = useCallback(async ({ display_name, avatar_url }) => {
    const trimmedName = display_name?.trim();
    if (!trimmedName) {
      notify('Please enter a valid champion moniker', 'warning', '⚠️');
      return { success: false, error: 'Empty name' };
    }

    setProfile((prev) => {
      const nextProfile = {
        ...prev,
        display_name: trimmedName,
        ...(avatar_url ? { avatar_url } : {})
      };

      saveStoredCustomProfile({
        display_name: nextProfile.display_name,
        avatar_url: nextProfile.avatar_url
      });

      return nextProfile;
    });

    if (isSupabaseConfigured && !isDemoMode && sessionUser?.id) {
      try {
        const updates = { display_name: trimmedName };
        if (avatar_url) updates.avatar_url = avatar_url;
        await supabase.from('profiles').update(updates).eq('id', sessionUser.id);
      } catch (err) {
        console.warn('Failed to update profile in Supabase:', err);
      }
    }

    sound.playLevelUp?.();
    notify(`Champion profile updated: ${trimmedName}!`, 'success', '✨');
    return { success: true };
  }, [isSupabaseConfigured, isDemoMode, sessionUser, notify]);

  // Sign Out Handler
  const signOut = useCallback(async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Error during Supabase sign out:', err);
    } finally {
      setSessionUser(null);
      setIsDemoMode(true);
      const custom = getStoredCustomProfile();
      setProfile({ ...DEMO_PROFILE, ...custom });
      setStats(DEMO_STATS);
      setTasks(DEMO_TASKS);
      setHabits(DEMO_HABITS);
      notify('You have departed the tavern. Returned to guest mode.', 'info');
    }
  }, [notify]);

  // Derived Values
  const powerScore = calculatePowerScore(stats);
  const xpNeeded = calculateXpToNextLevel(profile.current_level);
  const equippedLeaderboardEffect = 
    userInventory.find((inv) => inv.is_equipped)?.item_id ||
    profile?.equipped_leaderboard_effect ||
    null;

  return {
    // Session & Connection
    sessionUser,
    isDemoMode,
    isLoading,
    setIsDemoMode,

    // Entities
    profile,
    stats,
    tasks,
    habits,
    shopItems,
    userInventory,
    powerScore,
    xpNeeded,
    // Leaderboard & Cycle Info
    leaderboard,
    equippedLeaderboardEffect,
    claimedBossesThisCycle,
    currentCycleId: getCurrentLeaderboardCycleId(),
    equippedTitle: 'Guild Champion',
    equippedFrame: null,

    // Actions
    signOut,
    createTask,
    completeTask,
    failTask,
    deleteTask,
    fetchHabits,
    createHabit,
    deleteHabit,
    completeHabit,
    checkInHabit,
    handleHabitStreakBreak,
    resolveTradeoff,
    adjustReincarnationPressure,
    buyShopItem,
    toggleEquipItem,
    fetchLeaderboard,
    refreshGameData,

    // Profile Customization
    updateProfile,

    // UI Modals & Notifications
    isAuthModalOpen,
    setIsAuthModalOpen,
    isCreateTaskModalOpen,
    setIsCreateTaskModalOpen,
    isShopModalOpen,
    setIsShopModalOpen,
    isLeaderboardModalOpen,
    setIsLeaderboardModalOpen,
    isTradeoffModalOpen,
    setIsTradeoffModalOpen,
    toasts,
    notify
  };
}
