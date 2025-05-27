// src/screens/ShoppingListScreen.tsx

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { usePlan } from '../context/PlanContext';

const ShoppingListScreen = () => {
  const { plan } = usePlan();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const ingredients = useMemo(() => {
    const allIngredients = Object.values(plan)
      .filter((r) => r)
      .flatMap((r) => r!.ingredients);
    return Array.from(new Set(allIngredients));
  }, [plan]);

  const toggleItem = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Alışveriş Listesi</Text>
      {ingredients.length === 0 ? (
        <Text style={styles.empty}>Henüz planlanan tarif yok.</Text>
      ) : (
        <FlatList
          data={ingredients}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggleItem(item)}
              style={[
                styles.itemContainer,
                checkedItems.includes(item) && styles.checked,
              ]}
            >
              <Text
                style={[
                  styles.itemText,
                  checkedItems.includes(item) && styles.checkedText,
                ]}
              >
                • {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default ShoppingListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
  itemContainer: {
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
  },
  checked: {
    backgroundColor: '#C8E6C9',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
