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

type PlanContextType = {
  plan: PlanType;
  addToPlan: (day: Day, meal: Meal, recipe: Recipe) => void;
  isInPlan: (id: string) => boolean;
  clearPlan: () => void;
  userRecipes: Recipe[];
  addUserRecipe: (recipe: Recipe) => void;
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

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<PlanType>(initialPlan);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const savedPlan = await AsyncStorage.getItem(PLAN_KEY);
      const savedRecipes = await AsyncStorage.getItem(USER_RECIPES_KEY);
      if (savedPlan) setPlan(JSON.parse(savedPlan));
      if (savedRecipes) setUserRecipes(JSON.parse(savedRecipes));
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    AsyncStorage.setItem(USER_RECIPES_KEY, JSON.stringify(userRecipes));
  }, [userRecipes]);

  const addToPlan = (day: Day, meal: Meal, recipe: Recipe) => {
    setPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: recipe,
      },
    }));
  };

  const isInPlan = (id: string) =>
    Object.values(plan).some((dayPlan) =>
      Object.values(dayPlan).some((r) => r?.id === id)
    );

  const clearPlan = () => setPlan(initialPlan);

  const addUserRecipe = (recipe: Recipe) => {
    setUserRecipes((prev) => [...prev, recipe]);
  };

  return (
    <PlanContext.Provider
      value={{ plan, addToPlan, isInPlan, clearPlan, userRecipes, addUserRecipe }}
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
