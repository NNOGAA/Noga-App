import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useRouter } from 'expo-router';

import {
  NutritionItemInput,
  AddNewFieldModal,
  LoadingOverlay,
} from "../components/TypeNutrition";
import {
  NutritionItem,
  MEASUREMENT_TYPES,
  createNutritionItem,
  saveNutritionData,
  loadNutritionData,
  getUnitLabel,
  handleNutritionSubmission,
  checkDuplicateField,
} from "../utils/TypeNutrition";
import { DoneButton } from "../components/TypeIngredients";

const NutritionTracker = () => {
  const router = useRouter();
  const [nutritionItems, setNutritionItems] = useState<NutritionItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("gram");
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});
  const inputPositions = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    initializeData();

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const initializeData = async () => {
    const data = await loadNutritionData();
    setNutritionItems(data);
  };

  const handleOutsidePress = () => {
    if (dropdownVisible !== null) {
      setDropdownVisible(null);
    }
  };

  useEffect(() => {
    if (currentFocus && scrollViewRef.current) {
      const position = inputPositions.current[currentFocus] || 0;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: position - 100,
          animated: true,
        });
      }, 100);
    }
  }, [currentFocus]);

  const handleInputChange = (index: number, value: string) => {
    const updatedItems = [...nutritionItems];
    updatedItems[index].nilai = value;
    setNutritionItems(updatedItems);
  };

  const handleTypeChange = (index: number, type: string) => {
    const updatedItems = [...nutritionItems];
    updatedItems[index].type = type;
    setNutritionItems(updatedItems);
    setDropdownVisible(null);
    saveNutritionData(updatedItems);
  };

  const measureInputPosition = (key: string, y: number) => {
    inputPositions.current[key] = y;
  };

  const addNewField = async () => {
    if (newFieldName.trim() === "") return;

    if (checkDuplicateField(nutritionItems, newFieldName)) {
      Alert.alert(
        "Duplicate Field",
        `"${newFieldName}" already exists in your nutrition list.`,
        [{ text: "OK" }]
      );
      return;
    }

    const newItem = createNutritionItem(newFieldName, "0", newFieldType, "");
    const updatedItems = [...nutritionItems, newItem];

    setNutritionItems(updatedItems);
    await saveNutritionData(updatedItems);

    setNewFieldName("");
    setNewFieldType("gram");
    setModalVisible(false);
  };

  const iconMap: Record<string, any> = {
    "Serving Size": require("../assets/icons/nutrition/serving-size.png"),
    Calories: require("../assets/icons/nutrition/calories.png"),
    "Total Calories": require("../assets/icons/nutrition/calories.png"),
    "Total Fat": require("../assets/icons/nutrition/total-fat.png"),
    "Saturated Fat": require("../assets/icons/nutrition/saturated-fat.png"),
    "Total Carbohydrate": require("../assets/icons/nutrition/carbs.png"),
    Sugar: require("../assets/icons/nutrition/sugar.png"),
    Protein: require("../assets/icons/nutrition/protein.png"),
    Default: require("../assets/icons/nutrition/star.png"), // STAR
  };

  const handleDone = async () => {
    const updatedItems = await saveNutritionData(nutritionItems);
    setNutritionItems(updatedItems);

    setIsLoading(true);
    const result = await handleNutritionSubmission(updatedItems);
    setIsLoading(false);

    if (result.success) {
      router.push("/nutrition-general");
    } else {
      Alert.alert("Error", "Something went wrong, please try again.");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <View style={{ flex: 1 }}>
            <View className="w-full px-4 pt-6 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full border border-black justify-center items-center"
              >
                <FeatherIcon name="arrow-left" size={20} color="black" />
              </TouchableOpacity>

              <Text className="text-3xl text-black text-center font-bold">
                Type Nutrition
              </Text>

              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="w-10 h-10 rounded-full border border-black justify-center items-center"
              >
                <FeatherIcon name="plus" size={20} color="black" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, marginTop: 24 }}>
              <ScrollView
                ref={scrollViewRef}
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingHorizontal: 24,
                  paddingBottom: 120,
                }}
                keyboardShouldPersistTaps="handled"
                scrollEventThrottle={16}
                onScrollBeginDrag={handleOutsidePress}
              >
                {nutritionItems.map((item, idx) => (
                  <NutritionItemInput
                    key={`${item.nama}`}
                    item={item}
                    index={idx}
                    iconMap={iconMap}
                    inputRefs={inputRefs}
                    dropdownVisible={dropdownVisible}
                    measurementTypes={MEASUREMENT_TYPES}
                    onInputChange={handleInputChange}
                    onTypeChange={handleTypeChange}
                    setDropdownVisible={setDropdownVisible}
                    setCurrentFocus={setCurrentFocus}
                    getUnitLabel={getUnitLabel}
                    measureInputPosition={measureInputPosition}
                  />
                ))}
              </ScrollView>
            </View>

            <AddNewFieldModal
              visible={modalVisible}
              newFieldName={newFieldName}
              newFieldType={newFieldType}
              measurementTypes={MEASUREMENT_TYPES}
              onClose={() => setModalVisible(false)}
              onAdd={addNewField}
              setNewFieldName={setNewFieldName}
              setNewFieldType={setNewFieldType}
            />

            <LoadingOverlay visible={isLoading} />

            <View
              style={{
                position: "absolute",
                bottom: 20,
                left: 24,
                right: 24,
                zIndex: 999,
              }}
            >
              <DoneButton onPress={handleDone} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default NutritionTracker;
