export type ThemeConfig = {
  id: string;
  name: string; // The translation key
  primary: string;
  secondary: string;
};

// Villains are deliberately staggered so wrapped rows do not form repeated columns.
export const THEMES: ThemeConfig[] = [
  { id: 'universe', name: 'universo', primary: '#000000', secondary: '#ffffff' },
  { id: 'spider-man', name: 'spiderMan', primary: '#DF1F2D', secondary: '#2B3784' },
  { id: 'thanos', name: 'thanos', primary: '#7B5CFF', secondary: '#FFD700' },
  { id: 'iron-man', name: 'ironMan', primary: '#B30000', secondary: '#FFD700' },
  { id: 'captain-america', name: 'captainAmerica', primary: '#0A5CD6', secondary: '#E23636' },
  { id: 'thor', name: 'thor', primary: '#C0C0C0', secondary: '#C8102E' },
  { id: 'hulk', name: 'hulk', primary: '#3FB950', secondary: '#702963' },
  { id: 'black-widow', name: 'blackWidow', primary: '#ED1C24', secondary: '#333333' },
  { id: 'black-panther', name: 'blackPanther', primary: '#8B5CF6', secondary: '#C0C0C0' },
  { id: 'loki', name: 'loki', primary: '#006400', secondary: '#FFD700' },
  { id: 'doctor-strange', name: 'doctorStrange', primary: '#8B0000', secondary: '#FFD700' },
  { id: 'captain-marvel', name: 'captainMarvel', primary: '#C8102E', secondary: '#F1C400' },
  { id: 'scarlet-witch', name: 'scarletWitch', primary: '#FF2400', secondary: '#8B0000' },
  { id: 'deadpool', name: 'deadpool', primary: '#ED1C24', secondary: '#404040' },
  { id: 'magneto', name: 'magneto', primary: '#C8102E', secondary: '#800080' },
  { id: 'daredevil', name: 'daredevil', primary: '#8B0000', secondary: '#1a1a1a' },
  { id: 'x-men', name: 'xMen', primary: '#0033A0', secondary: '#FFD100' },
  { id: 'fantastic-four', name: 'fantasticFour', primary: '#0055A4', secondary: '#FFFFFF' },
  { id: 'guardians', name: 'guardians', primary: '#FFD700', secondary: '#8B0000' },
  { id: 'doctor-doom', name: 'doctorDoom', primary: '#006400', secondary: '#C0C0C0' },
];
