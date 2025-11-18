import React from 'react';
import { View } from 'react-native';

interface DividerProps {
  className?: string;
  color?: string;
  height?: number;
}

export default function Divider({ className, color = '#E5E7EB', height = 1 }: DividerProps) {
  return (
    <View
      className={className}
      style={{
        height,
        backgroundColor: color,
        width: '100%',
      }}
    />
  );
}
