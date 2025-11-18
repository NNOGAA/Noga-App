// Navigation types
export type RootStackParamList = {
  Home: undefined;
  FoodType: undefined;
  TypeIngredient: undefined;
  OneTakePicture: undefined;
  TwoTakePicture: undefined;
  TypeNutrition: undefined;
  NutritionGeneral: undefined;
  NutritionDetail: undefined;
  Substitute: undefined;
};

// Nutrition data types
export interface Nutritions {
  name: string;
  value: number;
  unit: string;
  classification: string;
}

export interface Summary {
  message: string;
  detail: string;
  classification: 'good' | 'normal' | 'bad';
}

export interface Ingredient {
  name: string;
  detail: string;
  classification: 'green' | 'yellow' | 'red';
}

export interface NutritionInfo {
  nama: string;
  nilai: number | string;
  type: string;
  status: 'good' | 'neutral' | 'bad';
  detail?: string;
}

export interface IngredientRaw {
  name: string;
  status: 'good' | 'neutral' | 'bad';
  detail: string;
}

export interface NutritionData {
  nutrition_info: NutritionInfo[];
  summary: Array<{
    [key: string]: {
      status: string;
      description: string;
    };
  }>;
  ingredients: IngredientRaw[];
  preservatives_detected?: string[];
}
