import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import FeatherIcon from 'react-native-vector-icons/Feather';

const AddIngredientButton: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="mb-4 w-full flex-row items-center justify-center rounded-md border border-green-500 bg-white p-3"
      onPress={onPress}>
      <FeatherIcon name="plus-circle" size={20} color="#5FA55A" style={{ marginRight: 8 }} />
      <Text className="text-center text-lg font-semibold text-green-500">Add Ingredient</Text>
    </TouchableOpacity>
  );
};

export const DoneButton: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="mt-auto w-full flex-row items-center justify-center rounded-md bg-green-500 p-3"
      onPress={onPress}>
      <FeatherIcon name="check-circle" size={20} color="white" style={{ marginRight: 8 }} />
      <Text className="text-center text-lg font-semibold text-white">Done!</Text>
    </TouchableOpacity>
  );
};

export const Header: React.FC<{
  onBackPress: () => void;
  onMenuPress: () => void;
}> = ({ onBackPress, onMenuPress }) => {
  return (
    <View className="w-full flex-row items-center justify-between px-4 pb-6 pt-12">
      <TouchableOpacity
        className="h-10 w-10 items-center justify-center rounded-full border border-white"
        onPress={onBackPress}>
        <FeatherIcon name="arrow-left" size={20} color="white" />
      </TouchableOpacity>

      <Text className="text-center text-3xl font-bold text-white">Type Ingredients</Text>

      <TouchableOpacity
        onPress={onMenuPress}
        className="h-10 w-10 items-center justify-center rounded-full border border-white">
        <FeatherIcon name="more-vertical" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export const IngredientsList: React.FC<{
  ingredients: string[];
  isLoading: boolean;
  onDeleteItem: (item: string) => void;
}> = ({ ingredients, isLoading, onDeleteItem }) => {
  if (isLoading) {
    return <Text className="my-4 text-center text-gray-500">Loading ingredients...</Text>;
  }

  if (ingredients.length === 0) {
    return (
      <Text className="my-4 text-center text-gray-500">
        No ingredients found. Add some ingredients to get started.
      </Text>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: 10,
      }}>
      {ingredients.map((item, idx) => (
        <Animatable.View key={idx} animation="fadeInUp" duration={400} delay={idx * 100}>
          <TouchableOpacity
            onPress={() => onDeleteItem(item)}
            className="rounded-lg border border-brand-dark-blue px-3 py-2">
            <Text className="border-brand-dark-blue font-medium text-brand-dark-blue">{item}</Text>
          </TouchableOpacity>
        </Animatable.View>
      ))}
    </ScrollView>
  );
};

export const AddIngredientModal: React.FC<{
  visible: boolean;
  ingredient: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  onAdd: () => void;
}> = ({ visible, ingredient, onChangeText, onCancel, onAdd }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 items-center justify-center bg-black/40 px-4">
        <View className="w-full gap-4 rounded-xl bg-white p-4">
          <Text className="text-center text-lg font-bold">Add New Ingredient</Text>
          <TextInput
            className="rounded-md border border-gray-300 px-3 py-4"
            placeholder="Enter new ingredient"
            value={ingredient}
            onChangeText={onChangeText}
          />
          <View className="flex-row justify-between">
            <TouchableOpacity onPress={onCancel}>
              <Text className="text-lg font-bold text-red-500">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAdd}>
              <Text className="text-lg font-bold text-[#5FA55A]">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const DeleteIngredientModal: React.FC<{
  visible: boolean;
  ingredient: string | null;
  onDelete: () => void;
  onCancel: () => void;
}> = ({ visible, ingredient, onDelete, onCancel }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 items-center justify-center bg-black/40 px-4">
        <View className="w-full gap-4 rounded-xl bg-white p-4">
          <Text className="text-center text-lg font-bold">Delete Ingredient</Text>
          <Text className="text-center">Are you sure you want to delete "{ingredient}"?</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity onPress={onCancel}>
              <Text className="text-lg font-bold text-blue-500">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Text className="text-lg font-bold text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const ContentContainer: React.FC<{
  children: React.ReactNode;
  onAddIngredient: () => void;
  onDone: () => void;
}> = ({ children, onAddIngredient, onDone }) => {
  return (
    <View className="w-full flex-1 gap-4 rounded-t-3xl bg-white p-6">
      <AddIngredientButton onPress={onAddIngredient} />

      <View className="flex-row items-center gap-2">
        <Text className="text-xl font-bold text-brand-dark-blue">Ingredients</Text>
        <View className="h-1 flex-1 rounded-full bg-brand-dark-blue"></View>
      </View>

      {children}

      <DoneButton onPress={onDone} />
    </View>
  );
};
