import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, Award, Activity } from 'lucide-react';
import { WasteStats, WasteDetection } from '../types/waste';

interface DashboardProps {
  stats: WasteStats;
  detections: WasteDetection[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, detections }) => {
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');

  // Couleurs pour les graphiques
  const COLORS = {
    jaune: '#EAB308',
    bleu: '#3B82F6',
    vert: '#22C55E',
    rouge: '#EF4444',
    noir: '#374151',
    blanc: '#F3F4F6'
  };

  // Données pour le graphique en barres
  const barData = [
    { name: 'Jaune', value: stats.jaune, color: COLORS.jaune },
    { name: 'Bleu', value: stats.bleu, color: COLORS.bleu },
    { name: 'Vert', value: stats.vert, color: COLORS.vert },
    { name: 'Rouge', value: stats.rouge, color: COLORS.rouge },
    { name: 'Noir', value: stats.noir, color: COLORS.noir },
    { name: 'Blanc', value: stats.blanc, color: COLORS.blanc }
  ].filter(item => item.value > 0);

  // Données pour le camembert
  const pieData = barData.map(item => ({
    name: item.name,
    value: item.value,
    percentage: stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0
  }));

  // Calcul des indicateurs de performance
  const calculateMetrics = () => {
    if (detections.length === 0) {
      return {
        triesPerMinute: 0,
        topColor: 'Aucune',
        averagePerColor: 0,
        variation: 0
      };
    }

    // Calcul du débit (tris/minute) sur les 5 dernières minutes
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const recentDetections = detections.filter(d => 
      new Date(d.timestamp) > fiveMinutesAgo
    );
    const triesPerMinute = Math.round((recentDetections.length / 5) * 10) / 10;

    // Top couleur
    const colorCounts = Object.entries(stats)
      .filter(([key]) => key !== 'total')
      .sort(([,a], [,b]) => (b as number) - (a as number));
    const topColor = colorCounts[0] ? colorCounts[0][0] : 'Aucune';

    // Moyenne par couleur
    const validColors = colorCounts.filter(([,count]) => count > 0);
    const averagePerColor = validColors.length > 0 
      ? Math.round((stats.total / validColors.length) * 10) / 10 
      : 0;

    // Variation (écart-type simplifié)
    const values = validColors.map(([,count]) => count as number);
    const mean = averagePerColor;
    const variance = values.length > 0 
      ? values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length 
      : 0;
    const variation = Math.round(Math.sqrt(variance) * 10) / 10;

    return {
      triesPerMinute,
      topColor,
      averagePerColor,
      variation
    };
  };

  const metrics = calculateMetrics();

  // Données pour le graphique temporel (dernières 10 détections)
  const timelineData = detections.slice(0, 10).reverse().map((detection, index) => ({
    index: index + 1,
    timestamp: new Date(detection.timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    count: index + 1
  }));

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                fill={(entry) => entry.color}
              >
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicateurs de performance */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Débit</p>
              <p className="text-2xl font-bold text-blue-900">{metrics.triesPerMinute}</p>
              <p className="text-xs text-blue-600">tris/min</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700">Top Couleur</p>
              <p className="text-lg font-bold text-green-900 capitalize">{metrics.topColor}</p>
              <p className="text-xs text-green-600">plus triée</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700">Moyenne</p>
              <p className="text-2xl font-bold text-purple-900">{metrics.averagePerColor}</p>
              <p className="text-xs text-purple-600">par couleur</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-700">Variation</p>
              <p className="text-2xl font-bold text-orange-900">{metrics.variation}</p>
              <p className="text-xs text-orange-600">écart-type</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Analyse des Données</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                chartType === 'bar'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Barres
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                chartType === 'pie'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Camembert
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                chartType === 'line'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Évolution
            </button>
          </div>
        </div>

        {stats.total > 0 ? (
          <div>
            {renderChart()}
            <div className="mt-4 text-center text-sm text-gray-600">
              {chartType === 'bar' && 'Distribution des déchets triés par couleur'}
              {chartType === 'pie' && 'Répartition en pourcentage des déchets triés'}
              {chartType === 'line' && 'Évolution temporelle des détections (10 dernières)'}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Aucune donnée à afficher</p>
              <p className="text-sm">Les graphiques apparaîtront après les premières détections</p>
            </div>
          </div>
        )}
      </div>

      {/* Résumé statistique */}
      {stats.total > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé Statistique</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Performance</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Total détections: <span className="font-medium">{stats.total}</span></li>
                <li>• Débit actuel: <span className="font-medium">{metrics.triesPerMinute} tris/min</span></li>
                <li>• Couleur dominante: <span className="font-medium capitalize">{metrics.topColor}</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Distribution</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Moyenne par couleur: <span className="font-medium">{metrics.averagePerColor}</span></li>
                <li>• Variation: <span className="font-medium">{metrics.variation}</span></li>
                <li>• Couleurs actives: <span className="font-medium">{pieData.length}/6</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;