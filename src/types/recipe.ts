export type Recipe = {
  id?: number; // Firebase'deki tariflerde olmayabilir, bu yüzden opsiyonel
  name: string;
  ingredients: string[];
  instructions: string;
  cuisine: string;
  category?: string; // Firebase'de varsa gelsin
  tags?: string[];   // Firebase'de varsa gelsin
};
