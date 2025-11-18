import { View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import { Nutritions, Summary, Ingredient } from "@/types/NutritionDetail";
import { fetchNutritionData } from "../utils/NutritionDetail";
import { Header, NutritionFacts, SummarySection, IngredientsSection } from "../components/NutritionDetail";

export default function NutritionDetail() {
  const router = useRouter();
  const [nutritionFacts, setNutritionFacts] = useState<Nutritions[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadNutritionData = async () => {
      try {
        const data = await fetchNutritionData();
        
        if (data) {
          setNutritionFacts(data.nutritionFacts);
          setSummaries(data.summaries);
          setIngredients(data.ingredients);
        }
      } catch (error) {
        console.error("Error loading nutrition data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNutritionData();
  }, []);

  const handleMenuPress = () => {
    console.log("menu");
  };

  const dangerousIngredients = ingredients.filter(
    (ingredient) => ingredient.classification === "red"
  );
  const midIngredients = ingredients.filter(
    (ingredient) => ingredient.classification === "yellow"
  );
  const safeIngredients = ingredients.filter(
    (ingredient) => ingredient.classification === "green"
  );

  return (
    <View className="flex-1 bg-white">
      <Header 
        title="Nutrition Detail" 
        onBackPress={() => router.back()} 
        onMenuPress={handleMenuPress} 
      />

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text>Loading nutrition data...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <NutritionFacts nutritionFacts={nutritionFacts} />
          <SummarySection summaries={summaries} />
          <IngredientsSection 
            dangerousIngredients={dangerousIngredients}
            midIngredients={midIngredients}
            safeIngredients={safeIngredients}
          />
        </ScrollView>
      )}
    </View>
  );
}