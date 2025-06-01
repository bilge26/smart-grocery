// src/components/MealBlock.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Recipe } from '../types/recipe';
import { Meal } from '../context/PlanContext';

type Props = {
  meal: Meal;
  recipe: Recipe | null;
  onPress?: () => void;
};

const mealLabels: Record<Meal, string> = {
  kahvaltı: '🍳 Kahvaltı',
  öğle: '🥗 Öğle Yemeği',
  akşam: '🍽 Akşam Yemeği',
  tatlı: '🍰 Tatlı',
};

const MealBlock = ({ meal, recipe, onPress }: Props) => {
  return (
    <View style={styles.mealBlock}>
      <Text style={styles.mealLabel}>{mealLabels[meal]}</Text>
      {recipe ? (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.recipe}>{recipe.name}</Text>
          <Text style={styles.cuisine}>Mutfak: {recipe.cuisine}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.empty}>— Tarif yok</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mealBlock: {
    marginBottom: 12,
  },
  mealLabel: {
    fontWeight: '600',
    marginBottom: 2,
  },
  recipe: {
    fontSize: 16,
    color: '#212121',
  },
  cuisine: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  empty: {
    color: '#aaa',
    fontStyle: 'italic',
  },
});

// 🔥 performans optimizasyonu burada!
export default React.memo(MealBlock);
