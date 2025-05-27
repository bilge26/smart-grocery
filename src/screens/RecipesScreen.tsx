import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Recipe } from '../types/recipe';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/MainNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const RecipesScreen = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('kahvaltı');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const categories = ['kahvaltı', 'öğle yemeği', 'akşam yemeği', 'tatlı'];
  const tags = ['vegan', 'sağlıklı', 'diyet'];

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

  const filteredRecipes = recipes.filter(
    (r) =>
      r.category?.toLowerCase() === selectedCategory &&
      (selectedTag ? r.tags?.includes(selectedTag) : true)
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>🍽️ Tarifler</Text>

        {/* Kategori Butonları */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.categoryButtonSelected,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextSelected,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Etiket Filtreleri */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.filterButton,
                selectedTag === tag && styles.filterButtonSelected,
              ]}
              onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedTag === tag && styles.filterTextSelected,
                ]}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tarif Listesi */}
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            >
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.cuisine}>{item.cuisine}</Text>
              {item.tags && (
                <Text style={styles.tags}>Etiketler: {item.tags.join(', ')}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default RecipesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12 },
  header: { fontSize: 22, fontWeight: 'bold', marginVertical: 12, textAlign: 'center' },
  categoryBar: { marginBottom: 10 },
  filterBar: { marginBottom: 10 },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    marginRight: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#1976d2',
  },
  categoryText: {
    color: '#333',
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    marginRight: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#66bb6a',
  },
  filterText: {
    color: '#444',
  },
  filterTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fafafa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  cuisine: { fontSize: 14, color: '#666', marginTop: 4 },
  tags: { marginTop: 4, fontSize: 12, color: '#999' },
});
