import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import { usePlan, Meal } from '../context/PlanContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/MainNavigator';

const getTodayDayName = (): keyof ReturnType<typeof usePlan>['plan'] => {
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const todayIndex = new Date().getDay();
  return days[todayIndex] as keyof ReturnType<typeof usePlan>['plan'];
};

const mealLabels: Record<Meal, string> = {
  kahvaltı: '🍳 Kahvaltı',
  öğle: '🥗 Öğle Yemeği',
  akşam: '🍽 Akşam Yemeği',
  tatlı: '🍰 Tatlı',
};

const HomeScreen = () => {
  const { plan, streak, activateStreak } = usePlan();
  const today = getTodayDayName();
  const todayPlan = plan[today];



  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📅 Bugünün Planı</Text>

      {/* Streak Başlatma veya Gösterme */}
      {!streak.active ? (
        <View style={styles.streakBox}>
          <Text style={styles.streakText}>
            Sağlıklı beslenme streak’i başlatmak ister misiniz?
          </Text>
          <Button title="Streak’i Başlat" onPress={activateStreak} />
        </View>
      ) : (
        <View style={styles.streakActive}>
          <Text style={styles.streakFire}>🔥 {streak.count} gündür sağlıklı besleniyorsunuz!</Text>
        </View>
      )}

      <View style={styles.card}>
        {Object.keys(mealLabels).map((meal) => {
          const mealKey = meal as Meal;
          const recipe = todayPlan?.[mealKey];

          return (
            <View key={mealKey} style={styles.mealBlock}>
              <Text style={styles.mealLabel}>{mealLabels[mealKey]}</Text>
              {recipe ? (
                <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail', { recipe })}>
                  <Text style={styles.recipeTitle}>{recipe.name}</Text>
                  <Text style={styles.recipeDetail}>Mutfak: {recipe.cuisine}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.empty}>— Tarif yok</Text>
              )}
            </View>
          );
        })}
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
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  streakBox: {
    marginBottom: 24,
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#BF360C',
    fontWeight: '500',
  },
  streakActive: {
    marginBottom: 24,
    backgroundColor: '#E0F2F1',
    padding: 16,
    borderRadius: 12,
  },
  streakFire: {
    fontSize: 18,
    color: '#00796B',
    fontWeight: 'bold',
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
  mealBlock: {
    marginBottom: 16,
  },
  mealLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  recipeDetail: {
    marginTop: 4,
    fontSize: 15,
    color: '#555',
  },
  empty: {
    fontSize: 15,
    color: '#aaa',
    fontStyle: 'italic',
    marginLeft: 6,
  },
});