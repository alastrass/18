export type AppState = 'welcome' | 'age-verification' | 'game-selection' | 'truth-or-dare' | 'new-game';

export type GameType = 'truth-or-dare' | 'kiffe-ou-kiffe-pas' | 'karma-sutra';

export type GameState = 'mode-selection' | 'setup' | 'remote-setup' | 'playing';

export type PlayMode = 'local' | 'remote';

export type RemoteGameState = 'waiting' | 'connected' | 'playing';

export type Category = 'soft' | 'intense';

export type ChallengeType = 'truth' | 'dare';

export interface Challenge {
  id: number;
  type: ChallengeType;
  category: Category;
  text: string;
  isCustom?: boolean;
}

export interface Player {
  id: number;
  name: string;
  score: number;
}

export interface CustomChallengeInput {
  type: ChallengeType;
  category: Category;
  text: string;
}

export interface RemoteSession {
  code: string;
  hostId: string;
  guestId?: string;
  players: Player[];
  category: Category;
  customChallenges: Challenge[];
  currentPlayerIndex: number;
  currentChallenge: Challenge | null;
  usedChallenges: number[];
  state: RemoteGameState;
}

// Kiffe ou Kiffe Pas types
export interface KiffePhrase {
  id: number;
  text: string;
  isCustom?: boolean;
  addedBy?: string; // 'player1' | 'player2' | 'system'
}

export interface KiffeSession {
  code: string;
  player1: {
    id: string;
    name: string;
    connected: boolean;
    responses: Record<number, 'kiffe' | 'kiffe-pas'>;
  };
  player2?: {
    id: string;
    name: string;
    connected: boolean;
    responses: Record<number, 'kiffe' | 'kiffe-pas'>;
  };
  phrases: KiffePhrase[];
  currentPhraseIndex: number;
  matches: KiffePhrase[];
  state: 'waiting' | 'adding-phrases' | 'playing' | 'finished';
}

export type KiffeGameState = 'session-setup' | 'adding-phrases' | 'waiting-partner' | 'playing' | 'results';

export type SwipeDirection = 'kiffe' | 'kiffe-pas';

// Karma Sutra types
export interface KarmaSutraPosition {
  id: number;
  name: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  illustration: string; // SVG or emoji representation
  imageUrl?: string; // URL de l'image illustrative
  benefits: string[];
}

export type KarmaSutraGameState = 'welcome' | 'playing' | 'paused' | 'finished';

export interface KarmaSutraSession {
  currentPositionIndex: number;
  usedPositions: number[];
  sessionCount: number;
  timeRemaining: number;
  isPlaying: boolean;
  soundEnabled: boolean;
}