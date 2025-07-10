import { useState, useEffect, useCallback } from 'react';
import { WasteDetection, WasteStats, ConveyorItem } from '../types/waste';

const API_BASE = 'http://localhost:3001';

export const useWasteDetection = () => {
  const [detections, setDetections] = useState<WasteDetection[]>([]);
  const [stats, setStats] = useState<WasteStats>({
    total: 0,
    jaune: 0,
    bleu: 0,
    vert: 0,
    rouge: 0,
    noir: 0,
    blanc: 0
  });
  const [conveyorItems, setConveyorItems] = useState<ConveyorItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<number>(0);
  const [processedDetectionIds, setProcessedDetectionIds] = useState<Set<string>>(new Set());

  const colors = ['jaune', 'bleu', 'vert', 'rouge', 'noir', 'blanc'];

  // Fonction pour récupérer les stats depuis l'API
  const fetchStats = useCallback(async () => {
    try {
      // Polling intelligent - envoyer le timestamp de la dernière mise à jour
      const url = lastUpdateTimestamp > 0 
        ? `${API_BASE}/stats?since=${lastUpdateTimestamp}`
        : `${API_BASE}/stats`;
      
      const response = await fetch(url);
      
      // Si 304, pas de nouvelles données
      if (response.status === 304) {
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Mettre à jour les stats
        setStats(data.data.stats);
        
        // Mettre à jour l'historique des détections
        if (data.data.detectionHistory) {
          setDetections(data.data.detectionHistory);
          
          // Traiter les nouvelles détections pour l'animation du convoyeur
          const newDetections = data.data.detectionHistory.filter(
            (detection: WasteDetection) => !processedDetectionIds.has(detection.id)
          );

          if (newDetections.length > 0) {
            // Ajouter les nouveaux items au convoyeur
            const newItems = newDetections.map((detection: WasteDetection) => ({
              id: detection.id,
              couleur: detection.couleur,
              position: 0,
              timestamp: detection.timestamp
            }));

            setConveyorItems(prev => [...newItems, ...prev]);
            
            // Marquer ces détections comme traitées
            setProcessedDetectionIds(prev => {
              const newSet = new Set(prev);
              newDetections.forEach((detection: WasteDetection) => {
                newSet.add(detection.id);
              });
              return newSet;
            });

            // Programmer la suppression des items après animation
            newItems.forEach(item => {
              setTimeout(() => {
                setConveyorItems(prev => prev.filter(conveyorItem => conveyorItem.id !== item.id));
              }, 3000); // 3 secondes pour traverser le convoyeur
            });
          }
        }
        
        // Mettre à jour le timestamp
        setLastUpdateTimestamp(data.timestamp);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      setIsConnected(false);
    }
  }, [lastUpdateTimestamp, processedDetectionIds]);

  // Fonction pour simuler une détection (envoie à l'API)
  const simulateDetection = useCallback(async () => {
    try {
      const couleur = colors[Math.floor(Math.random() * colors.length)];
      const timestamp = new Date().toISOString();
      
      const response = await fetch(`${API_BASE}/tri`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couleur,
          timestamp
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('Détection simulée envoyée:', data.data);
        
        // Créer immédiatement l'item pour l'animation
        const newItem: ConveyorItem = {
          id: data.data.id,
          couleur: couleur,
          position: 0,
          timestamp: data.data.timestamp
        };
        
        setConveyorItems(prev => [newItem, ...prev]);
        
        // Marquer comme traité pour éviter la duplication
        setProcessedDetectionIds(prev => new Set(prev).add(data.data.id));
        
        // Programmer la suppression après animation
        setTimeout(() => {
          setConveyorItems(prev => prev.filter(item => item.id !== data.data.id));
        }, 3000);
        
        // Forcer la mise à jour des stats
        setTimeout(fetchStats, 200);
      }
      
      return data.data;
    } catch (error) {
      console.error('Erreur lors de la simulation:', error);
      setIsConnected(false);
    }
  }, [colors, fetchStats]);

  // Fonction pour traiter une détection reçue directement
  const processDetection = useCallback((detection: WasteDetection) => {
    // Éviter les doublons
    if (processedDetectionIds.has(detection.id)) {
      return;
    }

    setDetections(prev => [detection, ...prev.slice(0, 49)]);
    
    setStats(prev => ({
      ...prev,
      total: prev.total + 1,
      [detection.couleur]: (prev[detection.couleur as keyof WasteStats] as number) + 1
    }));

    const newItem: ConveyorItem = {
      id: detection.id,
      couleur: detection.couleur,
      position: 0,
      timestamp: detection.timestamp
    };
    
    setConveyorItems(prev => [newItem, ...prev]);
    setProcessedDetectionIds(prev => new Set(prev).add(detection.id));

    setTimeout(() => {
      setConveyorItems(prev => prev.filter(item => item.id !== detection.id));
    }, 3000);
  }, [processedDetectionIds]);

  // Nettoyer les anciens IDs traités pour éviter l'accumulation en mémoire
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessedDetectionIds(prev => {
        // Garder seulement les 100 derniers IDs
        const idsArray = Array.from(prev);
        if (idsArray.length > 100) {
          return new Set(idsArray.slice(-100));
        }
        return prev;
      });
    }, 30000); // Nettoyer toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  // Polling des stats depuis l'API
  useEffect(() => {
    // Récupération initiale
    fetchStats();
    
    // Polling toutes les secondes pour une meilleure réactivité
    const interval = setInterval(fetchStats, 1000);
    
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Test de connexion initial
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(`${API_BASE}/status`);
        setIsConnected(response.ok);
      } catch (error) {
        console.log('API non disponible, mode simulation activé');
        setIsConnected(false);
      }
    };
    
    testConnection();
  }, []);

  return {
    detections,
    stats,
    conveyorItems,
    isConnected,
    processDetection,
    simulateDetection
  };
};