// import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { useColorScheme } from 'react-native';

// import { AnimatedSplashOverlay } from '@/components/animated-icon';
// import AppTabs from '@/components/app-tabs';

// SplashScreen.preventAutoHideAsync();

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <AnimatedSplashOverlay />
//       <AppTabs />
//     </ThemeProvider>
//   );
// }


import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#38bdf8', 
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#f8fafc',
        },
        contentStyle: {
          backgroundColor: '#0f172a', 
        },
      }}
    >
      {/* Home Task List Screen */}
      <Stack.Screen
        name="index"
        options={{
          title: 'Task Master',
        }}
      />
      {/* Task Details Screen */}
      <Stack.Screen
        name="details"
        options={{
          title: 'Task Details',
        }}
      />
    </Stack>
  );
}