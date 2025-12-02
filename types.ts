export interface TreeConfig {
  rotationSpeed: number;
  sparkleIntensity: number;
  glowColor: string;
}

export enum HolidayMode {
  CLASSIC = 'Classic Emerald',
  MIDNIGHT = 'Midnight Gold',
  FROST = 'Royal Frost'
}

export interface WishState {
  isLoading: boolean;
  text: string | null;
  error: string | null;
}
