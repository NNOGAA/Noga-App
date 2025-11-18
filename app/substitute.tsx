import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const responsiveFontSize = (size: number): number => (width / 375) * size;

const dynamicFontSizeForText = (text: string, baseSize: number): number => {
  const maxLength = 100;
  const textLength = text.length;
  return textLength > maxLength
    ? responsiveFontSize(baseSize * (maxLength / textLength))
    : responsiveFontSize(baseSize);
};

const dynamicFontSizeForNumber = (number: number, baseSize: number): number => {
  const maxLength = 4;
  const numberLength = number.toString().length;
  return numberLength > maxLength
    ? responsiveFontSize(baseSize * (maxLength / numberLength))
    : responsiveFontSize(baseSize);
};

const RecipeScreen = () => {
  const recipeData = {
    name: 'Healthy Pizza',
    time: 10,
    ingredientsCount: 7,
    calories: 300,
    ingredients: ['Water', 'Sugar', 'Salt', 'All-Purpose Flour', 'Oil', 'Bread', 'Minced Beef'],
    steps: [
      'Nunc molestie orci in mauris pretium ullamcorper. Vivamus et gravida felis. Nam bibendum libero turpis, ut facilisis justo hendrerit in.',
      'Nunc molestie orci in mauris pretium ullamcorper. Vivamus et gravida felis. Nam bibendum libero turpis, ut facilisis justo hendrerit in.',
      'Nunc molestie orci in mauris pretium ullamcorper. Vivamus et gravida felis. Nam bibendum libero turpis, ut facilisis justo hendrerit in.',
      'Nunc molestie orci in mauris pretium ullamcorper. Vivamus et gravida felis. Nam bibendum libero turpis, ut facilisis justo hendrerit in.',
    ],
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView>
          {/* Header */}
          <View className="flex-row items-center justify-between rounded-b-3xl bg-white px-4 py-3">
            {/* Tombol Kembali */}
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full border border-gray-500">
              <Feather name="arrow-left" size={responsiveFontSize(20)} color="#4B5563" />
            </TouchableOpacity>

            {/* Judul */}
            <Text
              style={{
                fontSize: responsiveFontSize(25),
                fontWeight: '600',
                color: '#000',
                fontFamily: 'Poppins-bold',
              }}>
              Substitute Recipe
            </Text>

            {/* Tombol Menu */}
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full border border-gray-500">
              <Feather name="more-horizontal" size={responsiveFontSize(20)} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Recipe Name */}
          <View className="mx-4 my-1 mt-4 items-center rounded-2xl bg-[#DEFFE3] p-3">
            <Text
              style={{
                fontSize: dynamicFontSizeForText(recipeData.name, 24),
                fontWeight: 'bold',
                color: '#20C127',
                fontFamily: 'Poppin-bold',
              }}>
              {recipeData.name}
            </Text>
          </View>

          {/* Recipe Info */}
          <View className="flex-row justify-between gap-x-4 px-4 py-3">
            {/* Kotak Waktu */}
            <View className="h-32 flex-1 flex-col items-center justify-center rounded-2xl bg-[#DEFFE3] p-5">
              <Text
                style={{
                  fontSize: dynamicFontSizeForNumber(recipeData.time, 40),
                  fontWeight: 'bold',
                  color: '#20C127',
                  textAlign: 'center',
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}>
                {recipeData.time}
              </Text>
              <Text
                style={{
                  fontSize: responsiveFontSize(14),

                  fontWeight: '500',
                  color: '#20C127',
                  marginTop: 4,
                  fontFamily: 'poppins-bold',
                }}>
                Minutes
              </Text>
            </View>

            {/* Kotak Bahan */}
            <View className="h-32 flex-1 flex-col items-center justify-center rounded-2xl bg-[#DEFFE3] p-5">
              <Text
                style={{
                  fontSize: dynamicFontSizeForNumber(recipeData.ingredientsCount, 40),
                  fontWeight: 'bold',
                  color: '#20C127',
                  textAlign: 'center',
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}>
                {recipeData.ingredientsCount}
              </Text>
              <Text
                style={{
                  fontSize: responsiveFontSize(13),
                  fontWeight: '500',
                  color: '#20C127',
                  marginTop: 4,
                  fontFamily: 'Poppins-bold',
                }}>
                Ingredients
              </Text>
            </View>

            {/* Kotak Kalori */}
            <View className="h-32 flex-1 flex-col items-center justify-center rounded-2xl bg-[#DEFFE3] p-5">
              <Text
                style={{
                  fontSize: dynamicFontSizeForNumber(recipeData.calories, 40),
                  fontWeight: 'bold',
                  color: '#20C127',
                  textAlign: 'center',
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}>
                {recipeData.calories}
              </Text>
              <Text
                style={{
                  fontSize: responsiveFontSize(14),
                  fontWeight: '500',
                  color: '#20C127',
                  marginTop: 4,
                  fontFamily: 'Poppins-bold',
                }}>
                Calories
              </Text>
            </View>
          </View>
          {/* Ingredients */}
          <View className="p-4">
            <Text
              style={{
                fontSize: responsiveFontSize(24),
                fontWeight: 'bold',
                color: '#000',
                marginBottom: 8,
                fontFamily: 'Poppins-bold',
              }}>
              Ingredients
            </Text>
            <View className="px-4">
              {recipeData.ingredients.map((ingredient, index) => (
                <View key={index} className="mb-1 flex-row items-center">
                  <View className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                  <Text
                    style={{
                      fontSize: responsiveFontSize(16),
                      fontWeight: 'bold',
                      color: '#000',
                      fontFamily: 'Poppins-bold',
                    }}>
                    {ingredient}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Steps */}
          <View className="p-4">
            <Text
              style={{
                fontSize: responsiveFontSize(24),
                fontWeight: 'bold',
                color: '#000',
                marginBottom: 8,
                fontFamily: 'Poppins-bold',
              }}>
              Steps
            </Text>
            <View className="px-4">
              {recipeData.steps.map((step, index) => (
                <View key={index} className="mb-6 flex-row">
                  <Text
                    style={{
                      fontSize: responsiveFontSize(20),
                      fontWeight: 'bold',
                      color: '#000',
                      marginRight: 8,
                      fontFamily: 'Poppins-bold',
                    }}>
                    {index + 1}.
                  </Text>
                  <View className="flex-1">
                    <Text
                      style={{
                        fontSize: responsiveFontSize(14),
                        color: '#4B5563',
                        fontFamily: 'Poppins-bold',
                      }}>
                      {step}
                    </Text>
                    <View
                      style={{
                        height: 3,
                        backgroundColor: '#20C127',
                        marginTop: 5,
                        marginBottom: 1,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RecipeScreen;
