import { aiApi } from './api';

export interface Ingredient {
  name: string;
  status: 'good' | 'neutral' | 'bad';
  detail: string;
}

export interface NutritionInfo {
  nama: string;
  nilai: number;
  type: string;
  status: 'good' | 'neutral' | 'bad';
  detail?: string;
}

export interface OCRResponse {
  status: string;
  data: {
    ingredients?: Ingredient[];
    nutrition_info?: NutritionInfo[];
  };
}

export interface SummaryResponse {
  status: string;
  data: {
    summary: Array<{
      [key: string]: {
        status: string;
        description: string;
      };
    }>;
    preservatives_detected: string[];
    nutrition_info: NutritionInfo[];
    ingredients: Ingredient[];
  };
}

export const extractIngredients = async (
  sessionId: string,
  imageUrl: string
): Promise<OCRResponse> => {
  const response = await aiApi.post<OCRResponse>('/ocr-ingredients', {
    session_id: sessionId,
    composition: imageUrl,
  });

  return response.data;
};

export const extractNutritionInfo = async (
  sessionId: string,
  imageUrl: string
): Promise<OCRResponse> => {
  const response = await aiApi.post<OCRResponse>('/ocr-nutrition-info', {
    session_id: sessionId,
    nutrition_info: imageUrl,
  });

  return response.data;
};

export const generateSummary = async (
  ingredients: Ingredient[],
  nutritionInfo: NutritionInfo[]
): Promise<SummaryResponse> => {
  const response = await aiApi.post<SummaryResponse>('/summary_foods', {
    ingredients,
    nutrition_info: nutritionInfo,
  });

  return response.data;
};

export const validateAndFixTypos = async (
  compositionUrl: string,
  nutritionUrl: string
) => {
  const response = await aiApi.post('/validate-fix-typo', {
    composition: compositionUrl,
    nutrition_info: nutritionUrl,
  });

  return response.data;
};

export const processPackagedFood = async (
  sessionId: string,
  compositionUrl: string,
  nutritionUrl: string
) => {
  const [ingredientsResult, nutritionResult] = await Promise.all([
    extractIngredients(sessionId, compositionUrl),
    extractNutritionInfo(sessionId, nutritionUrl),
  ]);

  const summary = await generateSummary(
    ingredientsResult.data.ingredients || [],
    nutritionResult.data.nutrition_info || []
  );

  return {
    ingredients: ingredientsResult.data.ingredients,
    nutritionInfo: nutritionResult.data.nutrition_info,
    summary: summary.data,
  };
};
