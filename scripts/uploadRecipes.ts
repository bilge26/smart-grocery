import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import recipes from './recipes.json';
import { db } from './firebaseConfig'; // testUpload.ts'deki config'i buraya taşıyabilirsin

const uploadRecipes = async () => {
  for (const recipe of recipes) {
    try {
      // 🧼 Verileri normalize et
      const cleanRecipe = {
        name: String(recipe.name || ''),
        cuisine: String(recipe.cuisine || ''),
        category: String(recipe.category || ''),
        instructions: String(recipe.instructions || ''),
        tags: Array.isArray(recipe.tags) ? recipe.tags.map(String) : [],
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.map(String) : []
      };

      await addDoc(collection(db, 'recipes'), cleanRecipe);
      console.log(`✅ Yüklendi: ${cleanRecipe.name}`);
    } catch (error) {
      console.error(`❌ Hata: ${recipe.name}`, error);
    }
  }
};

uploadRecipes();
