import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/MainNavigator';
import { usePlan, Day } from '../context/PlanContext';
import { Picker } from '@react-native-picker/picker'; // yüklenmediyse: npm install @react-native-picker/picker

const RecipeDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'RecipeDetail'>>();
  const { recipe } = route.params;
  const { addToPlan, plan } = usePlan();

  const days: Day[] = [
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi',
    'Pazar',
  ];

  const [selectedDay, setSelectedDay] = useState<Day>('Pazartesi');
  const alreadyInPlan = plan[selectedDay]?.id === recipe.id;


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.name}</Text>

      <Text style={styles.sub}>Mutfak:</Text>
      <Text>{recipe.cuisine}</Text>

      <Text style={styles.sub}>Malzemeler:</Text>
      {recipe.ingredients.map((ing, idx) => (
        <Text key={idx}>• {ing}</Text>
      ))}

      <Text style={styles.sub}>Yapılışı:</Text>
      <Text>{recipe.instructions}</Text>

      <Text style={styles.sub}>Gün Seç:</Text>
      <Picker
        selectedValue={selectedDay}
        onValueChange={(value) => setSelectedDay(value as Day)}
        style={styles.picker}
      >
        {days.map((day) => (
          <Picker.Item key={day} label={day} value={day} />
        ))}
      </Picker>

      <Button
        title={alreadyInPlan ? 'Zaten Eklendi' : `${selectedDay} Gününe Ekle`}
        onPress={() => addToPlan(selectedDay, recipe)}
        disabled={alreadyInPlan}
      />
    </ScrollView>
  );
};

export default RecipeDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sub: {
    marginTop: 12,
    fontWeight: 'bold',
  },
  picker: {
    marginVertical: 12,
  },
});
