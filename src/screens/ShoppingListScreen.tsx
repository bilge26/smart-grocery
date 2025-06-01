import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { usePlan } from '../context/PlanContext';
import ShoppingItem from '../components/ShoppingItem';


const parseIngredient = (ingredient: string): { name: string; quantity: number } => {
  const match = ingredient.match(/^(\d+)\s+(.*)$/);
  if (match) {
    return {
      quantity: parseInt(match[1], 10),
      name: match[2].trim().toLowerCase(),
    };
  } else {
    return {
      quantity: 1,
      name: ingredient.trim().toLowerCase(),
    };
  }
};

const ShoppingListScreen = () => {
  const { plan } = usePlan();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const ingredients = useMemo(() => {
    const combined: Record<string, number> = {};

    Object.values(plan)
  .filter((dayPlan) => dayPlan !== null)
  .flatMap((dayPlan) =>
    Object.values(dayPlan!)
      .filter((r) => r && Array.isArray(r.ingredients))
      .flatMap((r) => r!.ingredients)
  )

      .forEach((item) => {
        const { name, quantity } = parseIngredient(item);
        if (combined[name]) {
          combined[name] += quantity;
        } else {
          combined[name] = quantity;
        }
      });

    return Object.entries(combined).map(
      ([name, quantity]) => `${quantity} ${name}`
    );
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
  <ShoppingItem
    item={item}
    checked={checkedItems.includes(item)}
    onToggle={() => toggleItem(item)}
  />
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
    paddingTop: 40,
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
