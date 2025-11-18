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

    if (nutritionInfoStr) {
      const nutritionData = JSON.parse(nutritionInfoStr);
      if (Array.isArray(nutritionData)) {
        nutritionData.forEach((item: any) => {
          const rawValue = item.nilai || item.value;
          const classification = item.status === 'good' ? 'green' : item.status === 'bad' ? 'red' : 'yellow';

          nutritionFacts.push({
            name: item.nama || item.name || '',
            value: typeof rawValue === 'number' ? rawValue : parseFloat(rawValue) || 0,
            unit: item.type || item.unit || '',
            classification,
          });
        });
      }
    }

    if (ingredientsStr) {
      const ingredientsData = JSON.parse(ingredientsStr);
      if (Array.isArray(ingredientsData)) {
        ingredientsData.forEach((item: any) => {
          const classification = item.status === 'good' ? 'green' : item.status === 'bad' ? 'red' : 'yellow';
          ingredients.push({
            name: item.name || item.nama || '',
            detail: item.detail || '',
            classification: classification as 'green' | 'yellow' | 'red',
          });
        });
      }
    }

    if (summaryStr) {
      const generalData = JSON.parse(summaryStr);
      if (generalData.summary && Array.isArray(generalData.summary)) {
        generalData.summary.forEach((item: any) => {
          Object.keys(item).forEach((key) => {
            if (key && item[key]) {
              const statusMap: { [key: string]: 'good' | 'normal' | 'bad' } = {
                'good': 'good',
                'normal': 'normal',
                'bad': 'bad',
                'neutral': 'normal',
                'yes': 'good',
                'no': 'normal',
                'low sugar': 'good',
                'normal sodium': 'good',
              };
              const status = (item[key].status || '').toLowerCase();
              summaries.push({
                message: key,
                detail: item[key].description || '',
                classification: statusMap[status] || 'normal',
              });
            }
          });
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
