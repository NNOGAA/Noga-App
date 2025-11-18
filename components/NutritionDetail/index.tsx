import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

import SummaryAccordion from '../SummaryAccordion';
import Gram from '../Gram';
import IngredientAccordion from '../IngredientAccordion';

import { Nutritions, Summary, Ingredient } from '@/types/NutritionDetail';

export const Header: React.FC<{
  title: string;
  onBackPress: () => void;
  onMenuPress: () => void;
}> = ({ title, onBackPress, onMenuPress }) => {
  return (
    <View className="w-full flex-row items-center justify-between px-4 pb-6 pt-12">
      <TouchableOpacity
        onPress={onBackPress}
        className="h-10 w-10 items-center justify-center rounded-full border border-primary-0">
        <FeatherIcon name="arrow-left" size={20} color="black" />
      </TouchableOpacity>

      <Text className="text-2xl font-bold">{title}</Text>

      <TouchableOpacity
        onPress={onMenuPress}
        className="h-10 w-10 items-center justify-center rounded-full border border-primary-0">
        <FeatherIcon name="more-vertical" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export const NutritionFacts: React.FC<{
  nutritionFacts: Nutritions[];
}> = ({ nutritionFacts }) => {
  return (
    <View className="mb-4 rounded-xl border border-gray-300 bg-white p-4">
      <Text className="mb-4 text-xl font-bold">Nutritional Facts</Text>
      <View className="gap-2">
        {nutritionFacts.map((nutrition, index) => (
          <View key={index} className="flex-row justify-between">
            <Text className="font-semibold capitalize text-gray-500">{nutrition.name}</Text>
            <View className="flex-row items-center">
              <Gram gram={nutrition.value} color={nutrition.classification} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export const SummarySection: React.FC<{
  summaries: Summary[];
}> = ({ summaries }) => {
  return (
    <View className="mb-4 rounded-xl border border-gray-300 bg-white p-4">
      <Text className="mb-4 text-xl font-bold">Summary</Text>
      <View className="flex-col gap-2">
        {summaries.map((summary, index) => (
          <SummaryAccordion
            key={index}
            title={summary.message}
            detail={summary.detail}
            classification={summary.classification}
            defaultCollapsed={false}
          />
        ))}
      </View>
    </View>
  );
};

export const IngredientsSection: React.FC<{
  dangerousIngredients: Ingredient[];
  midIngredients: Ingredient[];
  safeIngredients: Ingredient[];
}> = ({ dangerousIngredients, midIngredients, safeIngredients }) => {
  return (
    <View className="mb-4 rounded-xl border border-gray-300 bg-white p-4">
      <Text className="mb-4 text-xl font-bold">Ingredients</Text>
      <View className="flex-col gap-3">
        <View className="flex-col gap-2">
          <Text className="text-lg font-semibold text-red-500">Dangerous Ingredients</Text>
          {dangerousIngredients.length > 0 ? (
            dangerousIngredients.map((ingredient, index) => (
              <IngredientAccordion
                key={index}
                name={ingredient.name}
                detail={ingredient.detail}
                classification={ingredient.classification}
              />
            ))
          ) : (
            <Text className="italic text-gray-500">No dangerous ingredients found</Text>
          )}
        </View>

        <View className="flex-col gap-2">
          <Text className="text-lg font-semibold text-[#F8A700]">Ingredients to Look Out For</Text>
          {midIngredients.length > 0 ? (
            midIngredients.map((ingredient, index) => (
              <IngredientAccordion
                key={index}
                name={ingredient.name}
                detail={ingredient.detail}
                classification={ingredient.classification}
              />
            ))
          ) : (
            <Text className="italic text-gray-500">No ingredients to look out for</Text>
          )}
        </View>

        <View className="flex-col gap-2">
          <Text className="text-lg font-semibold text-green-500">Safe Ingredients</Text>
          {safeIngredients.length > 0 ? (
            safeIngredients.map((ingredient, index) => (
              <IngredientAccordion
                key={index}
                name={ingredient.name}
                detail={ingredient.detail}
                classification={ingredient.classification}
              />
            ))
          ) : (
            <Text className="italic text-gray-500">No safe ingredients found</Text>
          )}
        </View>
      </View>
    </View>
  );
};
