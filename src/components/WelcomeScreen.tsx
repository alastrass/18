import React from 'react';
import { Heart, Play } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-12 h-12 text-rose-400" />
            <h1 className="text-4xl font-bold text-white">Action ou Vérité</h1>
            <Heart className="w-12 h-12 text-rose-400" />
          </div>
          
          <p className="text-purple-200 mb-8 text-lg leading-relaxed">
            Un jeu intime et amusant conçu spécialement pour les couples qui souhaitent 
            découvrir de nouveaux aspects de leur relation et partager des moments complices.
          </p>
          
          <div className="bg-amber-900/30 border border-amber-500/50 rounded-lg p-4 mb-8">
            <p className="text-amber-200 text-sm font-medium">
              ⚠️ Contenu réservé aux adultes (18+)
            </p>
            <p className="text-amber-100 text-xs mt-2">
              Ce jeu contient du contenu à caractère intime destiné exclusivement aux adultes consentants.
            </p>
          </div>
          
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5" />
            Commencer à jouer
          </button>
          
          <p className="text-purple-300 text-xs mt-6">
            En continuant, vous confirmez être majeur(e) et consentant(e)
            Jeu en cours de développement par : Jérôme Joly - 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;