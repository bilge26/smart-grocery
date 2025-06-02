import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import RecipesScreen from '../screens/RecipesScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import PlanScreen from '../screens/PlanScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import AddRecipeScreen from '../screens/AddRecipeScreen';
import { Recipe } from '../types/recipe';
import FilteredRecipesScreen from '../screens/FilteredRecipesScreen';
import SuggestRecipeScreen from '../screens/SuggestRecipeScreen';


export type RootStackParamList = {
  Tabs: undefined;
  RecipeDetail: { recipe: Recipe };
  AddRecipe: undefined;
  FilteredRecipes: { category: string };
  SuggestRecipe: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();


const Tabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Recipes') {
          iconName = focused ? 'restaurant' : 'restaurant-outline';
        } else if (route.name === 'Plan') {
          iconName = focused ? 'calendar' : 'calendar-outline';
        } else if (route.name === 'List') {
          iconName = focused ? 'list' : 'list-outline';
        } else {
          iconName = 'help';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1e88e5',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Recipes" component={RecipesScreen} />
    <Tab.Screen name="Plan" component={PlanScreen} />
    <Tab.Screen name="List" component={ShoppingListScreen} />
  </Tab.Navigator>
);

const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen name="AddRecipe" component={AddRecipeScreen} options={{ title: 'Tarif Ekle' }} />
      <Stack.Screen
  name="FilteredRecipes"
  component={FilteredRecipesScreen}
  options={({ route }) => ({
    title: `${route.params.category} Tarifleri`,
  })}
/>
      <Stack.Screen
  name="SuggestRecipe"
  component={SuggestRecipeScreen}
  options={{ title: 'Tarif Önerici' }}
/>
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainNavigator;
