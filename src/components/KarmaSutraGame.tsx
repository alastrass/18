import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX, ArrowLeft, Clock, Trophy, Heart } from 'lucide-react';
import { KarmaSutraGameState, KarmaSutraSession, KarmaSutraPosition } from '../types';
import { karmaSutraPositions } from '../data/karmaSutraPositions';

interface KarmaSutraGameProps {
  onBack: () => void;
}

const KarmaSutraGame: React.FC<KarmaSutraGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<KarmaSutraGameState>('welcome');
  const [session, setSession] = useState<KarmaSutraSession>({
    currentPositionIndex: 0,
    usedPositions: [],
    sessionCount: 0,
    timeRemaining: 0,
    isPlaying: false,
    soundEnabled: true
  });
  
  const [currentPosition, setCurrentPosition] = useState<KarmaSutraPosition | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new AudioContext();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Generate random time between 2-5 minutes (in seconds)
  const getRandomTime = () => {
    return Math.floor(Math.random() * (300 - 120 + 1)) + 120; // 120-300 seconds
  };

  // Get next random position
  const getNextPosition = (): KarmaSutraPosition => {
    const availablePositions = karmaSutraPositions.filter(
      (_, index) => !session.usedPositions.includes(index)
    );
    
    if (availablePositions.length === 0) {
      // Reset if all positions used
      setSession(prev => ({ ...prev, usedPositions: [] }));
      return karmaSutraPositions[Math.floor(Math.random() * karmaSutraPositions.length)];
    }
    
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const selectedPosition = availablePositions[randomIndex];
    const originalIndex = karmaSutraPositions.findIndex(p => p.id === selectedPosition.id);
    
    setSession(prev => ({
      ...prev,
      usedPositions: [...prev.usedPositions, originalIndex]
    }));
    
    return selectedPosition;
  };

  // Play sound effect
  const playSound = (frequency: number, duration: number, type: 'warning' | 'transition' = 'warning') => {
    if (!session.soundEnabled || !audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = type === 'warning' ? 'sine' : 'triangle';
      
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.log('Audio not available');
    }
  };

  // Start new session
  const startSession = () => {
    const newPosition = getNextPosition();
    const timeLimit = getRandomTime();
    
    setCurrentPosition(newPosition);
    setSession(prev => ({
      ...prev,
      sessionCount: prev.sessionCount + 1,
      timeRemaining: timeLimit,
      isPlaying: true,
      currentPositionIndex: karmaSutraPositions.findIndex(p => p.id === newPosition.id)
    }));
    setGameState('playing');
    setShowWarning(false);
  };

  // Skip to next position
  const skipPosition = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    startSession();
  };

  // Toggle pause/play
  const togglePause = () => {
    setSession(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  // Toggle sound
  const toggleSound = () => {
    setSession(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && session.isPlaying && session.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSession(prev => {
          const newTime = prev.timeRemaining - 1;
          
          // Warning at 30 seconds
          if (newTime === 30 && !showWarning) {
            setShowWarning(true);
            playSound(800, 0.3, 'warning');
          }
          
          // Time's up
          if (newTime <= 0) {
            playSound(600, 0.5, 'transition');
            setTimeout(() => {
              startSession(); // Auto start next position
            }, 1000);
            return prev;
          }
          
          return { ...prev, timeRemaining: newTime };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, session.isPlaying, session.timeRemaining, showWarning]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgress = (): number => {
    if (!currentPosition) return 0;
    const totalTime = getRandomTime();
    return ((totalTime - session.timeRemaining) / totalTime) * 100;
  };

  // Welcome Screen
  if (gameState === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-amber-900 px-4 py-8 safe-area-inset">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Temple</span>
            </button>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-orange-500/20">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Heart className="w-12 h-12 text-red-400" />
                <div>
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-400">
                    Karma ? Sutra !
                  </h1>
                  <p className="text-orange-200 text-sm mt-2">
                    Explorez l'art de l'amour ensemble
                  </p>
                </div>
                <Heart className="w-12 h-12 text-red-400" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-xl p-6 mb-8 border border-red-500/30">
              <h2 className="text-white font-semibold mb-4 text-center">Comment ça marche ?</h2>
              <ul className="text-orange-200 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Chaque position s'affiche pendant 2 à 5 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Signal sonore à 30 secondes de la fin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Transition automatique vers la position suivante</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Possibilité de passer ou mettre en pause</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <button
                onClick={startSession}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 active:from-red-700 active:to-orange-700 text-white font-bold py-6 px-8 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-3 mobile-button touch-action-none"
              >
                <Play className="w-6 h-6" />
                <span className="text-lg">Commencer la Session</span>
              </button>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={toggleSound}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 active:bg-slate-800 text-white rounded-lg transition-colors mobile-button touch-action-none"
                >
                  {session.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span className="text-sm">{session.soundEnabled ? 'Son activé' : 'Son désactivé'}</span>
                </button>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-orange-300 text-xs">
                {karmaSutraPositions.length} positions disponibles
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  if ((gameState === 'playing' || gameState === 'paused') && currentPosition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-amber-900 px-4 py-8 safe-area-inset">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 active:bg-slate-800/50 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Temple</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Karma ? Sutra !</h1>
              <p className="text-orange-200 text-sm">Session #{session.sessionCount}</p>
            </div>
            
            <button
              onClick={toggleSound}
              className="p-2 bg-slate-700/50 active:bg-slate-800/50 text-white rounded-lg transition-colors mobile-button touch-action-none"
            >
              {session.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full border-8 border-slate-700/50 relative">
                <svg className="w-32 h-32 absolute top-0 left-0 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className={`${showWarning ? 'text-red-400' : 'text-orange-400'} transition-colors duration-300`}
                    strokeDasharray={`${(getProgress() / 100) * 351.86} 351.86`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${showWarning ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                      {formatTime(session.timeRemaining)}
                    </div>
                    <div className="text-orange-300 text-xs">
                      {showWarning ? 'Presque fini !' : 'Temps restant'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Position Display */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-orange-500/20 mb-8">
            <div className="text-center">
              <div className="text-8xl mb-6">{currentPosition.illustration}</div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                {currentPosition.name}
              </h2>
              
              <p className="text-orange-200 text-lg mb-6 leading-relaxed">
                {currentPosition.description}
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentPosition.difficulty === 'facile' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : currentPosition.difficulty === 'moyen'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {currentPosition.difficulty.charAt(0).toUpperCase() + currentPosition.difficulty.slice(1)}
                </span>
              </div>
              
              <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-lg p-4">
                <h3 className="text-orange-300 font-semibold mb-2 text-sm">Bienfaits :</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentPosition.benefits.map((benefit, index) => (
                    <span key={index} className="text-orange-200 text-xs bg-slate-700/50 px-2 py-1 rounded">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={togglePause}
              className="flex items-center gap-2 px-6 py-4 bg-orange-600 active:bg-orange-700 text-white rounded-xl transition-colors mobile-button touch-action-none"
            >
              {gameState === 'playing' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{gameState === 'playing' ? 'Pause' : 'Reprendre'}</span>
            </button>
            
            <button
              onClick={skipPosition}
              className="flex items-center gap-2 px-6 py-4 bg-slate-600 active:bg-slate-700 text-white rounded-xl transition-colors mobile-button touch-action-none"
            >
              <SkipForward className="w-5 h-5" />
              <span>Passer</span>
            </button>
          </div>

          {gameState === 'paused' && (
            <div className="text-center mt-6">
              <p className="text-orange-300 text-sm">
                Session en pause • Appuyez sur Reprendre pour continuer
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default KarmaSutraGame;