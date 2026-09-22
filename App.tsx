import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StatusBar as RNStatusBar, StyleSheet, View } from 'react-native';

import { DependenciesProvider } from './src/presentation/dependencies/DependenciesContext';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';
import { NavigationProvider } from './src/presentation/navigation/NavigationContext';
import { FavoritesProvider } from './src/presentation/screens/Favoritos/FavoriteContext';
import { useTheme } from './src/presentation/theme/useTheme';

// SafeAreaView salió del core de RN; esto es un reemplazo manual simple.
const TOP_INSET = Platform.select({ ios: 47, android: RNStatusBar.currentHeight ?? 0, default: 0 });
const BOTTOM_INSET = Platform.select({ ios: 24, default: 0 });

function Root() {
  const { palette, isDark } = useTheme();

  return (
    <View
      style={[
        styles.flex,
        {
          backgroundColor: palette.background,
          paddingTop: TOP_INSET,
          paddingBottom: BOTTOM_INSET,
        },
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <DependenciesProvider>
      <FavoritesProvider>
        <NavigationProvider>
          <Root />
        </NavigationProvider>
      </FavoritesProvider>
    </DependenciesProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
