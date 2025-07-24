import React from 'react';
import { Play, Check, X, Sparkles } from 'lucide-react';
import { Player, Challenge } from '../types';

interface GameBoardProps {
  currentPlayer: Player;
  currentChallenge: Challenge | null;
  onSpin: () => void;
  onValidation: (isValid: boolean) => void;
  isSpinning: boolean;
  showWheel: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  currentPlayer,
  currentChallenge,
  onSpin,
  onValidation,
  isSpinning,
  showWheel
}) => {
  if (showWheel) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Current Player */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
          <h2 className="text-2xl font-bold text-white mb-2">
            C'est au tour de <span className="text-amber-400">{currentPlayer.name}</span>
          </h2>
          <p className="text-purple-200">
            Prêt(e) à relever un défi ?
          </p>
        </div>
      </div>

      {/* Challenge Display */}
      {currentChallenge ? (
        <div className="mb-8">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <div className={`inline-block px-6 py-2 rounded-full text-sm font-semibold mb-4 ${
                currentChallenge.type === 'truth' 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {currentChallenge.type === 'truth' ? '🤔 Vérité' : '💫 Action'}
              </div>
            </div>
            
            <p className="text-white text-xl leading-relaxed text-center mb-8">
              {currentChallenge.text}
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onValidation(true)}
                className="flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Check className="w-5 h-5" />
                Défi Relevé !
              </button>
              <button
                onClick={() => onValidation(false)}
                className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <X className="w-5 h-5" />
                Défi Refusé
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-purple-500/30">
            <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Prêt pour un nouveau défi ?
            </h3>
            <p className="text-purple-200 mb-8">
              Appuyez sur le bouton pour découvrir votre prochaine mission !
            </p>
            <button
              onClick={onSpin}
              disabled={isSpinning}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
            >
              <Play className="w-6 h-6" />
              {isSpinning ? 'Sélection en cours...' : 'Tourner la Roue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;