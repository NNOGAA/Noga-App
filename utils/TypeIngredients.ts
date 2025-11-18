import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export interface IngredientItem {
  name: string;
  status: "good" | "neutral" | "bad";
  detail: string;
}

export const loadIngredients = async (): Promise<IngredientItem[]> => {
  try {
    const storedIngredients = await AsyncStorage.getItem("ingredients");
    if (storedIngredients) {
      return JSON.parse(storedIngredients);
    }
    return [];
  } catch (error) {
    console.error("Error loading ingredients:", error);
    return [];
  }
};

export const addIngredientToStorage = async (
  newIngredient: string,
  currentIngredients: string[]
): Promise<boolean> => {
  try {
    const trimmedIngredient = newIngredient.trim();

    // Check for duplicates
    if (currentIngredients.some(
      (ing) => ing.toLowerCase() === trimmedIngredient.toLowerCase()
    )) {
      Alert.alert(
        "Duplicate Ingredient",
        `"${trimmedIngredient}" is already in your list.`,
        [{ text: "OK" }]
      );
      return false;
    }

    // Get current stored ingredients
    const storedData = await AsyncStorage.getItem("ingredients");
    const ingredients: IngredientItem[] = storedData ? JSON.parse(storedData) : [];

    // Add new ingredient
    const newItem: IngredientItem = {
      name: trimmedIngredient,
      status: "neutral",
      detail: "added by user",
    };

    ingredients.push(newItem);
    await AsyncStorage.setItem("ingredients", JSON.stringify(ingredients));

    return true;
  } catch (error) {
    console.error("Error adding ingredient:", error);
    Alert.alert("Error", "Failed to add ingredient. Please try again.");
    return false;
  }
};

export const removeIngredientFromStorage = async (
  ingredientName: string
): Promise<boolean> => {
  try {
    const storedData = await AsyncStorage.getItem("ingredients");
    if (!storedData) return false;

    const ingredients: IngredientItem[] = JSON.parse(storedData);
    const filtered = ingredients.filter((item) => item.name !== ingredientName);

    await AsyncStorage.setItem("ingredients", JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error removing ingredient:", error);
    Alert.alert("Error", "Failed to remove ingredient. Please try again.");
    return false;
  }
};

export const clearIngredientsAndNutritionInfo = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem("ingredients");
    await AsyncStorage.removeItem("nutrition_info");
    await AsyncStorage.removeItem("nutrition_items");
    await AsyncStorage.removeItem("nutrition_general");
    return true;
  } catch (error) {
    console.error("Error clearing data:", error);
    return false;
  }
};
