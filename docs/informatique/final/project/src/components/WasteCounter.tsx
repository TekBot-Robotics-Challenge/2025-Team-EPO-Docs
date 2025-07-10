import React from 'react';
import { WasteStats } from '../types/waste';

interface WasteCounterProps {
  stats: WasteStats;
}

const WasteCounter: React.FC<WasteCounterProps> = ({ stats }) => {
  const colors = [
    { name: 'jaune', color: 'bg-yellow-500', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
    { name: 'bleu', color: 'bg-blue-500', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
    { name: 'vert', color: 'bg-green-500', textColor: 'text-green-700', borderColor: 'border-green-200' },
    { name: 'rouge', color: 'bg-red-500', textColor: 'text-red-700', borderColor: 'border-red-200' },
    { name: 'noir', color: 'bg-gray-800', textColor: 'text-gray-700', borderColor: 'border-gray-200' },
    { name: 'blanc', color: 'bg-gray-100 border-2 border-gray-300', textColor: 'text-gray-700', borderColor: 'border-gray-200' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {colors.map((colorInfo) => (
        <div
          key={colorInfo.name}
          className={`bg-white rounded-lg p-4 shadow-md border-2 ${colorInfo.borderColor} hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full ${colorInfo.color} shadow-sm`}></div>
            <div>
              <p className="text-sm font-medium text-gray-600 capitalize">{colorInfo.name}</p>
              <p className={`text-2xl font-bold ${colorInfo.textColor}`}>
                {stats[colorInfo.name as keyof WasteStats]}
              </p>
            </div>
          </div>
          <div className="mt-2 bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${colorInfo.color} transition-all duration-300`}
              style={{
                width: `${stats.total > 0 ? (stats[colorInfo.name as keyof WasteStats] as number / stats.total) * 100 : 0}%`
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WasteCounter;