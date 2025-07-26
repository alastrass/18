import React, { useState, useEffect } from 'react';
import { Heart, Users, ArrowLeft, Plus, Play, Wifi, Copy, Check, X, ThumbsUp, ThumbsDown, Sparkles, Trophy } from 'lucide-react';
import { KiffeGameState, KiffeSession, KiffePhrase, SwipeDirection } from '../types';
import { defaultKiffePhrases } from '../data/kiffePhases';

interface KiffeOuKiffePasGameProps {
  onBack: () => void;
}

const KiffeOuKiffePasGame: React.FC<KiffeOuKiffePasGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<KiffeGameState>('session-setup');
  const [sessionMode, setSessionMode] = useState<'create' | 'join'>('create');
  const [playerName, setPlayerName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [session, setSession] = useState<KiffeSession | null>(null);
  const [customPhrases, setCustomPhrases] = useState<string[]>([]);
  const [newPhrase, setNewPhrase] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [playerResponses, setPlayerResponses] = useState<Record<number, SwipeDirection>>({});
  const [matches, setMatches] = useState<KiffePhrase[]>([]);
  const [copied, setCopied] = useState(false);
  const [isPlayer1, setIsPlayer1] = useState(true);

  const generateSessionCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createSession = () => {
    if (!playerName.trim()) return;
    
    const code = generateSessionCode();
    const newSession: KiffeSession = {
      code,
      player1: {
        id: 'player1',
        name: playerName.trim(),
        connected: true,
        responses: {}
      },
      phrases: [...defaultKiffePhrases],
      currentPhraseIndex: 0,
      matches: [],
      state: 'adding-phrases'
    };
    
    setSession(newSession);
    setSessionCode(code);
    setIsPlayer1(true);
    setGameState('adding-phrases');
  };

  const joinSession = () => {
    if (!playerName.trim() || !inputCode.trim()) return;
    
    // Simuler la connexion à une session existante
    const newSession: KiffeSession = {
      code: inputCode.trim(),
      player1: {
        id: 'player1',
        name: 'Hôte',
        connected: true,
        responses: {}
      },
      player2: {
        id: 'player2',
        name: playerName.trim(),
        connected: true,
        responses: {}
      },
      phrases: [...defaultKiffePhrases],
      currentPhraseIndex: 0,
      matches: [],
      state: 'adding-phrases'
    };
    
    setSession(newSession);
    setSessionCode(inputCode.trim());
    setIsPlayer1(false);
    setGameState('adding-phrases');
  };

  const addCustomPhrase = () => {
    if (newPhrase.trim() && customPhrases.length < 10) {
      setCustomPhrases(prev => [...prev, newPhrase.trim()]);
      setNewPhrase('');
    }
  };

  const removeCustomPhrase = (index: number) => {
    setCustomPhrases(prev => prev.filter((_, i) => i !== index));
  };

  const startGame = () => {
    if (!session) return;
    
    // Ajouter les phrases personnalisées à la session
    const customPhrasesObjects: KiffePhrase[] = customPhrases.map((text, index) => ({
      id: 1000 + index,
      text,
      isCustom: true,
      addedBy: isPlayer1 ? 'player1' : 'player2'
    }));
    
    const updatedSession = {
      ...session,
      phrases: [...session.phrases, ...customPhrasesObjects].sort(() => Math.random() - 0.5),
      state: 'playing' as const
    };
    
    setSession(updatedSession);
    setGameState('playing');
  };

  const handleSwipe = (direction: SwipeDirection) => {
    if (!session) return;
    
    const currentPhrase = session.phrases[currentPhraseIndex];
    if (!currentPhrase) return;
    
    // Enregistrer la réponse du joueur
    const newResponses = { ...playerResponses, [currentPhrase.id]: direction };
    setPlayerResponses(newResponses);
    
    // Simuler la réponse de l'autre joueur (pour la démo)
    const otherPlayerResponse = Math.random() > 0.3 ? 'kiffe' : 'kiffe-pas';
    
    // Vérifier s'il y a un match
    if (direction === 'kiffe' && otherPlayerResponse === 'kiffe') {
      setMatches(prev => [...prev, currentPhrase]);
      
      // Animation de match
      setTimeout(() => {
        alert(`🎉 MATCH ! "${currentPhrase.text}"`);
      }, 500);
    }
    
    // Passer à la phrase suivante
    if (currentPhraseIndex < session.phrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1);
    } else {
      setGameState('results');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const resetGame = () => {
    setGameState('session-setup');
    setSession(null);
    setCustomPhrases([]);
    setCurrentPhraseIndex(0);
    setPlayerResponses({});
    setMatches([]);
    setPlayerName('');
    setInputCode('');
  };

  // Session Setup Screen
  if (gameState === 'session-setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 safe-area-inset">
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

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-purple-500/20">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-rose-400" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Kiffe ou Kiffe Pas ?</h1>
                <Heart className="w-8 h-8 text-rose-400" />
              </div>
              <p className="text-purple-200 text-sm">Découvrez vos affinités secrètes</p>
            </div>

            {/* Mode Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setSessionMode('create')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  sessionMode === 'create'
                    ? 'border-purple-400 bg-purple-500/20'
                    : 'border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50'
                }`}
              >
                <Plus className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm">Créer</h3>
              </button>
              <button
                onClick={() => setSessionMode('join')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  sessionMode === 'join'
                    ? 'border-amber-400 bg-amber-500/20'
                    : 'border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50'
                }`}
              >
                <Wifi className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold text-sm">Rejoindre</h3>
              </button>
            </div>

            {/* Player Name */}
            <div className="mb-6">
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Votre nom
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                placeholder="Entrez votre nom"
                maxLength={20}
              />
            </div>

            {/* Join Code Input */}
            {sessionMode === 'join' && (
              <div className="mb-6">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Code de session
                </label>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 font-mono text-center text-xl tracking-wider"
                  placeholder="XXXXXX"
                  maxLength={6}
                />
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={sessionMode === 'create' ? createSession : joinSession}
              disabled={!playerName.trim() || (sessionMode === 'join' && !inputCode.trim())}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed mobile-button touch-action-none"
            >
              {sessionMode === 'create' ? 'Créer la session' : 'Rejoindre'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Adding Phrases Screen
  if (gameState === 'adding-phrases') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 safe-area-inset">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-purple-500/20">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Personnalisez votre jeu</h2>
              <p className="text-purple-200 text-sm">Ajoutez vos propres phrases secrètes (optionnel)</p>
            </div>

            {/* Session Code Display */}
            {isPlayer1 && (
              <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                <p className="text-purple-200 text-sm mb-2">Code de session :</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-600 rounded-lg p-3 font-mono text-xl text-amber-400 text-center tracking-wider">
                    {sessionCode}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-purple-300 text-xs mt-2">Partagez ce code avec votre partenaire</p>
              </div>
            )}

            {/* Add Custom Phrase */}
            <div className="mb-6">
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 text-sm"
                  placeholder="Ajoutez une phrase secrète..."
                  maxLength={100}
                />
                <button
                  onClick={addCustomPhrase}
                  disabled={!newPhrase.trim() || customPhrases.length >= 10}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-purple-300 text-xs">
                {customPhrases.length}/10 phrases personnalisées
              </p>
            </div>

            {/* Custom Phrases List */}
            {customPhrases.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3 text-sm">Vos phrases secrètes :</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {customPhrases.map((phrase, index) => (
                    <div key={index} className="bg-slate-700/30 rounded-lg p-2 flex items-center justify-between">
                      <span className="text-purple-200 text-xs flex-1 mr-2">{phrase}</span>
                      <button
                        onClick={() => removeCustomPhrase(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Start Game Button */}
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 mobile-button touch-action-none flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Commencer le jeu
            </button>

            <p className="text-purple-300 text-xs text-center mt-4">
              Vos phrases seront mélangées avec {defaultKiffePhrases.length} phrases prédéfinies
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  if (gameState === 'playing' && session) {
    const currentPhrase = session.phrases[currentPhraseIndex];
    const progress = ((currentPhraseIndex + 1) / session.phrases.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 safe-area-inset">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white mb-2">Kiffe ou Kiffe Pas ?</h1>
            <div className="bg-slate-700 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-purple-200 text-sm">
              {currentPhraseIndex + 1} / {session.phrases.length} • {matches.length} matchs
            </p>
          </div>

          {/* Current Phrase */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/20 mb-8">
            <div className="text-center">
              <div className="mb-6">
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <p className="text-white text-lg leading-relaxed">
                  {currentPhrase?.text}
                </p>
              </div>
            </div>
          </div>

          {/* Swipe Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSwipe('kiffe-pas')}
              className="bg-red-600 active:bg-red-700 text-white font-semibold py-6 px-4 rounded-xl transition-all duration-200 shadow-lg flex flex-col items-center gap-3 mobile-button touch-action-none"
            >
              <ThumbsDown className="w-8 h-8" />
              <span>Kiffe Pas</span>
            </button>
            <button
              onClick={() => handleSwipe('kiffe')}
              className="bg-green-600 active:bg-green-700 text-white font-semibold py-6 px-4 rounded-xl transition-all duration-200 shadow-lg flex flex-col items-center gap-3 mobile-button touch-action-none"
            >
              <ThumbsUp className="w-8 h-8" />
              <span>Kiffe !</span>
            </button>
          </div>

          <p className="text-purple-300 text-xs text-center mt-6">
            Swipez selon vos préférences. Les matchs seront révélés à la fin !
          </p>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8 safe-area-inset">
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-purple-500/20">
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Résultats</h1>
              <p className="text-purple-200">Vos affinités découvertes !</p>
            </div>

            {/* Matches Count */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 mb-6 text-center">
              <div className="text-4xl font-bold text-amber-400 mb-2">{matches.length}</div>
              <p className="text-white font-semibold">Match{matches.length > 1 ? 's' : ''} trouvé{matches.length > 1 ? 's' : ''} !</p>
            </div>

            {/* Matches List */}
            {matches.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-4">Vos affinités communes :</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {matches.map((match, index) => (
                    <div key={match.id} className="bg-green-900/30 border border-green-500/50 rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-green-100 text-sm leading-relaxed">{match.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-700/50 rounded-lg p-6 mb-6 text-center">
                <p className="text-purple-200">Aucun match cette fois-ci...</p>
                <p className="text-purple-300 text-sm mt-2">Peut-être que vous devriez en parler ensemble ! 😉</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 mobile-button touch-action-none"
              >
                Nouvelle partie
              </button>
              <button
                onClick={onBack}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 mobile-button touch-action-none"
              >
                Retour au Temple
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default KiffeOuKiffePasGame;