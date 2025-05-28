import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { usePlan, Day, Meal } from '../context/PlanContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/MainNavigator';

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>🗓️ Haftalık Yemek Planı</Text>
        {days.map((day) => (
          <View key={day} style={styles.card}>
            <Text style={styles.day}>{day}</Text>
            {Object.keys(mealLabels).map((meal) => {
              const mealKey = meal as Meal;
              const recipe = plan[day]?.[mealKey];
              return (
                <View key={mealKey} style={styles.mealBlock}>
                  <Text style={styles.mealLabel}>{mealLabels[mealKey]}</Text>
                  {recipe ? (
                    <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { recipe })}>
                      <Text style={styles.recipe}>{recipe.name}</Text>
                      <Text style={styles.cuisine}>Mutfak: {recipe.cuisine}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.empty}>— Tarif yok</Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
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
