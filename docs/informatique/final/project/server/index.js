const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; 

// Middleware
app.use(cors());
app.use(express.json());

// Stockage en mémoire
let wasteStats = {
  total: 0,
  jaune: 0,
  bleu: 0,
  vert: 0,
  rouge: 0,
  noir: 0,
  blanc: 0
};

let detectionHistory = [];
let lastUpdateTimestamp = Date.now();

// Validation des couleurs acceptées
const validColors = ['jaune', 'bleu', 'vert', 'rouge', 'noir', 'blanc'];

// 📥 POST /tri - Reçoit les données de l'ESP-01
app.post('/tri', (req, res) => {
  try {
    const { couleur, timestamp } = req.body;

    // Validation des données
    if (!couleur || !timestamp) {
      return res.status(400).json({
        error: 'Données manquantes',
        message: 'couleur et timestamp sont requis'
      });
    }

    if (!validColors.includes(couleur.toLowerCase())) {
      return res.status(400).json({
        error: 'Couleur invalide',
        message: `Couleurs acceptées: ${validColors.join(', ')}`
      });
    }

    // Normaliser la couleur
    const normalizedColor = couleur.toLowerCase();

    // Créer l'enregistrement de détection
    const detection = {
      id: uuidv4(),
      couleur: normalizedColor,
      timestamp: new Date().toISOString(),
      receivedAt: new Date().toISOString()
    };

    // Mettre à jour les statistiques
    wasteStats.total += 1;
    wasteStats[normalizedColor] += 1;

    // Ajouter à l'historique (garder les 100 dernières détections)
    detectionHistory.unshift(detection);
    if (detectionHistory.length > 100) {
      detectionHistory = detectionHistory.slice(0, 100);
    }

    // Mettre à jour le timestamp de dernière modification
    lastUpdateTimestamp = Date.now();

    console.log(`[${new Date().toISOString()}] Détection reçue:`, {
      couleur: normalizedColor,
      total: wasteStats.total
    });

    res.status(201).json({
      success: true,
      message: 'Détection enregistrée avec succès',
      data: {
        id: detection.id,
        couleur: normalizedColor,
        timestamp: detection.receivedAt,
        totalDetections: wasteStats.total
      }
    });

  } catch (error) {
    console.error('Erreur lors du traitement de la détection:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de traiter la détection'
    });
  }
});

// 📤 GET /stats - Envoie les statistiques au frontend
app.get('/stats', (req, res) => {
  try {
    const { since } = req.query;

    // Polling intelligent - vérifier si des changements ont eu lieu
    if (since) {
      const sinceTimestamp = parseInt(since);
      if (sinceTimestamp >= lastUpdateTimestamp) {
        return res.status(304).json({
          message: 'Aucune modification depuis la dernière requête'
        });
      }
    }

    res.json({
      success: true,
      timestamp: lastUpdateTimestamp,
      data: {
        stats: wasteStats,
        lastUpdate: new Date(lastUpdateTimestamp).toISOString(),
        detectionHistory: detectionHistory.slice(0, 20) // 20 dernières détections
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les statistiques'
    });
  }
});

// 📊 GET /history - Historique complet des détections
app.get('/history', (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const limitNum = Math.min(parseInt(limit), 100);
    const offsetNum = parseInt(offset);

    const paginatedHistory = detectionHistory.slice(offsetNum, offsetNum + limitNum);

    res.json({
      success: true,
      data: {
        detections: paginatedHistory,
        total: detectionHistory.length,
        limit: limitNum,
        offset: offsetNum
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer l\'historique'
    });
  }
});

// 🔄 POST /reset - Reset des statistiques (pour les tests)
app.post('/reset', (req, res) => {
  try {
    wasteStats = {
      total: 0,
      jaune: 0,
      bleu: 0,
      vert: 0,
      rouge: 0,
      noir: 0,
      blanc: 0
    };
    detectionHistory = [];
    lastUpdateTimestamp = Date.now();

    console.log(`[${new Date().toISOString()}] Statistiques réinitialisées`);

    res.json({
      success: true,
      message: 'Statistiques réinitialisées avec succès',
      timestamp: lastUpdateTimestamp
    });

  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de réinitialiser les statistiques'
    });
  }
});

// 📡 GET /status - État du système
app.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      'POST /tri': 'Recevoir détections ESP-01',
      'GET /stats': 'Statistiques de tri',
      'GET /history': 'Historique des détections',
      'POST /reset': 'Réinitialiser les données',
      'GET /status': 'État du système'
    }
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  res.status(500).json({
    error: 'Erreur serveur interne',
    message: 'Une erreur inattendue s\'est produite'
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    message: `L'endpoint ${req.method} ${req.originalUrl} n'existe pas`
  });
});

// Démarrage du serveur
app.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur API démarré sur le port ${PORT}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   POST http://localhost:${PORT}/tri`);
  console.log(`   GET  http://localhost:${PORT}/stats`);
  console.log(`   GET  http://localhost:${PORT}/history`);
  console.log(`   POST http://localhost:${PORT}/reset`);
  console.log(`   GET  http://localhost:${PORT}/status`);
  console.log(`\n🔧 Prêt à recevoir les données ESP-01!`);
});

module.exports = app;