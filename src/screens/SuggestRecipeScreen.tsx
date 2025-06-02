import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigators/MainNavigator';
import { Recipe } from '../types/recipe';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const SuggestRecipeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [input, setInput] = useState('');
  const [results, setResults] = useState<
    { recipe: Recipe; missing: string[]; matchCount: number }[]
  >([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Firestore'dan tarifleri çek
  useEffect(() => {
    const fetchRecipes = async () => {
      const snapshot = await getDocs(collection(db, 'recipes'));
      const data: Recipe[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Recipe, 'id'>),
      }));
      setRecipes(data);
    };
    fetchRecipes();
  }, []);

  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[0-9]/g, '')
      .replace(
        /(adet|gram|ml|yemek kaşığı|tatlı kaşığı|çay kaşığı|tane|su bardağı|kup|küp|küçük|büyük|veya|bitkisel)/g,
        ''
      )
      .replace(/[^\w\s]/g, '')
      .trim();
  };

  const handleSuggest = () => {
    const userIngredients = input
      .split(',')
      .map((i) => normalize(i))
      .filter(Boolean);

    const suggestions = recipes
      .map((recipe) => {
        const matched = recipe.ingredients.filter((ing) => {
          const ingNorm = normalize(ing);
          return userIngredients.some(
            (u) => ingNorm.includes(u) || u.includes(ingNorm)
          );
        });

        return {
          recipe,
          missing: recipe.ingredients.filter((ing) => {
            const ingNorm = normalize(ing);
            return !userIngredients.some(
              (u) => ingNorm.includes(u) || u.includes(ingNorm)
            );
          }),
          matchCount: matched.length,
        };
      })
      .filter((r) => r.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    setResults(suggestions);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.header}>📦 Elindeki Malzemeleri Gir</Text>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="örnek: yumurta, un, süt"
              style={styles.input}
            />
            <Text style={styles.tip}>Virgül ile ayırarak yazmalısın.</Text>
            <TouchableOpacity onPress={handleSuggest} style={styles.button}>
              <Text style={styles.buttonText}>🔍 Tarif Öner</Text>
            </TouchableOpacity>
          </>
        }
        data={results}
        keyExtractor={(item) => item.recipe.id}
        ListEmptyComponent={
          <Text style={styles.empty}>Henüz öneri yok</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('RecipeDetail', { recipe: item.recipe })
            }
          >
            <Text style={styles.title}>{item.recipe.name}</Text>
            <Text style={styles.match}>
              ✅ {item.matchCount} malzeme bulundu
            </Text>
            {item.missing.length > 0 && (
              <Text style={styles.missing}>
                ❌ Eksik: {item.missing.join(', ')}
              </Text>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default SuggestRecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  tip: {
    fontSize: 12,
    color: '#666',
    marginVertical: 6,
  },
  button: {
    backgroundColor: '#1e88e5',
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  match: {
    marginTop: 6,
    color: '#00796B',
  },
  missing: {
    marginTop: 4,
    color: '#C62828',
    fontStyle: 'italic',
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#aaa',
  },
});
