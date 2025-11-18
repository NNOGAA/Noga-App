export { api, aiApi } from './api';
export { uploadPackagedFood, uploadPreparedFood } from './uploadService';
export type { UploadResponse } from './uploadService';
export {
  extractIngredients,
  extractNutritionInfo,
  generateSummary,
  validateAndFixTypos,
  processPackagedFood,
} from './ocrService';
export type {
  Ingredient,
  NutritionInfo,
  OCRResponse,
  SummaryResponse,
} from './ocrService';
