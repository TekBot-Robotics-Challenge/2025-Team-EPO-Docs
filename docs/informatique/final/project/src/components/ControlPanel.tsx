import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface ControlPanelProps {
  isRunning: boolean;
  isMuted: boolean;
  onToggleRunning: () => void;
  onToggleMute: () => void;
  onManualDetection: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isRunning,
  isMuted,
  onToggleRunning,
  onToggleMute,
  onManualDetection
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contrôles</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Système</span>
          <button
            onClick={onToggleRunning}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isRunning
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Démarrer</span>
              </>
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Audio</span>
          <button
            onClick={onToggleMute}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isMuted
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Muet</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Activé</span>
              </>
            )}
          </button>
        </div>
        
        <div className="pt-4 border-t">
          {/* <button
            onClick={onManualDetection}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Simulation Manuelle
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;