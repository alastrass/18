import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { Player } from '../types';

interface ScoreBoardProps {
  players: Player[];
  currentPlayerIndex: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, currentPlayerIndex }) => {
  const [player1, player2] = players;
  const leader = player1.score === player2.score ? null : (player1.score > player2.score ? player1 : player2);

  return (
    <div className="mb-8">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-bold text-white">Tableau des Scores</h2>
          <Trophy className="w-6 h-6 text-amber-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                index === currentPlayerIndex
                  ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/20'
                  : 'border-purple-500/30 bg-slate-700/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {leader && leader.id === player.id && (
                    <Crown className="w-5 h-5 text-amber-400" />
                  )}
                  <span className={`font-semibold ${
                    index === currentPlayerIndex ? 'text-amber-300' : 'text-white'
                  }`}>
                    {player.name}
                  </span>
                  {index === currentPlayerIndex && (
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">
                      À jouer
                    </span>
                  )}
                </div>
                <div className={`text-2xl font-bold ${
                  index === currentPlayerIndex ? 'text-amber-400' : 'text-purple-300'
                }`}>
                  {player.score}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {leader && (
          <div className="text-center mt-4">
            <p className="text-amber-300 text-sm">
              🏆 <span className="font-semibold">{leader.name}</span> mène le jeu !
            </p>
          </div>
        )}
        
        {player1.score === player2.score && player1.score > 0 && (
          <div className="text-center mt-4">
            <p className="text-purple-300 text-sm">
              🤝 Égalité parfaite ! Le match est serré !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreBoard;