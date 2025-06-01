import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types/recipe';

export type Day =
  | 'Pazartesi'
  | 'Salı'
  | 'Çarşamba'
  | 'Perşembe'
  | 'Cuma'
  | 'Cumartesi'
  | 'Pazar';

export type Meal = 'kahvaltı' | 'öğle' | 'akşam' | 'tatlı';

type DailyPlan = {
  kahvaltı: Recipe | null;
  öğle: Recipe | null;
  akşam: Recipe | null;
  tatlı: Recipe | null;
};

type PlanType = Record<Day, DailyPlan>;

type StreakState = {
  active: boolean;
  count: number;
  lastUpdateDate: string;
};

type PlanContextType = {
  plan: PlanType;
  addToPlan: (day: Day, meal: Meal, recipe: Recipe) => void;
  isInPlan: (id: string) => boolean;
  clearPlan: () => void;
  userRecipes: Recipe[];
  addUserRecipe: (recipe: Recipe) => void;
  streak: StreakState;
  activateStreak: () => void;
  resetStreak: () => void;
  incrementStreakIfValid: (recipe: Recipe) => void;
};

const defaultDayPlan: DailyPlan = {
  kahvaltı: null,
  öğle: null,
  akşam: null,
  tatlı: null,
};

const initialPlan: PlanType = {
  Pazartesi: { ...defaultDayPlan },
  Salı: { ...defaultDayPlan },
  Çarşamba: { ...defaultDayPlan },
  Perşembe: { ...defaultDayPlan },
  Cuma: { ...defaultDayPlan },
  Cumartesi: { ...defaultDayPlan },
  Pazar: { ...defaultDayPlan },
};

const PLAN_KEY = '@plan';
const USER_RECIPES_KEY = '@userRecipes';
const STREAK_KEY = '@healthyStreak';

const defaultStreak: StreakState = {
  active: false,
  count: 0,
  lastUpdateDate: '',
};

const getTodayDate = () => new Date().toISOString().split('T')[0];

const getTodayDayName = (): Day => {
  const days: Day[] = [
    'Pazar',
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi',
  ];
  return days[new Date().getDay()];
};

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<PlanType>(initialPlan);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [streak, setStreak] = useState<StreakState>(defaultStreak);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const savedPlan = await AsyncStorage.getItem(PLAN_KEY);
      const savedRecipes = await AsyncStorage.getItem(USER_RECIPES_KEY);
      const savedStreak = await AsyncStorage.getItem(STREAK_KEY);

      if (savedPlan) setPlan(JSON.parse(savedPlan));
      if (savedRecipes) setUserRecipes(JSON.parse(savedRecipes));
      if (savedStreak) {
        setStreak(JSON.parse(savedStreak));
      } else {
        setStreak(defaultStreak);
      }

      setLoaded(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(PLAN_KEY, JSON.stringify(plan));
    }
  }, [plan, loaded]);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(USER_RECIPES_KEY, JSON.stringify(userRecipes));
    }
  }, [userRecipes, loaded]);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    }
  }, [streak, loaded]);

  useEffect(() => {
    if (loaded) evaluateTodayStreak();
  }, [plan]);

  const addToPlan = (day: Day, meal: Meal, recipe: Recipe) => {
    setPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: recipe,
      },
    }));

    incrementStreakIfValid(recipe);
  };

  const isInPlan = (id: string) =>
    Object.values(plan).some((dayPlan) =>
      Object.values(dayPlan).some((r) => r?.id === id)
    );

  const clearPlan = () => setPlan(initialPlan);

  const addUserRecipe = (recipe: Recipe) => {
    setUserRecipes((prev) => [...prev, recipe]);
  };

  const activateStreak = () => {
    setStreak({
      active: true,
      count: 0,
      lastUpdateDate: '',
    });
  };

  const resetStreak = () => {
    setStreak({
      ...streak,
      count: 0,
      lastUpdateDate: getTodayDate(),
    });
  };

  const incrementStreakIfValid = (recipe: Recipe) => {
    if (!streak.active || !recipe.tags?.includes('sağlıklı')) return;

    const today = getTodayDate();
    if (streak.lastUpdateDate === today) {
      if (streak.count === 0) {
        setStreak({
          active: true,
          count: 1,
          lastUpdateDate: today,
        });
      }
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yDate = yesterday.toISOString().split('T')[0];

    if (streak.lastUpdateDate === yDate || streak.lastUpdateDate === '') {
      setStreak({
        active: true,
        count: streak.count + 1,
        lastUpdateDate: today,
      });
    } else {
      resetStreak();
    }
  };

  const evaluateTodayStreak = () => {
  if (!streak.active) return;

  const today = getTodayDate();
  const dayName = getTodayDayName();
  const todayPlan = plan[dayName];

  // HATA KONTROLÜ: Plan verisi yoksa işlemi iptal et
  if (!todayPlan) return;

  const allHealthy = Object.values(todayPlan).every(
    (r) => r && r.tags?.includes('sağlıklı')
  );

  if (!allHealthy || streak.lastUpdateDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yDate = yesterday.toISOString().split('T')[0];

  setStreak({
    active: true,
    count:
      streak.lastUpdateDate === yDate || streak.lastUpdateDate === ''
        ? streak.count + 1
        : 1,
    lastUpdateDate: today,
  });
};


  return (
    <PlanContext.Provider
      value={{
        plan,
        addToPlan,
        isInPlan,
        clearPlan,
        userRecipes,
        addUserRecipe,
        streak,
        activateStreak,
        resetStreak,
        incrementStreakIfValid,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = (): PlanContextType => {
  const context = useContext(PlanContext);
  if (!context) throw new Error('usePlan must be used within a PlanProvider');
  return context;
};