import React from 'react';
import { Users, Wifi, Heart } from 'lucide-react';

export type PlayMode = 'local' | 'remote';

interface PlayModeSelectionProps {
  onModeSelect: (mode: PlayMode) => void;
}

const PlayModeSelection: React.FC<PlayModeSelectionProps> = ({ onModeSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8 safe-area-inset">
      <div className="max-w-sm w-full text-center">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-purple-500/20">
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-rose-400" />
              <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-rose-400" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white text-center leading-tight">Action ou Vérité</h1>
          </div>
          
          <p className="text-purple-200 mb-6 sm:mb-8 text-base sm:text-lg">
            Choisissez votre mode de jeu
          </p>
          
          <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <button
              onClick={() => onModeSelect('local')}
              className="p-6 sm:p-8 rounded-xl border-2 border-purple-500/30 bg-slate-700/50 active:border-purple-400/50 active:bg-purple-500/10 transition-all duration-200 mobile-button touch-action-none"
            >
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-2 sm:mb-3">Jeu Local</h3>
              <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
                Jouez ensemble sur le même appareil. Parfait pour les couples qui sont physiquement ensemble.
              </p>
            </button>
            
            <button
              onClick={() => onModeSelect('remote')}
              className="p-6 sm:p-8 rounded-xl border-2 border-purple-500/30 bg-slate-700/50 active:border-purple-400/50 active:bg-purple-500/10 transition-all duration-200 mobile-button touch-action-none"
            >
              <Wifi className="w-12 h-12 sm:w-16 sm:h-16 text-amber-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-2 sm:mb-3">Jeu à Distance</h3>
              <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
                Jouez ensemble depuis des endroits différents. Un code de session vous permettra de vous connecter.
              </p>
            </button>
          </div>
          
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-3 sm:p-4">
            <p className="text-amber-200 text-xs sm:text-sm font-medium">
              ⚠️ Contenu réservé aux adultes (18+)
            </p>
            <p className="text-amber-100 text-xs mt-2">
              Ce jeu contient du contenu à caractère intime destiné exclusivement aux adultes consentants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayModeSelection;