import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="who" />
      <Stack.Screen options={{ headerShown: false }} name="Auth" />
    </Stack>
  );
}
