import AsyncStorage from "@react-native-async-storage/async-storage";
import { Nutritions, Summary, Ingredient } from "@/types/NutritionDetail";

interface NutritionDataResult {
  nutritionFacts: Nutritions[];
  summaries: Summary[];
  ingredients: Ingredient[];
}

export const fetchNutritionData = async (): Promise<NutritionDataResult | null> => {
  try {
    const nutritionInfoStr = await AsyncStorage.getItem("nutrition_info");
    const ingredientsStr = await AsyncStorage.getItem("ingredients");
    const summaryStr = await AsyncStorage.getItem("nutrition_general");

    const nutritionFacts: Nutritions[] = [];
    const summaries: Summary[] = [];
    const ingredients: Ingredient[] = [];

    // Parse nutrition info
    if (nutritionInfoStr) {
      const nutritionData = JSON.parse(nutritionInfoStr);
      if (Array.isArray(nutritionData)) {
        nutritionData.forEach((item: any) => {
          nutritionFacts.push({
            name: item.nama || item.name || '',
            value: typeof item.nilai === 'number' ? item.nilai : parseFloat(item.nilai) || 0,
            unit: item.type || item.unit || '',
            classification: item.status === 'good' ? 'green' : item.status === 'bad' ? 'red' : 'yellow',
          });
        });
      }
    }

    // Parse ingredients
    if (ingredientsStr) {
      const ingredientsData = JSON.parse(ingredientsStr);
      if (Array.isArray(ingredientsData)) {
        ingredientsData.forEach((item: any) => {
          const classification = item.status === 'good' ? 'green' : item.status === 'bad' ? 'red' : 'yellow';
          ingredients.push({
            name: item.name || '',
            detail: item.detail || '',
            classification: classification as 'green' | 'yellow' | 'red',
          });
        });
      }
    }

    // Parse summary
    if (summaryStr) {
      const summaryData = JSON.parse(summaryStr);
      if (Array.isArray(summaryData)) {
        summaryData.forEach((item: any) => {
          const key = Object.keys(item)[0];
          if (key && item[key]) {
            const statusMap: { [key: string]: 'good' | 'normal' | 'bad' } = {
              'good': 'good',
              'normal': 'normal',
              'bad': 'bad',
              'neutral': 'normal',
            };
            summaries.push({
              message: key,
              detail: item[key].description || '',
              classification: statusMap[item[key].status] || 'normal',
            });
          }
        });
      }
    }

    return {
      nutritionFacts,
      summaries,
      ingredients,
    };
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    return null;
  }
};
