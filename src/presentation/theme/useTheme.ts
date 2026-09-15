import { useColorScheme } from 'react-native';

import { darkPalette, lightPalette, ThemePalette } from './colors';

export interface Theme {
  palette: ThemePalette;
  isDark: boolean;
}

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return { palette: isDark ? darkPalette : lightPalette, isDark };
}
