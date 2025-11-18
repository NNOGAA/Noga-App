import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import FeatherIcon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import ProgressBar from "../components/ProgressBar";

interface NutritionInfo {
  name?: string;
  nama?: string;
  value?: string | number;
  nilai?: string | number;
  type: string;
  status: string;
  data?: null;
}

interface NutritionData {
  summary: Array<
    Record<
      string,
      {
        status: string;
        description: string;
      }
    >
  >;
  nutrition_info: Array<NutritionInfo>;
  ingredients: Array<{
    name: string;
    status: string;
    detail: string;
  }>;
  preservatives_detected: Array<any>;
}

interface NutritionFact {
  name: string;
  value: number;
}

export default function NutritionGeneral() {
  const router = useRouter();
  const [showRating, setShowRating] = useState(true);
  const [nutritionFacts, setNutritionFacts] = useState<NutritionFact[]>([]);
  const [servingSize, setServingSize] = useState<string>("N/A");
  const [calories, setCalories] = useState<string>("N/A");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const nutritionData = await AsyncStorage.getItem("nutrition_general");

        if (nutritionData) {
          const parsedData = JSON.parse(nutritionData) as NutritionData;

          if (!parsedData.nutrition_info) {
            setIsLoading(false);
            return;
          }

          const servingSizeInfo = parsedData.nutrition_info.find(
            (item) => {
              const itemName = (item.nama || item.name || '').toLowerCase();
              return itemName.includes("serving") || itemName.includes("portion");
            }
          );
          if (servingSizeInfo) {
            const value = servingSizeInfo.nilai || servingSizeInfo.value;
            setServingSize(`${value} ${servingSizeInfo.type || "g"}`);
          }

          const caloriesInfo = parsedData.nutrition_info.find(
            (item) => {
              const itemName = (item.nama || item.name || '').toLowerCase();
              return itemName.includes("energy") || itemName.includes("calor");
            }
          );
          if (caloriesInfo) {
            const value = caloriesInfo.nilai || caloriesInfo.value;
            setCalories(
              `${value} ${
                caloriesInfo.type === "kilocalorie"
                  ? "cal"
                  : caloriesInfo.type || ""
              }`
            );
          }

          const proteinInfo = parsedData.nutrition_info.find((item) => {
            const itemName = (item.nama || item.name || '').toLowerCase();
            return itemName.includes("protein");
          });

          const carbInfo = parsedData.nutrition_info.find((item) => {
            const itemName = (item.nama || item.name || '').toLowerCase();
            return itemName.includes("carbohydrate");
          });

          const satFatInfo = parsedData.nutrition_info.find((item) => {
            const itemName = (item.nama || item.name || '').toLowerCase();
            return itemName.includes("saturated fat") || itemName.includes("saturated");
          });

          const facts: NutritionFact[] = [
            {
              name: "protein",
              value: proteinInfo ? Number(proteinInfo.nilai || proteinInfo.value) : 0,
            },
            {
              name: "carbohydrate",
              value: carbInfo ? Number(carbInfo.nilai || carbInfo.value) : 0,
            },
            {
              name: "satruated_fat",
              value: satFatInfo ? Number(satFatInfo.nilai || satFatInfo.value) : 0,
            },
          ];
          setNutritionFacts(facts);
        }
      } catch (error) {
        console.error("Error fetching nutrition data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNutritionData();
  }, []);

  const iconMap: Record<string, any> = {
    protein: require("../assets/icons/nutrition/protein.png"),
    carbohydrate: require("../assets/icons/nutrition/carbs.png"),
    satruated_fat: require("../assets/icons/nutrition/saturated-fat.png"),
  };

  const getColor = (name: string, value: number) => {
    if (name === "protein") {
      if (value < 5) return "#EF4444";
      if (value < 10) return "#F59E0B";
      return "#10B981";
    } else if (name === "carbohydrate") {
      if (value < 15) return "#10B981";
      if (value < 30) return "#F59E0B";
      return "#EF4444";
    } else if (name === "satruated_fat") {
      if (value < 5) return "#10B981";
      if (value < 10) return "#F59E0B";
      return "#EF4444";
    }
    return "#10B981";
  };

  const handleBackNavigation = () => {
    Alert.alert(
      "Go back to Home",
      "Are you sure you want to go back? Your ingredient list will be cleared.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Yes, go back",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("nutrition_general");

              router.push("/");
            } catch (error) {
              console.error(
                "Failed to clear ingredients from AsyncStorage:",
                error
              );
              Alert.alert(
                "Error",
                "Failed to clear ingredients. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="bg-white">
      {/* header */}
      <View className="w-full px-4 flex-row items-center justify-between pt-12 pb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full border border-primary-0 justify-center items-center"
        >
          <FeatherIcon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>

        <Text className="font-bold text-2xl">Nutrition</Text>

        <TouchableOpacity
          onPress={() => console.log("menu")}
          className="w-10 h-10 rounded-full border border-primary-0 justify-center items-center"
        >
          <FeatherIcon name="more-vertical" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center py-20">
          <Text>Loading nutrition data...</Text>
        </View>
      ) : (
        <View className="bg-white items-center p-6 w-full">
          <Image
            source={require("../assets/images/food-placeholder.png")}
            className="w-fit h-fit"
            resizeMode="cover"
          />

          <View className="mb-5 gap-2 w-full">
            <View className="flex-row justify-between w-full">
              <Text className="font-bold text-3xl">Serving Size</Text>
              <Text className="font-bold text-3xl">{servingSize}</Text>
            </View>

            <View className="flex-row justify-between w-full">
              <Text className="font-semibold text-slate-500 text-xl">
                Calories
              </Text>
              <Text className="font-semibold text-slate-500 text-xl">
                {calories}
              </Text>
            </View>
          </View>

          <View className="w-full gap-5 mb-10">
            {nutritionFacts.map((item, index) => (
              <View key={index} className="">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center gap-4">
                    <Image
                      source={iconMap[item.name]}
                      className="w-8 h-8"
                      resizeMode="contain"
                    />
                    <Text className="font-semibold text-2xl capitalize">
                      {item.name.replace("_", " ")}
                    </Text>
                  </View>
                  <Text className="font-semibold text-gray-600">
                    {item.value}g
                  </Text>
                </View>
                <ProgressBar
                  progress={item.value}
                  color={getColor(item.name, item.value)}
                />
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => router.push("/nutrition-detail")}
            className="w-full flex-row items-center justify-between border border-gray-300 rounded-2xl px-6 py-6 bg-white"
          >
            <Text className="font-bold text-xl">
              Get More detail{"\n"}about nutrition
            </Text>
            <View className="w-14 h-14 bg-yellow-200 rounded-full items-center justify-center">
              <FeatherIcon name="arrow-right" size={28} color="#22223B" />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
