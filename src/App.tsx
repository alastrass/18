import React, { useState, useEffect } from 'react';
import { AppState, GameType } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import AgeVerification from './components/AgeVerification';
import GameSelection from './components/GameSelection';
import TruthOrDareGame from './components/TruthOrDareGame';
import KiffeOuKiffePasGame from './components/KiffeOuKiffePasGame';
import PWAInstallPrompt from './components/PWAInstallPrompt';

function App() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);

  const handleAgeVerification = (verified: boolean) => {
    setIsAgeVerified(verified);
    if (verified) {
      setAppState('game-selection');
    }
  };

  const handleGameSelection = (gameType: GameType) => {
    setCurrentGame(gameType);
    setAppState(gameType);
  };

  const handleBackToGameSelection = () => {
    setCurrentGame(null);
    setAppState('game-selection');
  };

  const handleBackToWelcome = () => {
    setIsAgeVerified(false);
    setCurrentGame(null);
    setAppState('welcome');
  };

  if (!isAgeVerified) {
    if (appState === 'welcome') {
      return <WelcomeScreen onStart={() => setAppState('age-verification')} />;
    }
    if (appState === 'age-verification') {
      return <AgeVerification onVerify={handleAgeVerification} />;
    }
  }

  if (appState === 'game-selection') {
    return <GameSelection onGameSelect={handleGameSelection} />;
  }

  if (appState === 'truth-or-dare') {
    return <TruthOrDareGame onBack={handleBackToGameSelection} />;
  }

  if (appState === 'kiffe-ou-kiffe-pas') {
    return <KiffeOuKiffePasGame onBack={handleBackToGameSelection} />;
  }

  return (
    <>
      <PWAInstallPrompt />
    </>
  );

}

export default App;