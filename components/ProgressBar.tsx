import React from "react";
import { View } from "react-native";

type Props = {
  progress: number;
  color: string;
  className?: string;
};

export default function ProgressBar({
  progress,
  color,
  className = "",
}: Props) {
  return (
    <View className={`w-full h-1 bg-gray-200 rounded-full ${className}`}>
      <View
        className={`h-full rounded-full`}
        style={{
          width: `${progress}%`,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
