// REACT
import React from "react";
import {
  View,
  Text,
  Modal as RNModal,
  Pressable,
  Animated,
  Easing,
} from "react-native";

// MODEL
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function HelpModal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  return (
    <RNModal
      visible={modalVisible}
      onRequestClose={handleClose}
      transparent
      animationType="none"
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          flex: 1,
        }}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/50"
          onPress={handleClose}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="bg-white w-[90%] max-w-[420px] rounded-lg overflow-hidden">
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <Text className="text-xl font-bold">{title}</Text>
                <Pressable
                  onPress={handleClose}
                  className="h-8 w-8 rounded-full items-center justify-center"
                >
                  <Text className="text-2xl text-gray-500">&times;</Text>
                </Pressable>
              </View>

              <View className="p-4">{children}</View>
            </View>
          </Pressable>
        </Pressable>
      </Animated.View>
    </RNModal>
  );
}
