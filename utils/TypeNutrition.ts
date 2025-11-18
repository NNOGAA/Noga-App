import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateSummary } from "@/services/ocrService";

export interface NutritionItem {
  nama: string;
  nilai: string;
  type: string;
  icon?: string;
}

export const MEASUREMENT_TYPES = [
  { label: "g", value: "gram" },
  { label: "mg", value: "mg" },
  { label: "kcal", value: "kcal" },
  { label: "%", value: "percent" },
  { label: "ml", value: "ml" },
];

export const createNutritionItem = (
  nama: string,
  nilai: string,
  type: string,
  icon: string
): NutritionItem => ({
  nama,
  nilai,
  type,
  icon,
});

export const getUnitLabel = (type: string): string => {
  const found = MEASUREMENT_TYPES.find((t) => t.value === type);
  return found ? found.label : type;
};

export const checkDuplicateField = (
  items: NutritionItem[],
  fieldName: string
): boolean => {
  return items.some(
    (item) => item.nama.toLowerCase() === fieldName.toLowerCase()
  );
};

const DEFAULT_NUTRITION_ITEMS: NutritionItem[] = [
  { nama: "Serving Size", nilai: "", type: "gram", icon: "serving-size" },
  { nama: "Calories", nilai: "", type: "kcal", icon: "calories" },
  { nama: "Total Fat", nilai: "", type: "gram", icon: "total-fat" },
  { nama: "Saturated Fat", nilai: "", type: "gram", icon: "saturated-fat" },
  { nama: "Total Carbohydrate", nilai: "", type: "gram", icon: "carbs" },
  { nama: "Sugar", nilai: "", type: "gram", icon: "sugar" },
  { nama: "Protein", nilai: "", type: "gram", icon: "protein" },
];

export const loadNutritionData = async (): Promise<NutritionItem[]> => {
  try {
    const storedData = await AsyncStorage.getItem("nutrition_items");
    if (storedData) {
      return JSON.parse(storedData);
    }
    return DEFAULT_NUTRITION_ITEMS;
  } catch (error) {
    console.error("Error loading nutrition data:", error);
    return DEFAULT_NUTRITION_ITEMS;
  }
};

export const saveNutritionData = async (
  items: NutritionItem[]
): Promise<NutritionItem[]> => {
  try {
    await AsyncStorage.setItem("nutrition_items", JSON.stringify(items));

    // Also save in the format expected by nutrition-detail
    const nutritionInfo = items.map((item) => ({
      nama: item.nama,
      nilai: parseFloat(item.nilai) || 0,
      type: getUnitLabel(item.type),
      status: "neutral" as const,
    }));
    await AsyncStorage.setItem("nutrition_info", JSON.stringify(nutritionInfo));

    return items;
  } catch (error) {
    console.error("Error saving nutrition data:", error);
    return items;
  }
};

export const handleNutritionSubmission = async (
  items: NutritionItem[]
): Promise<{ success: boolean; error?: string }> => {
  try {
    const sessionId = await AsyncStorage.getItem("sessionId");
    const ingredientsStr = await AsyncStorage.getItem("ingredients");

    if (!sessionId) {
      return { success: false, error: "No session ID found" };
    }

    const nutritionInfo = items
      .filter((item) => item.nilai && item.nilai !== "0")
      .map((item) => ({
        nama: item.nama,
        nilai: parseFloat(item.nilai) || 0,
        type: getUnitLabel(item.type),
        status: "neutral" as const,
      }));

    let ingredients: any[] = [];
    if (ingredientsStr) {
      ingredients = JSON.parse(ingredientsStr);
    }

    const summaryResponse = await generateSummary(ingredients, nutritionInfo);

    if (summaryResponse && summaryResponse.data) {
      await AsyncStorage.setItem("nutrition_general", JSON.stringify(summaryResponse.data));

      if (summaryResponse.data.ingredients) {
        await AsyncStorage.setItem("ingredients", JSON.stringify(summaryResponse.data.ingredients));
      }

      if (summaryResponse.data.nutrition_info) {
        await AsyncStorage.setItem("nutrition_info", JSON.stringify(summaryResponse.data.nutrition_info));
      }

      return { success: true };
    }

    return { success: false, error: "Failed to generate summary" };
  } catch (error) {
    console.error("Error submitting nutrition data:", error);
    return { success: false, error: String(error) };
  }
};
