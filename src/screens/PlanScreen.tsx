import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { usePlan, Day } from '../context/PlanContext';
import { SafeAreaView } from 'react-native-safe-area-context';


const days: Day[] = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];

const PlanScreen = () => {
  const { plan } = usePlan();

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🗓️ Haftalık Yemek Planı</Text>
      {days.map((day) => (
        <View key={day} style={styles.card}>
          <Text style={styles.day}>{day}</Text>
          {plan[day] ? (
            <>
              <Text style={styles.recipe}>{plan[day]!.name}</Text>
              <Text style={styles.cuisine}>Mutfak: {plan[day]!.cuisine}</Text>
            </>
          ) : (
            <Text style={styles.empty}>— Tarif yok</Text>
          )}
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
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  day: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  recipe: {
    fontSize: 16,
  },
  cuisine: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  empty: {
    color: '#999',
    fontStyle: 'italic',
  },
});
