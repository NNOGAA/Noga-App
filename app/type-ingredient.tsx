import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import {
  loadIngredients,
  addIngredientToStorage,
  removeIngredientFromStorage,
  clearIngredientsAndNutritionInfo,
  IngredientItem,
} from '../utils/TypeIngredients';
import { Header, AddIngredientModal, DeleteIngredientModal } from '../components/TypeIngredients';

export default function TypeIngredients() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [newIngredient, setNewIngredient] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]); // Only store names for UI
  const [ingredientObjects, setIngredientObjects] = useState<IngredientItem[]>([]); // Full objects for storage
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      setIsLoading(true);
      const loadedIngredients = await loadIngredients();
      
      // Store the full ingredient objects
      setIngredientObjects(loadedIngredients);
      
      // Extract just the names for UI rendering
      const ingredientNames = loadedIngredients.map(item => item.name);
      setIngredients(ingredientNames);

      setIsLoading(false);
    };

    fetchIngredients();
  }, []);

  const handleBackNavigation = () => {
    Alert.alert(
      'Go back to Home',
      'Are you sure you want to go back? Your ingredient list will be cleared.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: 'Yes, go back',
          style: 'destructive',
          onPress: async () => {
            const success = await clearIngredientsAndNutritionInfo();
            if (success) {
              router.push('/');
            } else {
              Alert.alert('Error', 'Failed to clear ingredients. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleAddIngredient = async () => {
    if (newIngredient.trim()) {
      const success = await addIngredientToStorage(newIngredient, ingredients);
      if (success) {
        // Update both the UI names array and the full objects array
        setIngredients([...ingredients, newIngredient.trim()]);
        
        // Add new ingredient object
        const newItem: IngredientItem = {
          name: newIngredient.trim(),
          status: "neutral",
          detail: "add by user"
        };
        setIngredientObjects([...ingredientObjects, newItem]);
        
        setNewIngredient('');
        setModalVisible(false);
      }
    }
  };

  const handleDeleteIngredient = async () => {
    if (ingredientToDelete) {
      const success = await removeIngredientFromStorage(ingredientToDelete);
      if (success) {
        // Update both arrays
        setIngredients(ingredients.filter(name => name !== ingredientToDelete));
        setIngredientObjects(ingredientObjects.filter(item => item.name !== ingredientToDelete));
        
        setDeleteModalVisible(false);
        setIngredientToDelete(null);
      }
    }
  };

  const confirmData = async () => {
    if (ingredients.length === 0) {
      Alert.alert('Required Field', 'Please add at least one ingredient to continue.', [
        { text: 'OK' },
      ]);
      return;
    }

    // Save the full objects to AsyncStorage
    await AsyncStorage.setItem('ingredients', JSON.stringify(ingredientObjects));
    router.push('/type-nutrition');
  };

  return (
    <View className="flex-1 bg-green-500">
      <Header onBackPress={handleBackNavigation} onMenuPress={() => console.log('menu pressed')} />

      <View className="flex-1 rounded-t-[40px] bg-white px-6 pb-4 pt-8">
        <View className="mb-2 w-full flex-row items-center justify-center gap-2">
          <Text className="mr-2 text-2xl font-bold text-green-500">Ingredients</Text>
          <View className="h-1 flex-1 rounded-full bg-green-500" />
        </View>
        <Text className="mb-4 font-semibold text-slate-500">Tap ingredient to delete</Text>

        {isLoading ? (
          <Text className="my-4 text-center text-gray-500">Loading ingredients...</Text>
        ) : ingredients.length === 0 ? (
          <Text className="my-4 text-center text-gray-500">
            No ingredients found. Add some ingredients to get started.
          </Text>
        ) : (
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}>
            {ingredients.map((item, idx) => (
              <Animatable.View key={idx} animation="fadeInUp" duration={400} delay={idx * 100}>
                <TouchableOpacity
                  onPress={() => {
                    setIngredientToDelete(item);
                    setDeleteModalVisible(true);
                  }}
                  className="rounded-lg border border-black px-4 py-2">
                  <Text className="font-medium text-black">{item}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </ScrollView>
        )}

        <View className="mt-auto w-full gap-2 pb-8">
          <TouchableOpacity
            className="w-full rounded-md border border-green-500 bg-white p-3"
            onPress={() => setModalVisible(true)}>
            <Text className="text-center text-lg font-semibold text-green-500">Add Ingredient</Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-full rounded-md bg-green-500 p-3" onPress={confirmData}>
            <Text className="text-center text-lg font-semibold text-white">Done!</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AddIngredientModal
        visible={modalVisible}
        ingredient={newIngredient} 
        onChangeText={setNewIngredient}
        onAdd={handleAddIngredient}
        onCancel={() => setModalVisible(false)}
      />

      <DeleteIngredientModal
        visible={deleteModalVisible}
        ingredient={ingredientToDelete}
        onDelete={handleDeleteIngredient}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </View>
  );
}