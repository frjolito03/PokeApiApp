export interface ThemePalette {
  background: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  text: string;
  textSecondary: string;
  border: string;
  danger: string;
  warning: string;
  skeleton: string;
}

export const lightPalette: ThemePalette = {
  background: '#F4F5F7',
  surface: '#FFFFFF',
  surfaceAlt: '#ECEFF4',
  primary: '#DC0A2D',
  text: '#1B1B1F',
  textSecondary: '#5F6368',
  border: '#E1E3E8',
  danger: '#C0392B',
  warning: '#B7791F',
  skeleton: '#E4E6EB',
};

export const darkPalette: ThemePalette = {
  background: '#121214',
  surface: '#1E1F23',
  surfaceAlt: '#26272C',
  primary: '#FF5C72',
  text: '#F2F2F3',
  textSecondary: '#A5A7AD',
  border: '#303136',
  danger: '#FF6B5E',
  warning: '#F2C14E',
  skeleton: '#2C2D32',
};
