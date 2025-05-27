import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Recipe } from '../types/recipe';
import { usePlan } from '../context/PlanContext';

// ✅ Firestore eklemeleri
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const AddRecipeScreen = () => {
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const navigation = useNavigation();
  const { addUserRecipe } = usePlan();

  const handleSubmit = async () => {
    if (!name || !cuisine || !ingredients || !instructions) {
      Alert.alert('Lütfen tüm alanları doldurun.');
      return;
    }

    const newRecipe: Recipe = {
      id: Date.now(),
      name,
      cuisine,
      ingredients: ingredients.split(',').map((i) => i.trim()),
      instructions,
    };

    try {
      // 🔥 Firestore'a kaydet
      await addDoc(collection(db, 'recipes'), newRecipe);

      // Context içine de ekle
      addUserRecipe(newRecipe);

      Alert.alert('✅ Tarif eklendi!');
      setName('');
      setCuisine('');
      setIngredients('');
      setInstructions('');
      navigation.goBack();
    } catch (error) {
      console.error('Tarif eklenemedi:', error);
      Alert.alert('❌ Tarif eklenemedi. Lütfen tekrar deneyin.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>➕ Tarif Ekle</Text>

      <TextInput
        style={styles.input}
        placeholder="Tarif Adı"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mutfak Türü (örn: Türk, İtalyan)"
        value={cuisine}
        onChangeText={setCuisine}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Malzemeler (virgülle ayırın)"
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />
      <TextInput
        style={styles.textArea}
        placeholder="Yapılış Talimatları"
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />

      <Button title="Tarifi Kaydet" onPress={handleSubmit} />
    </ScrollView>
  );
};

export default AddRecipeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    elevation: 2,
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
    elevation: 2,
  },
});
