export { api, aiApi } from '../services/api';
export { uploadPackagedFood, uploadPreparedFood } from '../services/uploadService';
export type { UploadResponse } from '../services/uploadService';
export {
  extractIngredients,
  extractNutritionInfo,
  generateSummary,
  validateAndFixTypos,
  processPackagedFood,
} from '../services/ocrService';
export type {
  Ingredient,
  NutritionInfo,
  OCRResponse,
  SummaryResponse,
} from '../services/ocrService';
