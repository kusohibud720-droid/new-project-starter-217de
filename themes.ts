import { ThemeColors } from './types';

export const themes: Record<string, ThemeColors> = {
  zen: {
    name: 'Zen',
    appBg: 'bg-gray-50',
    containerBg: '',
    textMain: 'text-gray-900',
    textSec: 'text-gray-500',
    accent: 'text-gray-900',
    
    inputBg: 'bg-white',
    inputBorder: 'border-transparent',
    inputText: 'text-gray-800',
    inputPlaceholder: 'placeholder-gray-400',
    inputShadow: 'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]',
    
    itemBg: 'bg-white',
    itemBorder: 'border-gray-100',
    itemText: 'text-gray-700',
    itemCompletedText: 'text-gray-400',
    
    buttonMain: 'bg-gray-900 hover:bg-gray-800',
    buttonMainText: 'text-white',
    buttonSecondary: 'text-gray-400 hover:bg-gray-100',
    
    font: 'font-sans',
    radius: 'rounded-2xl',
  },
  cyberpunk: {
    name: 'Cyberpunk',
    appBg: 'bg-slate-900',
    containerBg: '',
    textMain: 'text-yellow-400',
    textSec: 'text-cyan-400',
    accent: 'text-pink-500',
    
    inputBg: 'bg-slate-800',
    inputBorder: 'border-b-2 border-yellow-400',
    inputText: 'text-cyan-300',
    inputPlaceholder: 'placeholder-slate-500',
    inputShadow: 'shadow-[0_0_15px_rgba(250,204,21,0.2)]',
    
    itemBg: 'bg-slate-800/80',
    itemBorder: 'border-l-4 border-cyan-400',
    itemText: 'text-gray-200',
    itemCompletedText: 'text-slate-600',
    
    buttonMain: 'bg-yellow-400 hover:bg-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.5)]',
    buttonMainText: 'text-black font-bold tracking-wider',
    buttonSecondary: 'text-slate-500 hover:text-cyan-400 hover:bg-slate-800',
    
    font: 'font-mono',
    radius: 'rounded-none',
  },
  synthwave: {
    name: 'Synthwave',
    appBg: 'bg-[#2b213a]', // Deep purple base
    containerBg: '',
    textMain: 'text-[#ff71ce]', // Neon Pink
    textSec: 'text-[#01cdfe]', // Neon Blue
    accent: 'text-[#05ffa1]', // Neon Green
    
    inputBg: 'bg-[#241b35]',
    inputBorder: 'border-2 border-[#b967ff]',
    inputText: 'text-[#fffb96]', // Soft Yellow
    inputPlaceholder: 'placeholder-[#b967ff]/50',
    inputShadow: 'shadow-[0_0_15px_rgba(185,103,255,0.4)]',
    
    itemBg: 'bg-gradient-to-r from-[#241b35] to-[#2b213a]',
    itemBorder: 'border border-[#ff71ce]/30',
    itemText: 'text-white shadow-[0_0_2px_rgba(255,255,255,0.3)]',
    itemCompletedText: 'text-[#b967ff]',
    
    buttonMain: 'bg-gradient-to-r from-[#01cdfe] to-[#b967ff]',
    buttonMainText: 'text-white font-bold',
    buttonSecondary: 'text-[#05ffa1] hover:bg-[#ffffff]/10',
    
    font: 'font-sans tracking-wide',
    radius: 'rounded-xl',
  },
  matrix: {
    name: 'Matrix',
    appBg: 'bg-black',
    containerBg: '',
    textMain: 'text-[#00ff41]', // Terminal Green
    textSec: 'text-[#008f11]', // Darker Green
    accent: 'text-[#00ff41]',
    
    inputBg: 'bg-black',
    inputBorder: 'border border-[#003b00]',
    inputText: 'text-[#00ff41]',
    inputPlaceholder: 'placeholder-[#003b00]',
    inputShadow: '',
    
    itemBg: 'bg-black',
    itemBorder: 'border border-[#00ff41]/30',
    itemText: 'text-[#00ff41]',
    itemCompletedText: 'text-[#003b00]',
    
    buttonMain: 'bg-[#003b00] hover:bg-[#008f11] border border-[#00ff41]',
    buttonMainText: 'text-[#00ff41]',
    buttonSecondary: 'text-[#003b00] hover:text-[#00ff41]',
    
    font: 'font-mono',
    radius: 'rounded-none',
  },
  retro: {
    name: '98',
    appBg: 'bg-[#008080]',
    containerBg: 'bg-[#c0c0c0] p-6 border-2 border-white shadow-[2px_2px_0_0_#000]',
    textMain: 'text-black',
    textSec: 'text-gray-600',
    accent: 'text-blue-800',
    
    inputBg: 'bg-white',
    inputBorder: 'border-2 border-gray-500 shadow-[inset_2px_2px_0_0_#000]',
    inputText: 'text-black',
    inputPlaceholder: 'placeholder-gray-400',
    inputShadow: '',
    
    itemBg: 'bg-[#c0c0c0]',
    itemBorder: 'border-2 border-b-black border-r-black border-t-white border-l-white',
    itemText: 'text-black',
    itemCompletedText: 'text-gray-500',
    
    buttonMain: 'bg-[#c0c0c0] border-2 border-b-black border-r-black border-t-white border-l-white active:border-t-black active:border-l-black active:border-b-white active:border-r-white',
    buttonMainText: 'text-black',
    buttonSecondary: 'text-black hover:bg-gray-300',
    
    font: 'font-sans tracking-tight',
    radius: 'rounded-none',
  },
  coffee: {
    name: 'Coffee',
    appBg: 'bg-[#F5EBE0]',
    containerBg: '',
    textMain: 'text-[#4A3B32]',
    textSec: 'text-[#8D7B68]',
    accent: 'text-[#C9A690]',
    
    inputBg: 'bg-white',
    inputBorder: 'border border-[#D6C7B5]',
    inputText: 'text-[#4A3B32]',
    inputPlaceholder: 'placeholder-[#D6C7B5]',
    inputShadow: 'shadow-[0_4px_20px_-4px_rgba(74,59,50,0.1)]',
    
    itemBg: 'bg-white',
    itemBorder: 'border-[#E3D5C5]',
    itemText: 'text-[#5C4D43]',
    itemCompletedText: 'text-[#D6C7B5]',
    
    buttonMain: 'bg-[#6F4E37] hover:bg-[#5C4033]',
    buttonMainText: 'text-[#F5EBE0]',
    buttonSecondary: 'text-[#8D7B68] hover:bg-[#E3D5C5]/30',
    
    font: 'font-serif',
    radius: 'rounded-lg',
  }
};