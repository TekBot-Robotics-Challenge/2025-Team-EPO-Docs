import React, { useState, useEffect } from 'react';
import { useWasteDetection } from './hooks/useWasteDetection';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import Header from './components/Header';
import ConveyorAnimation from './components/ConveyorAnimation';
import WasteCounter from './components/WasteCounter';
import DetectionHistory from './components/DetectionHistory';
import ControlPanel from './components/ControlPanel';
import Dashboard from './components/Dashboard';

function App() {
  const {
    detections,
    stats,
    conveyorItems,
    isConnected,
    simulateDetection
  } = useWasteDetection();
  
  const { 
    announceDetection, 
    speak, 
    voices, 
    selectedVoice, 
    changeVoice 
  } = useSpeechSynthesis();
  
  const [isRunning, setIsRunning] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  // Annoncer les nouvelles détections
  useEffect(() => {
    if (detections.length > 0 && !isMuted && isRunning) {
      const latestDetection = detections[0];
      announceDetection(latestDetection.couleur);
    }
  }, [detections, isMuted, isRunning, announceDetection]);

  // Message d'accueil au démarrage
  // useEffect(() => {
  //   if (selectedVoice && !isMuted) {
  //     const timer = setTimeout(() => {
  //       speak("Système de tri intelligent TEKBOT initialisé. Prêt pour la détection.");
  //     }, 2000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [selectedVoice, speak, isMuted]);

  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
    if (!isMuted) {
      speak(isRunning ? "Système arrêté" : "Système démarré");
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      speak("Audio activé");
    }
  };

  const handleManualDetection = () => {
    if (isRunning) {
      simulateDetection();
      if (!isMuted) {
        speak("Détection manuelle déclenchée");
      }
    }
  };

  const handleVoiceChange = (voiceIndex: number) => {
    changeVoice(voiceIndex);
    setTimeout(() => {
      speak("Nouvelle voix sélectionnée");
    }, 500);
  };

  const frenchVoices = voices.filter(voice => voice.lang.startsWith('fr'));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isConnected={isConnected} totalDetections={stats.total} />
      
      {/* Navigation des onglets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-100 text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Analyses & Graphiques
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale - Animation et compteurs */}
            <div className="lg:col-span-2 space-y-8">
              {/* Animation du convoyeur */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Convoyeur en Temps Réel
                </h2>
                <ConveyorAnimation items={conveyorItems} />
                <div className="mt-4 flex justify-between text-sm text-gray-600">
                  <span>Zone de détection</span>
                  <span>Zone de tri</span>
                </div>
              </div>

              {/* Compteurs de déchets */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Statistiques de Tri
                </h2>
                <WasteCounter stats={stats} />
              </div>

              {/* Informations système */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  État du Système
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                    <p className="text-sm text-gray-600">Total détections</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {stats.total > 0 ? Math.round((stats.total / (stats.total)) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">Précision</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {isConnected ? 'faible' : 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Latence</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${isRunning ? 'text-green-600' : 'text-red-600'}`}>
                      {isRunning ? 'ON' : 'OFF'}
                    </p>
                    <p className="text-sm text-gray-600">Statut</p>
                  </div>
                </div>
              </div>

              {/* Paramètres audio */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Configuration Audio
                  </h2>
                  <button
                    onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {showVoiceSettings ? 'Masquer' : 'Paramètres'}
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Audio:</span>
                    <span className={`text-sm font-semibold ${isMuted ? 'text-red-600' : 'text-green-600'}`}>
                      {isMuted ? 'Désactivé' : 'Activé'}
                    </span>
                  </div>
                  
                  {selectedVoice && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Voix:</span>
                      <span className="text-sm text-gray-600">
                        {selectedVoice.name.length > 25 
                          ? selectedVoice.name.substring(0, 25) + '...'
                          : selectedVoice.name
                        }
                      </span>
                    </div>
                  )}
                </div>

                {showVoiceSettings && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sélectionner une voix française:
                    </label>
                    <div className="flex space-x-2">
                      <select
                        onChange={(e) => handleVoiceChange(parseInt(e.target.value))}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                        value={voices.findIndex(v => v === selectedVoice)}
                      >
                        {frenchVoices.map((voice, index) => (
                          <option key={voice.name} value={voices.indexOf(voice)}>
                            {voice.name} ({voice.lang})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => speak("Voici un test de ma voix pour le système TEKBOT")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        disabled={isMuted}
                      >
                        Tester
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Colonne latérale - Historique et contrôles */}
            <div className="space-y-8">
              <ControlPanel
                isRunning={isRunning}
                isMuted={isMuted}
                onToggleRunning={handleToggleRunning}
                onToggleMute={handleToggleMute}
                onManualDetection={handleManualDetection}
              />
              
              <DetectionHistory detections={detections} />
            </div>
          </div>
        ) : (
          <Dashboard stats={stats} detections={detections} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <img src="src/assets/Logo.svg" alt="" />
              </div>
            </div>
            <div className="text-sm text-gray-400">
              <img src="src/assets/tekbot.png" width={200} alt="" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;