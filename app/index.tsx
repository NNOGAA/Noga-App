import { useCallback } from "react";
import { View, Text, Image, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { handleButton } from "@/lib/helpers";

export default function Home() {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Exit App", "Are you sure you want to exit the app?", [
          { text: "Cancel", style: "cancel", onPress: () => null },
          { text: "Yes", style: "destructive", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove();
    }, [])
  );
  return (
    <View className="flex-1 bg-white">
      <View className="mt-4 flex-grow items-center justify-start pb-10">
        <View className="mb-5 items-center">
          <Image
            source={require('../assets/images/logo.png')}
            className="h-28 w-28"
            resizeMode="contain"
          />
        </View>
        <View className="mb-5 items-center">
          <Image
            source={require('../assets/images/buah.png')}
            className="h-[300px] w-[300px]"
            resizeMode="contain"
          />
          <Text className="mb-0 text-center text-3xl font-bold">
            Take a Picture or Type{'\n'}
            the Ingredients of a {'\n'}
            Food to Analyze
          </Text>
          <Text className="mb-2.5 text-center text-3xl font-bold text-green-600">Health</Text>
          <Text className="mb-5 text-center text-base text-gray-500">
            Stay healthy by tracking every meal.
          </Text>
          <TouchableOpacity
            className="mb-3 h-[60px] w-[250px] flex-row items-center justify-center rounded-3xl bg-[#1A1A40] shadow-md"
            onPress={() => handleButton('/type-ingredient')}>
            <Image
              source={require('../assets/icons/ui/keyboard.png')}
              className="h-6 w-6"
              tintColor="white"
            />
            <Text className="text-md ml-2.5 font-bold text-white">Type Ingredients</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-[60px] w-[250px] flex-row items-center justify-center rounded-3xl bg-[#4CAF50] shadow-md"
            onPress={() => handleButton('/food-type')}>
            <Image
              source={require('../assets/icons/ui/camera.png')}
              className="h-6 w-6"
              tintColor="white"
            />
            <Text className="text-md ml-2.5 font-bold text-white">Take a Picture</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}