import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/MainNavigator';
import { Button } from 'react-native-paper';


const categories = [
  { title: 'Kahvaltı', value: 'kahvaltı', icon: '🍳' },
  { title: 'Öğle Yemeği', value: 'öğle yemeği', icon: '🥗' },
  { title: 'Akşam Yemeği', value: 'akşam yemeği', icon: '🍽' },
  { title: 'Tatlı', value: 'tatlı', icon: '🍰' },
];

const RecipesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧾 Kategoriler</Text>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.value}
          style={styles.categoryCard}
          onPress={() => navigation.navigate('FilteredRecipes', { category: cat.value })}
        >
          <Text style={styles.icon}>{cat.icon}</Text>
          <Text style={styles.categoryText}>{cat.title}</Text>
        </TouchableOpacity>
      ))}
      <Button
  mode="contained"
  onPress={() => navigation.navigate('AddRecipe')}
  style={{ marginTop: 16 }}
>
  ➕ Yeni Tarif Ekle
</Button>

    </View>
    
  );
};

export default RecipesScreen;

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
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

