import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="food-type" />
        <Stack.Screen name="type-ingredient" />
        <Stack.Screen name="one-take-picture" />
        <Stack.Screen name="two-take-picture" />
        <Stack.Screen name="type-nutrition" />
        <Stack.Screen name="nutrition-general" />
        <Stack.Screen name="nutrition-detail" />
        <Stack.Screen name="substitute" />
      </Stack>
    </>
  );
}
