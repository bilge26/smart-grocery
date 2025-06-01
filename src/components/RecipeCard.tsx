import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Recipe } from '../types/recipe';

type Props = {
  recipe: Recipe;
  onPress: () => void;
};

const RecipeCard = ({ recipe, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{recipe.name}</Text>
      <Text style={styles.cuisine}>{recipe.cuisine}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(RecipeCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  cuisine: {
    fontSize: 14,
    color: '#777',
  },
});
