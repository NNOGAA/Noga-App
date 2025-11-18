import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface MeasurementType {
  label: string;
  value: string;
}

interface NutritionItemInputProps {
  item: {
    nama: string;
    nilai: string;
    type: string;
  };
  index: number;
  iconMap: Record<string, any>;
  inputRefs: React.MutableRefObject<{ [key: string]: TextInput | null }>;
  dropdownVisible: string | null;
  measurementTypes: MeasurementType[];
  onInputChange: (index: number, value: string) => void;
  onTypeChange: (index: number, type: string) => void;
  setDropdownVisible: (value: string | null) => void;
  setCurrentFocus: (value: string) => void;
  getUnitLabel: (type: string) => string;
  measureInputPosition: (key: string, y: number) => void;
}

export const NutritionItemInput: React.FC<NutritionItemInputProps> = ({
  item,
  index,
  iconMap,
  inputRefs,
  dropdownVisible,
  measurementTypes,
  onInputChange,
  onTypeChange,
  setDropdownVisible,
  setCurrentFocus,
  getUnitLabel,
  measureInputPosition,
}) => {
  return (
    <TouchableOpacity
      key={`${item.nama}-${index}`}
      activeOpacity={0.8}
      onPress={() => {
        setCurrentFocus(item.nama);
        inputRefs.current[item.nama]?.focus();
      }}
      onLayout={(event) => {
        const { y } = event.nativeEvent.layout;
        measureInputPosition(item.nama, y);
      }}
      className="mb-5"
      style={{ zIndex: 1000 - index }}>
      <View className="z-10 flex-row items-center justify-between px-2">
        <View className="flex-1 flex-row items-center">
          <Image
            source={iconMap[item.nama] || iconMap['Default']}
            className="mr-4 h-7 w-7"
            resizeMode="contain"
          />
          <Text className="w-28 font-[Poppins] text-base text-gray-800">{item.nama}</Text>
        </View>

        <View className="flex-row" style={{ position: 'relative', zIndex: index }}>
          <TextInput
            ref={(ref) => {
              inputRefs.current[item.nama] = ref;
            }}
            value={item.nilai}
            onChangeText={(text) => onInputChange(index, text)}
            onFocus={() => setCurrentFocus(item.nama)}
            keyboardType="numeric"
            className="h-[44px] w-[80px] rounded-l-lg border border-gray-300 bg-slate-100 text-center font-[Poppins] text-sm"
          />
          <TouchableOpacity
            onPress={() => setDropdownVisible(dropdownVisible === item.nama ? null : item.nama)}
            className="h-[44px] w-[55px] flex-row items-center justify-center rounded-r-lg border-b border-r border-t border-gray-300 bg-slate-100 px-3">
            <Text className="pr-1 text-sm text-gray-700">{getUnitLabel(item.type)}</Text>
            <FeatherIcon name="chevron-down" size={16} color="#555" />
          </TouchableOpacity>
        </View>
      </View>

      {dropdownVisible === item.nama && (
        <View className="absolute right-0 top-12 z-20 w-[130px] rounded-md border border-gray-200 bg-white shadow-lg">
          {measurementTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => onTypeChange(index, type.value)}
              className={`px-3 py-2 ${item.type === type.value ? 'bg-slate-100' : ''}`}>
              <Text className="text-sm">{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

interface AddNewFieldModalProps {
  visible: boolean;
  newFieldName: string;
  newFieldType: string;
  measurementTypes: MeasurementType[];
  onClose: () => void;
  onAdd: () => void;
  setNewFieldName: (value: string) => void;
  setNewFieldType: (value: string) => void;
}

export const AddNewFieldModal: React.FC<AddNewFieldModalProps> = ({
  visible,
  newFieldName,
  newFieldType,
  measurementTypes,
  onClose,
  onAdd,
  setNewFieldName,
  setNewFieldType,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 items-center justify-center bg-black/40 px-4">
        <View className="w-full gap-4 rounded-xl bg-white p-4">
          <Text className="text-center text-lg font-bold">Add New Nutrition Field</Text>
          <TextInput
            className="mb-2 rounded-md border border-gray-300 px-3 py-4"
            placeholder="Enter field name"
            value={newFieldName}
            onChangeText={setNewFieldName}
          />

          <Text className="mb-1 text-sm text-gray-600">Select measurement type:</Text>
          <View className="overflow-hidden rounded-md border border-gray-300">
            {measurementTypes.map((type, idx) => (
              <TouchableOpacity
                key={type.value}
                onPress={() => setNewFieldType(type.value)}
                className={`px-3 py-3 ${newFieldType === type.value ? 'bg-slate-100' : ''} ${
                  idx !== measurementTypes.length - 1
                    ? 'border-b border-gray-200'
                    : ''
                }`}>
                <Text className="text-sm">{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-2 flex-row justify-between">
            <TouchableOpacity onPress={onClose}>
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

interface LoadingOverlayProps {
  visible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}>
      <View className="items-center rounded-xl bg-white p-6">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-4 text-lg font-medium">Processing your data...</Text>
        <Text className="mt-2 text-gray-500">This may take a few seconds</Text>
      </View>
    </View>
  );
};
