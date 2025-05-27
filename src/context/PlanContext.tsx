import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

type PlanType = Record<Day, Recipe | null>;

type PlanContextType = {
  plan: PlanType;
  addToPlan: (day: Day, recipe: Recipe) => void;
  isInPlan: (id: number) => boolean;
  clearPlan: () => void;
  userRecipes: Recipe[];
  addUserRecipe: (recipe: Recipe) => void;
};

const initialPlan: PlanType = {
  Pazartesi: null,
  Salı: null,
  Çarşamba: null,
  Perşembe: null,
  Cuma: null,
  Cumartesi: null,
  Pazar: null,
};

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const PLAN_KEY = '@plan';
const USER_RECIPES_KEY = '@userRecipes';

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<PlanType>(initialPlan);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  // 📥 Verileri ilk açılışta yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedPlan = await AsyncStorage.getItem(PLAN_KEY);
        const savedRecipes = await AsyncStorage.getItem(USER_RECIPES_KEY);

        if (savedPlan) {
          setPlan(JSON.parse(savedPlan));
        }
        if (savedRecipes) {
          setUserRecipes(JSON.parse(savedRecipes));
        }
      } catch (error) {
        console.log('Veri yükleme hatası:', error);
      }
    };

    loadData();
  }, []);

  // 💾 Plan değişince kaydet
  useEffect(() => {
    AsyncStorage.setItem(PLAN_KEY, JSON.stringify(plan)).catch((err) =>
      console.log('Plan kaydetme hatası:', err)
    );
  }, [plan]);

  // 💾 Tarif değişince kaydet
  useEffect(() => {
    AsyncStorage.setItem(USER_RECIPES_KEY, JSON.stringify(userRecipes)).catch((err) =>
      console.log('Tarif kaydetme hatası:', err)
    );
  }, [userRecipes]);

  const addToPlan = (day: Day, recipe: Recipe) => {
    setPlan((prev) => ({
      ...prev,
      [day]: recipe,
    }));
  };

  const isInPlan = (id: number) => {
    return Object.values(plan).some((r) => r?.id === id);
  };

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
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
