export type AppState = 'welcome' | 'age-verification' | 'game-selection' | 'truth-or-dare' | 'new-game';

export type GameType = 'truth-or-dare' | 'kiffe-ou-kiffe-pas' | 'karma-sutra';
export type GameType = 'truth-or-dare' | 'kiffe-ou-kiffe-pas' | 'karma-sutra' | 'puzzle';

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

export interface RemoteGameSession {
  code: string;
  host: {
    id: string;
    name: string;
    connected: boolean;
    ready: boolean;
  };
  guest?: {
    id: string;
    name: string;
    connected: boolean;
    ready: boolean;
  };
  category: Category;
  customChallenges: Challenge[];
  state: 'waiting-guest' | 'waiting-ready' | 'ready' | 'playing';
  gameData?: {
    players: Player[];
    currentPlayerIndex: number;
    currentChallenge: Challenge | null;
    usedChallenges: number[];
  };
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
export type KiffeGameState = 'session-setup' | 'waiting-partner' | 'playing' | 'results';

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

// Puzzle Game types
export interface PuzzlePiece {
  id: number;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  imageData: string; // Base64 image data for the piece
  isPlaced: boolean;
  width: number;
  height: number;
}

export interface PuzzleSession {
  code: string;
  creator: {
    id: string;
    name: string;
    connected: boolean;
  };
  solver?: {
    id: string;
    name: string;
    connected: boolean;
  };
  originalImage: string; // Base64 image data
  gridSize: number; // 3 for 3x3, 4 for 4x4, etc.
  pieces: PuzzlePiece[];
  isCompleted: boolean;
  state: 'waiting' | 'playing' | 'completed';
  startTime?: number;
  endTime?: number;
}

export type PuzzleGameState = 'session-setup' | 'image-selection' | 'waiting-player' | 'playing' | 'completed';

export type PuzzleDifficulty = {
  gridSize: number;
  label: string;
  pieces: number;
};