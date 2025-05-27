import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Recipe } from '../types/recipe';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/MainNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ Firestore importları
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const RecipesScreen = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

useFocusEffect(
  useCallback(() => {
    const fetchRecipes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'recipes'));
        const recipeList: Recipe[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Recipe),
        }));
        setRecipes(recipeList);
      } catch (error) {
        console.error('Tarifleri alma hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [])
);


  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>🍽️ Tarifler</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddRecipe')}
        >
          <Text style={styles.addButtonText}>➕ Yeni Tarif Ekle</Text>
        </TouchableOpacity>

        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            >
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.cuisine}>{item.cuisine}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default RecipesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cuisine: {
    fontSize: 14,
    color: '#777',
  },
  addButton: {
    backgroundColor: '#1e88e5',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
