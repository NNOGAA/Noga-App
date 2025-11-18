// REACT 
import Collapsible from "react-native-collapsible";
import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import FeatherIcon from "react-native-vector-icons/Feather";

type Props = {
  title: string;
  classification: string;
  detail: string;
  defaultCollapsed?: boolean;
};

export default function SummaryAccordion({
  title,
  classification,
  detail,
}: Props) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View className="border rounded-lg border-gray-200 overflow-hidden">
      <TouchableOpacity
        onPress={() => setCollapsed(!collapsed)}
        className="p-3 active:bg-gray-50"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center flex-1">
            {classification === "good" && (<FeatherIcon name="check-circle" size={20} color="#22C55E" />)}
            {classification === "normal" && (<FeatherIcon name="info" size={20} color="#F59E0B" />)}
            {classification === "bad" && (<FeatherIcon name="alert-circle" size={20} color="#EF4444" />)}
            <Text className="font-medium flex-1">{title}</Text>
          </View>
          <FeatherIcon
            name={collapsed ? "chevron-down" : "chevron-up"}
            size={20}
            color="#6B7280"
          />
        </View>
      </TouchableOpacity>

      <Collapsible collapsed={collapsed}>
        <View className="px-3 pb-3 pt-1">
          <Text className="text-gray-600 leading-5">{detail}</Text>
        </View>
      </Collapsible>
    </View>
  );
}
