import React from 'react';
import { Cpu, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  totalDetections: number;
}

const Header: React.FC<HeaderProps> = ({ isConnected, totalDetections }) => {
  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div >
                <img src="src/assets/tekbot.png" alt="" width={200} />
              </div>
            </div>
            <div className="hidden md:block h-8 w-px bg-gray-300"></div>
            <div className="hidden md:block">
              <img src="src/assets/Logo.svg" alt="" />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-600">Détections</p>
              <p className="text-2xl font-bold text-blue-600">{totalDetections}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Wifi className="w-6 h-6 text-green-500" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">ESP-01</p>
                <p className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Connecté' : 'Déconnecté'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;