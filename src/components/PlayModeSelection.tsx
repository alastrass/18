import React from 'react';
import { Users, Wifi, Heart } from 'lucide-react';

export type PlayMode = 'local' | 'remote';

interface PlayModeSelectionProps {
  onModeSelect: (mode: PlayMode) => void;
}

const PlayModeSelection: React.FC<PlayModeSelectionProps> = ({ onModeSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-12 h-12 text-rose-400" />
            <h1 className="text-4xl font-bold text-white">Action ou Vérité</h1>
            <Heart className="w-12 h-12 text-rose-400" />
          </div>
          
          <p className="text-purple-200 mb-8 text-lg">
            Choisissez votre mode de jeu
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => onModeSelect('local')}
              className="p-8 rounded-xl border-2 border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50 hover:bg-purple-500/10 transition-all duration-300 transform hover:scale-105"
            >
              <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-xl mb-3">Jeu Local</h3>
              <p className="text-purple-200 text-sm leading-relaxed">
                Jouez ensemble sur le même appareil. Parfait pour les couples qui sont physiquement ensemble.
              </p>
            </button>
            
            <button
              onClick={() => onModeSelect('remote')}
              className="p-8 rounded-xl border-2 border-purple-500/30 bg-slate-700/50 hover:border-purple-400/50 hover:bg-purple-500/10 transition-all duration-300 transform hover:scale-105"
            >
              <Wifi className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-xl mb-3">Jeu à Distance</h3>
              <p className="text-purple-200 text-sm leading-relaxed">
                Jouez ensemble depuis des endroits différents. Un code de session vous permettra de vous connecter.
              </p>
            </button>
          </div>
          
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4">
            <p className="text-amber-200 text-sm font-medium">
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