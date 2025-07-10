import React, { useEffect, useState } from 'react';
import { ConveyorItem } from '../types/waste';

interface ConveyorAnimationProps {
  items: ConveyorItem[];
}

const ConveyorAnimation: React.FC<ConveyorAnimationProps> = ({ items }) => {
  const [animatedItems, setAnimatedItems] = useState<(ConveyorItem & { position: number })[]>([]);

  // Animation continue des items existants
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedItems(prev => 
        prev.map(item => ({
          ...item,
          position: item.position + 1.5 // Vitesse d'animation
        })).filter(item => item.position < 100) // Supprimer les items sortis
      );
    }, 50); // 50ms pour une animation fluide

    return () => clearInterval(interval);
  }, []);

  // Ajouter les nouveaux items à l'animation
  useEffect(() => {
    const newItems = items.filter(item => 
      !animatedItems.some(animated => animated.id === item.id)
    );
    
    if (newItems.length > 0) {
      console.log('Nouveaux items ajoutés à l\'animation:', newItems);
      setAnimatedItems(prev => [
        ...prev,
        ...newItems.map(item => ({ 
          ...item, 
          position: 0 // Commencer à gauche
        }))
      ]);
    }
  }, [items, animatedItems]);

  const getColorClass = (couleur: string) => {
    const colorMap: { [key: string]: string } = {
      jaune: 'bg-yellow-400 border-yellow-500',
      bleu: 'bg-blue-400 border-blue-500',
      vert: 'bg-green-400 border-green-500',
      rouge: 'bg-red-400 border-red-500',
      noir: 'bg-gray-700 border-gray-800',
      blanc: 'bg-gray-100 border-gray-300'
    };
    return colorMap[couleur] || 'bg-gray-400 border-gray-500';
  };

  const getColorShadow = (couleur: string) => {
    const shadowMap: { [key: string]: string } = {
      jaune: 'shadow-yellow-300',
      bleu: 'shadow-blue-300',
      vert: 'shadow-green-300',
      rouge: 'shadow-red-300',
      noir: 'shadow-gray-500',
      blanc: 'shadow-gray-200'
    };
    return shadowMap[couleur] || 'shadow-gray-300';
  };

  return (
    <div className="relative w-full h-32 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-lg overflow-hidden border-4 border-gray-500 shadow-inner">
      {/* Motif du convoyeur avec texture */}
      <div className="absolute inset-0">
        <div className="h-full bg-gradient-to-b from-gray-400 via-gray-500 to-gray-400"></div>
        {/* Lignes de texture du convoyeur */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute h-0.5 bg-gray-600 w-full"
              style={{ top: `${12.5 * (i + 1)}%` }}
            />
          ))}
        </div>
      </div>

      {/* Lignes de guidage */}
      <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-600 opacity-60"></div>
      <div className="absolute bottom-4 left-0 w-full h-0.5 bg-gray-600 opacity-60"></div>

      {/* Flèches directionnelles animées */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-700">
        <div className="flex space-x-1 animate-pulse">
          <div className="w-0 h-0 border-l-3 border-l-transparent border-r-3 border-r-transparent border-b-3 border-b-gray-700 rotate-90"></div>
          <div className="w-0 h-0 border-l-3 border-l-transparent border-r-3 border-r-transparent border-b-3 border-b-gray-700 rotate-90"></div>
          <div className="w-0 h-0 border-l-3 border-l-transparent border-r-3 border-r-transparent border-b-3 border-b-gray-700 rotate-90"></div>
        </div>
      </div>

      {/* Items en mouvement avec couleurs correctes */}
      {animatedItems.map((item) => (
        <div
          key={item.id}
          className={`absolute top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-lg shadow-lg transition-all duration-75 border-2 ${getColorClass(item.couleur)} ${getColorShadow(item.couleur)}`}
          style={{
            left: `${item.position}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
        >
          {/* Effet de brillance sur l'item */}
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-white/30 to-transparent"></div>
          
          {/* Indicateur de couleur au centre */}
          <div className="absolute inset-2 rounded-md bg-gradient-to-br from-white/20 to-black/10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/60"></div>
          </div>
        </div>
      ))}

      {/* Zone de détection avec animation */}
      <div className="absolute left-1/4 top-0 w-1 h-full bg-red-500 opacity-70 z-20">
        <div className="absolute -top-3 -left-3 w-7 h-7 bg-red-500 rounded-full animate-pulse shadow-lg">
          <div className="absolute inset-1 bg-red-300 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 text-xs font-bold text-red-600 bg-white px-2 py-1 rounded shadow">
          SCAN
        </div>
      </div>

      {/* Zone de tri avec animation */}
      <div className="absolute right-1/4 top-0 w-1 h-full bg-green-500 opacity-70 z-20">
        <div className="absolute -top-3 -left-3 w-7 h-7 bg-green-500 rounded-full animate-pulse shadow-lg">
          <div className="absolute inset-1 bg-green-300 rounded-full"></div>
        </div>
        <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 text-xs font-bold text-green-600 bg-white px-2 py-1 rounded shadow">
          TRI
        </div>
      </div>

      {/* Compteur d'items en temps réel */}
      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
        Items: {animatedItems.length}
      </div>
    </div>
  );
};

export default ConveyorAnimation;