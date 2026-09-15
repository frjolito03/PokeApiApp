import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { DependenciesProvider } from './src/presentation/dependencies/DependenciesContext';
import { NavigationProvider } from './src/presentation/navigation/NavigationContext';
import { PokemonListScreen } from './src/presentation/screens/PokemonListScreen/PokemonListScreen';
import { useTheme } from './src/presentation/theme/useTheme';

function Root() {
  const { palette, isDark } = useTheme();

  return (
    <View style={[styles.flex, { backgroundColor: palette.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <PokemonListScreen />
    </View>
  );
}

export default function App() {
  return (
    <DependenciesProvider>
      <NavigationProvider>
        <Root />
      </NavigationProvider>
    </DependenciesProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
