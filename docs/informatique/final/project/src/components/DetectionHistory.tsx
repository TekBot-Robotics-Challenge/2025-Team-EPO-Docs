import React from 'react';
import { WasteDetection } from '../types/waste';
import { Clock } from 'lucide-react';

interface DetectionHistoryProps {
  detections: WasteDetection[];
}

const DetectionHistory: React.FC<DetectionHistoryProps> = ({ detections }) => {
  const getColorClass = (couleur: string) => {
    const colorMap: { [key: string]: string } = {
      jaune: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      bleu: 'bg-blue-100 text-blue-800 border-blue-200',
      vert: 'bg-green-100 text-green-800 border-green-200',
      rouge: 'bg-red-100 text-red-800 border-red-200',
      noir: 'bg-gray-100 text-gray-800 border-gray-200',
      blanc: 'bg-gray-50 text-gray-800 border-gray-200'
    };
    return colorMap[couleur] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2" />
        Historique des Détections
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {detections.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucune détection pour le moment</p>
        ) : (
          detections.map((detection) => (
            <div
              key={detection.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getColorClass(detection.couleur)}`}>
                  {detection.couleur}
                </div>
                <div className="text-sm text-gray-600">
                  ID: {detection.id.slice(-8)}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {formatTime(detection.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DetectionHistory;