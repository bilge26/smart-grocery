import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
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
      id: Date.now().toString(), // 🔥 string ID ürettik
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
        placeholder="Tarif Adı"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Mutfak Türü"
        style={styles.input}
        value={cuisine}
        onChangeText={setCuisine}
      />
      <TextInput
        placeholder="Kategori (kahvaltı, öğle yemeği, vb.)"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        placeholder="Etiketler (virgülle)"
        style={styles.input}
        value={tags}
        onChangeText={setTags}
      />
      <TextInput
        placeholder="Malzemeler (her satıra bir malzeme)"
        style={[styles.input, { height: 100 }]}
        multiline
        value={ingredients}
        onChangeText={setIngredients}
      />
      <TextInput
        placeholder="Hazırlanışı"
        style={[styles.input, { height: 100 }]}
        multiline
        value={instructions}
        onChangeText={setInstructions}
      />

      <Button title="Tarifi Kaydet" onPress={handleAdd} />
    </ScrollView>
  );
};

export default AddRecipeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
