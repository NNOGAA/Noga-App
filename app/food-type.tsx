import React from 'react';
import { View, Text } from 'react-native';
import { HelpModal, ChoiceButton, HelpButton, Divider } from '../components/FoodType';
import { useRouter } from 'expo-router';

export default function FoodType() {
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <View className="flex-1 items-center justify-center gap-4 bg-white px-8">
        <Text className="text-center text-3xl font-bold">
          What kind of food are you trying to analyze?
        </Text>
        <View className="w-full items-center justify-center gap-2 px-8">
          <ChoiceButton
            title="Packaged Goods"
            onPress={() => router.push('/two-take-picture')}
          />
          <ChoiceButton
            title="Prepared Foods"
            onPress={() => router.push('/two-take-picture')}
          />
          <HelpButton title="Help?" onPress={() => setShowModal(true)} />
        </View>
      </View>

      <HelpModal isOpen={showModal} onClose={() => setShowModal(false)} title="Help">
        <View className="gap-2">
          <View>
            <Text className="text-brand-green text-lg font-bold">Packaged Goods</Text>
            <Text className="text-base text-gray-700">
              For pre-packaged foods with nutrition labels
            </Text>
          </View>

          <Divider variant="secondary" my={2} />

          <View>
            <Text className="text-brand-green text-lg font-bold">Prepared Foods</Text>
            <Text className="text-base text-gray-700">For restaurant meals or homemade dishes</Text>
          </View>
        </View>
      </HelpModal>
    </>
  );
}
