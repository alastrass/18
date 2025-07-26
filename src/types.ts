export type AppState = 'welcome' | 'age-verification' | 'game-selection' | 'truth-or-dare' | 'new-game';

export type GameType = 'truth-or-dare' | 'new-game';

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