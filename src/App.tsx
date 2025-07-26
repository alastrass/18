import React, { useState, useEffect } from 'react';
import { Heart, Users, Trophy, RotateCcw, Check, X, Plus } from 'lucide-react';
import { GameState, Player, Challenge, Category, PlayMode } from './types';
import { challenges } from './data/challenges';
import PlayModeSelection from './components/PlayModeSelection';
import WelcomeScreen from './components/WelcomeScreen';
import AgeVerification from './components/AgeVerification';
import PlayerSetup from './components/PlayerSetup';
import RemoteGameSetup from './components/RemoteGameSetup';
import GameBoard from './components/GameBoard';
import WheelSpinner from './components/WheelSpinner';
import ScoreBoard from './components/ScoreBoard';
import PWAInstallPrompt from './components/PWAInstallPrompt';

function App() {
  const [gameState, setGameState] = useState<GameState | 'mode-selection' | 'remote-setup'>('welcome');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>('local');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [category, setCategory] = useState<Category>('soft');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [usedChallenges, setUsedChallenges] = useState<number[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [customChallenges, setCustomChallenges] = useState<Challenge[]>([]);
  const [sessionCode, setSessionCode] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedPlayers = localStorage.getItem('gamePlayer');
    const savedCategory = localStorage.getItem('gameCategory');
    const savedUsed = localStorage.getItem('usedChallenges');
    const savedCustom = localStorage.getItem('customChallenges');
    
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedCategory) setCategory(savedCategory as Category);
    if (savedUsed) setUsedChallenges(JSON.parse(savedUsed));
    if (savedCustom) setCustomChallenges(JSON.parse(savedCustom));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem('gamePlayer', JSON.stringify(players));
    }
  }, [players]);

  useEffect(() => {
    localStorage.setItem('gameCategory', category);
  }, [category]);

  useEffect(() => {
    localStorage.setItem('usedChallenges', JSON.stringify(usedChallenges));
  }, [usedChallenges]);

  useEffect(() => {
    localStorage.setItem('customChallenges', JSON.stringify(customChallenges));
  }, [customChallenges]);

  const handleAgeVerification = (verified: boolean) => {
    setIsAgeVerified(verified);
    if (verified) {
      setGameState('mode-selection');
    }
  };

  const handleModeSelection = (mode: PlayMode) => {
    setPlayMode(mode);
    if (mode === 'local') {
      setGameState('setup');
    } else {
      setGameState('remote-setup');
    }
  };

  const handlePlayersSetup = (setupPlayers: Player[], selectedCategory: Category, customs: Challenge[]) => {
    setPlayers(setupPlayers);
    setCategory(selectedCategory);
    setCustomChallenges(customs);
    setGameState('game');
  };

  const handleRemotePlayersSetup = (setupPlayers: Player[], selectedCategory: Category, customs: Challenge[], code: string) => {
    setPlayers(setupPlayers);
    setCategory(selectedCategory);
    setCustomChallenges(customs);
    setSessionCode(code);
    setGameState('game');
  };

  const getAvailableChallenges = (): Challenge[] => {
    const baseChallenges = challenges[category];
    const allChallenges = [...baseChallenges, ...customChallenges.filter(c => c.category === category)];
    return allChallenges.filter((_, index) => !usedChallenges.includes(index));
  };

  const spinWheel = () => {
    const availableChallenges = getAvailableChallenges();
    
    if (availableChallenges.length === 0) {
      // Reset used challenges if all have been used
      setUsedChallenges([]);
      return;
    }

    setIsSpinning(true);
    setShowWheel(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableChallenges.length);
      const selectedChallenge = availableChallenges[randomIndex];
      
      setCurrentChallenge(selectedChallenge);
      setUsedChallenges(prev => [...prev, randomIndex]);
      setIsSpinning(false);
      
      setTimeout(() => {
        setShowWheel(false);
      }, 1000);
    }, 3000);
  };

  const handleValidation = (isValid: boolean) => {
    if (!currentChallenge) return;

    setPlayers(prev => prev.map((player, index) => {
      if (index === currentPlayerIndex) {
        return { ...player, score: player.score + (isValid ? 1 : 0) };
      } else if (index === (currentPlayerIndex + 1) % 2) {
        return { ...player, score: player.score + (isValid ? 0 : 1) };
      }
      return player;
    }));

    setCurrentChallenge(null);
    setCurrentPlayerIndex((prev) => (prev + 1) % 2);
  };

  const resetGame = () => {
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })));
    setUsedChallenges([]);
    setCurrentChallenge(null);
    setCurrentPlayerIndex(0);
  };

  const restartCompletely = () => {
    localStorage.clear();
    setGameState('welcome');
    setIsAgeVerified(false);
    setPlayMode('local');
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setCategory('soft');
    setCurrentChallenge(null);
    setUsedChallenges([]);
    setCustomChallenges([]);
    setSessionCode('');
  };

  if (!isAgeVerified) {
    if (gameState === 'welcome') {
      return <WelcomeScreen onStart={() => setGameState('age-verification')} />;
    }
    if (gameState === 'age-verification') {
      return <AgeVerification onVerify={handleAgeVerification} />;
    }
  }

  if (gameState === 'mode-selection') {
    return <PlayModeSelection onModeSelect={handleModeSelection} />;
  }

  if (gameState === 'setup') {
    return (
      <PlayerSetup 
        onComplete={handlePlayersSetup}
        initialCustomChallenges={customChallenges}
      />
    );
  }

  if (gameState === 'remote-setup') {
    return (
      <RemoteGameSetup 
        onComplete={handleRemotePlayersSetup}
        onBack={() => setGameState('mode-selection')}
      />
    );
  }

  if (gameState === 'game') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 safe-area-inset">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400" />
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Action ou Vérité</h1>
                {playMode === 'remote' && sessionCode && (
                  <p className="text-amber-300 text-xs sm:text-sm mt-1">Session: {sessionCode}</p>
                )}
              </div>
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400" />
            </div>
            <p className="text-purple-200 text-base sm:text-lg">Mode {category === 'soft' ? 'Soft' : 'Intense'}</p>
            {playMode === 'remote' && (
              <p className="text-amber-200 text-xs sm:text-sm">🌐 Jeu à distance</p>
            )}
          </div>

          {/* Score Board */}
          <ScoreBoard players={players} currentPlayerIndex={currentPlayerIndex} />

          {/* Game Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-2 sm:px-0">
            <button
              onClick={resetGame}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 active:bg-amber-700 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm sm:text-base">Nouveau Round</span>
            </button>
            <button
              onClick={restartCompletely}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 active:bg-slate-700 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm sm:text-base">Recommencer</span>
            </button>
          </div>

          {/* Wheel Spinner */}
          {showWheel && (
            <WheelSpinner 
              isSpinning={isSpinning}
              category={category}
            />
          )}

          {/* Game Board */}
          <GameBoard
            currentPlayer={players[currentPlayerIndex]}
            currentChallenge={currentChallenge}
            onSpin={spinWheel}
            onValidation={handleValidation}
            isSpinning={isSpinning}
            showWheel={showWheel}
          />

          {/* Footer */}
          <footer className="text-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-purple-800">
            <p className="text-purple-300 text-xs sm:text-sm">
              Jeu créé par <span className="font-semibold text-amber-400">Jérôme Joly</span>
            </p>
            <p className="text-purple-400 text-xs mt-1 sm:mt-2">
              Contenu exclusivement destiné aux adultes consentants (18+)
            </p>
          </footer>
        </div>
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
      </div>
    );
  }

  return null;
}

export default App;