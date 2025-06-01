import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigators/MainNavigator';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Recipe } from '../types/recipe';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RecipeCard from '../components/RecipeCard';


type FilteredRecipesRouteProp = RouteProp<RootStackParamList, 'FilteredRecipes'>;

const tags = ['vegan', 'sağlıklı', 'diyet'];

const FilteredRecipesScreen = () => {
  const route = useRoute<FilteredRecipesRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const category = route.params.category;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      const snapshot = await getDocs(collection(db, 'recipes'));
      const data: Recipe[] = snapshot.docs.map((doc) => ({
        id: doc.id, // 🔥 Firestore doküman ID'si kullanılıyor
        ...(doc.data() as Omit<Recipe, 'id'>),
      }));
      setRecipes(data);
    };
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(
    (r) =>
      r.category === category &&
      (selectedTag ? r.tags?.includes(selectedTag) : true)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{category.toUpperCase()}</Text>

      <View style={styles.filters}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.filterButton,
              selectedTag === tag && styles.selectedFilter,
            ]}
            onPress={() =>
              setSelectedTag(selectedTag === tag ? null : tag)
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedTag === tag && styles.selectedText,
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
  <RecipeCard
    recipe={item}
    onPress={() =>
      navigation.navigate('RecipeDetail', { recipe: item })
    }
  />
)}

      />
    </View>
  );
};

export default FilteredRecipesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  filters: { flexDirection: 'row', marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ddd',
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 6,
  },
  selectedFilter: { backgroundColor: '#2196f3' },
  filterText: { color: '#000' },
  selectedText: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: '600' },
  cuisine: { fontSize: 14, color: '#777' },
});
