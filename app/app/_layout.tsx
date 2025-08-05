import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="pages/BufferPage" />
        <Stack.Screen name="pages/LandingPage" />
        <Stack.Screen name="pages/AddStock/productScanning"/>
        <Stack.Screen name="pages/RemoveStock/RemoveProductScanning" />
      </Stack>
    </>
  );
}
