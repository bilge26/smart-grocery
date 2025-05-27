import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePlan } from '../context/PlanContext';

const getTodayDayName = (): keyof ReturnType<typeof usePlan>['plan'] => {
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const todayIndex = new Date().getDay();
  return days[todayIndex] as keyof ReturnType<typeof usePlan>['plan'];
};

const HomeScreen = () => {
  const { plan } = usePlan();
  const today = getTodayDayName();
  const todayRecipe = plan[today];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📅 Bugünün Planı</Text>
      <View style={styles.card}>
        {todayRecipe ? (
          <>
            <Text style={styles.recipeTitle}>{todayRecipe.name}</Text>
            <Text style={styles.recipeDetail}>Mutfak: {todayRecipe.cuisine}</Text>
          </>
        ) : (
          <Text style={styles.empty}>Henüz bir tarif seçilmedi.</Text>
        )}
      </View>
    </View>
  );
};


export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    elevation: 3,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recipeDetail: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  empty: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
