import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { usePlan } from '../context/PlanContext';
import { Recipe } from '../types/recipe';

const AddRecipeScreen = () => {
  const { addUserRecipe } = usePlan();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleAdd = () => {
    const newRecipe: Recipe = {
      id: Date.now().toString(),
      name,
      cuisine,
      category,
      tags: tags.split(',').map((t) => t.trim()),
      ingredients: ingredients.split('\n').map((i) => i.trim()),
      instructions,
    };

    addUserRecipe(newRecipe);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>➕ Yeni Tarif Ekle</Text>

      <TextInput
        label="Tarif Adı"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Mutfak Türü"
        value={cuisine}
        onChangeText={setCuisine}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Kategori"
        value={category}
        onChangeText={setCategory}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Etiketler (virgülle)"
        value={tags}
        onChangeText={setTags}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Malzemeler (her satıra bir)"
        value={ingredients}
        onChangeText={setIngredients}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <TextInput
        label="Hazırlanışı"
        value={instructions}
        onChangeText={setInstructions}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleAdd}
        style={styles.button}
        contentStyle={{ paddingVertical: 6 }}
      >
        Tarifi Kaydet
      </Button>
    </ScrollView>
  );
};

export default AddRecipeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 12,
    borderRadius: 8,
  },
});
