import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { usePlan, Day, Meal } from '../context/PlanContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/MainNavigator';
import MealBlock from '../components/MealBlock';
import { Recipe } from '../types/recipe';

const days: Day[] = [
  'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar',
];

const mealLabels: Record<Meal, string> = {
  kahvaltı: '🍳 Kahvaltı',
  öğle: '🥗 Öğle Yemeği',
  akşam: '🍽 Akşam Yemeği',
  tatlı: '🍰 Tatlı',
};

const PlanScreen = () => {
  const { plan } = usePlan();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 👇 useCallback ile sabit fonksiyon tanımı
const handleNavigate = useCallback((recipe: Recipe) => {
  navigation.navigate('RecipeDetail', { recipe });
}, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🗓️ Haftalık Yemek Planı</Text>
      {days.map((day) => (
        <View key={day} style={styles.card}>
          <Text style={styles.day}>{day}</Text>
          {Object.keys(mealLabels).map((meal) => {
            const mealKey = meal as Meal;
            const recipe = plan[day]?.[mealKey];

            return (
            <MealBlock
  key={mealKey}
  meal={mealKey}
  recipe={recipe}
  onPress={recipe ? () => handleNavigate(recipe) : undefined}
/>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

export default PlanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
