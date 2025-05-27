export type Recipe = {
  id: string; // artık her tarifin id’si Firestore’dan gelen string olacak
  name: string;
  cuisine: string;
  category: string;
  tags: string[];
  ingredients: string[];
  instructions: string;
};
