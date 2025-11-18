import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';

export const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const handleButton = async (targetPage: string) => {
  const randomString = generateRandomString(50);

  try {
    await AsyncStorage.setItem("sessionId", randomString);
    await AsyncStorage.removeItem("ingredients");
    await AsyncStorage.removeItem("nutrition_info");
    await AsyncStorage.removeItem("nutrition_general");

    router.push(targetPage as any);
  } catch (error) {
    console.error("Error storing random string in AsyncStorage:", error);
  }
};