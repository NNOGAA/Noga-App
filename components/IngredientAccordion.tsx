import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import FeatherIcon from "react-native-vector-icons/Feather";
import Collapsible from "react-native-collapsible";
import clsx from "clsx";

type Props = {
  name: string;
  detail: string;
  classification: "green" | "yellow" | "red";
  key: number;
};

export default function IngredientAccordion({
  name,
  detail,
  classification,
}: Props) {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <View
      className={clsx("border rounded-lg  overflow-hidden p-3", {
        "bg-green-100 border-green-500": classification === "green",
        "bg-yellow-100 border-yellow-500": classification === "yellow",
        "bg-red-100 border-red-500": classification === "red",
      })}
    >
      <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
        <View className="flex-row justify-between">
          <Text
            className={clsx("font-medium", {
              "text-green-700": classification === "green",
              "text-orange-400": classification === "yellow",
              "text-red-700": classification === "red",
            })}
          >
            {name}
          </Text>
          {collapsed ? (
            <FeatherIcon name="chevron-down" size={20} color="#6B7280" />
          ) : (
            <FeatherIcon name="chevron-up" size={20} color="#6B7280" />
          )}
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={collapsed}>
        <View>
          <Text className="text-gray-800 leading-5">{detail}</Text>
        </View>
      </Collapsible>
    </View>
  );
}
