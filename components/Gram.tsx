import { View, Text } from "react-native";
import clsx from "clsx";

type Props = {
  gram: number;
  color: string;
};

export default function Gram({ gram, color }: Props) {
  return (
    <View
      className={clsx("rounded-lg px-2 py-1 w-20 items-center border", {
        "bg-green-100 border-green-500": color === "green",
        "bg-yellow-100 border-yellow-500": color === "yellow",
        "bg-red-100 border-red-500": color === "red",
      })}
    >
      <Text
        className={clsx("font-medium", {
          "text-green-700": color === "green",
          "text-orange-400": color === "yellow",
          "text-red-700": color === "red",
        })}
      >
        {gram}g
      </Text>
    </View>
  );
}
