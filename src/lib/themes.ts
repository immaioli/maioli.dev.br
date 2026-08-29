export type ThemeConfig = {
  id: string;
  name: string; // The translation key
  primary: string;
};

export const THEMES: ThemeConfig[] = [
  { id: 'universe', name: 'universo', primary: '#ffffff' },
  { id: 'spider-man', name: 'spiderMan', primary: '#DF1F2D' },
  { id: 'iron-man', name: 'ironMan', primary: '#B30000' },
  { id: 'captain-america', name: 'captainAmerica', primary: '#0A5CD6' },
  { id: 'thor', name: 'thor', primary: '#C0C0C0' },
  { id: 'hulk', name: 'hulk', primary: '#3FB950' },
  { id: 'black-widow', name: 'blackWidow', primary: '#ED1C24' },
  { id: 'black-panther', name: 'blackPanther', primary: '#8B5CF6' },
  { id: 'doctor-strange', name: 'doctorStrange', primary: '#8B0000' },
  { id: 'captain-marvel', name: 'captainMarvel', primary: '#C8102E' },
  { id: 'scarlet-witch', name: 'scarletWitch', primary: '#FF2400' },
  { id: 'deadpool', name: 'deadpool', primary: '#ED1C24' },
  { id: 'daredevil', name: 'daredevil', primary: '#8B0000' },
  { id: 'x-men', name: 'xMen', primary: '#0033A0' },
  { id: 'fantastic-four', name: 'fantasticFour', primary: '#0055A4' },
  { id: 'guardians', name: 'guardians', primary: '#FFD700' },
  { id: 'thanos', name: 'thanos', primary: '#7B5CFF' },
  { id: 'loki', name: 'loki', primary: '#006400' },
  { id: 'magneto', name: 'magneto', primary: '#C8102E' },
];