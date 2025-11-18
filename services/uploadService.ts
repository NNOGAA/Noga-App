import { api } from './api';

export interface UploadResponse {
  composition: {
    url: string;
    filename: string;
  };
  nutrition_info: {
    url: string;
    filename: string;
  };
  sessionid: string;
}

export const uploadPackagedFood = async (
  compositionImage: any,
  nutritionImage: any
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('composition', compositionImage);
  formData.append('nutrition_info', nutritionImage);

  const response = await api.post<UploadResponse>(
    '/api/image/packaged-food',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

export const uploadPreparedFood = async (foodImage: any) => {
  const formData = new FormData();
  formData.append('food', foodImage);

  const response = await api.post('/api/image/prepared-food', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
