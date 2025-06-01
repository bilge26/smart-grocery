import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  item: string;
  checked: boolean;
  onToggle: () => void;
};

const ShoppingItem = ({ item, checked, onToggle }: Props) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[styles.itemContainer, checked && styles.checked]}
    >
      <Text
        style={[
          styles.itemText,
          checked && styles.checkedText,
        ]}
      >
        • {item}
      </Text>
    </TouchableOpacity>
  );
};

export default React.memo(ShoppingItem);

const styles = StyleSheet.create({
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
