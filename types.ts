export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  reminder?: number;
  reminderNotified?: boolean;
}

export interface ThemeColors {
  name: string;
  appBg: string;
  containerBg: string; // For the header area/wrapper if needed
  textMain: string;
  textSec: string;
  accent: string;
  
  // Input specific
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  inputShadow: string;
  
  // Item specific
  itemBg: string;
  itemBorder: string;
  itemText: string;
  itemCompletedText: string;
  
  // Button specific
  buttonMain: string;
  buttonMainText: string;
  buttonSecondary: string;
  
  // Global styles
  font: string;
  radius: string;
}
