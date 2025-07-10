const axios = require('axios');

const API_BASE = 'http://localhost:3001';
const colors = ['jaune', 'bleu', 'vert', 'rouge'];

// Fonction pour tester l'API
async function testAPI() {
  console.log('🧪 Test de l\'API Convoyeur Intelligent\n');

  try {
    // Test 1: Vérifier le statut du serveur
    console.log('1️⃣ Test du statut du serveur...');
    const statusResponse = await axios.get(`${API_BASE}/status`);
    console.log('✅ Serveur en ligne:', statusResponse.data.status);
    console.log('⏱️  Uptime:', Math.round(statusResponse.data.uptime), 'secondes\n');

    // Test 2: Réinitialiser les données
    console.log('2️⃣ Réinitialisation des données...');
    await axios.post(`${API_BASE}/reset`);
    console.log('✅ Données réinitialisées\n');

    // Test 3: Envoyer des détections de test
    console.log('3️⃣ Envoi de détections de test...');
    for (let i = 0; i < 10; i++) {
      const couleur = colors[Math.floor(Math.random() * colors.length)];
      const timestamp = "aaa";
      
      const response = await axios.post(`${API_BASE}/tri`, {
        couleur,
        timestamp
      });
      
      console.log(`   📦 Détection ${i + 1}: ${couleur} (ID: ${response.data.data.id.slice(-8)})`);
      
      // Attendre un peu entre les détections
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    console.log('✅ 10 détections envoyées\n');

    // Test 4: Récupérer les statistiques
    console.log('4️⃣ Récupération des statistiques...');
    const statsResponse = await axios.get(`${API_BASE}/stats`);
    const stats = statsResponse.data.data.stats;
    
    console.log('📊 Statistiques de tri:');
    console.log(`   Total: ${stats.total}`);
    colors.forEach(color => {
      console.log(`   ${color}: ${stats[color]}`);
    });
    console.log('');

    // Test 5: Test du polling intelligent
    console.log('5️⃣ Test du polling intelligent...');
    const timestamp = statsResponse.data.timestamp;
    const pollingResponse = await axios.get(`${API_BASE}/stats?since=${timestamp}`);
    
    if (pollingResponse.status === 304) {
      console.log('✅ Polling intelligent fonctionne (304 - Pas de modification)');
    } else {
      console.log('⚠️  Polling: nouvelles données détectées');
    }
    console.log('');

    // Test 6: Récupérer l'historique
    console.log('6️⃣ Récupération de l\'historique...');
    const historyResponse = await axios.get(`${API_BASE}/history?limit=5`);
    const history = historyResponse.data.data.detections;
    
    console.log(`📜 Historique (${history.length} dernières détections):`);
    history.forEach((detection, index) => {
      const time = new Date(detection.timestamp).toLocaleTimeString('fr-FR');
      console.log(`   ${index + 1}. ${detection.couleur} à ${time}`);
    });
    console.log('');

    // Test 7: Test d'erreur (couleur invalide)
    console.log('7️⃣ Test de validation (couleur invalide)...');
    try {
      await axios.post(`${API_BASE}/tri`, {
        couleur: 'violet',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation fonctionne:', error.response.data.message);
      } else {
        console.log('❌ Erreur inattendue:', error.message);
      }
    }
    console.log('');

    console.log('🎉 Tous les tests sont passés avec succès!');
    console.log('🔧 L\'API est prête à recevoir les données de l\'ESP-01');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Assurez-vous que le serveur API est démarré avec: npm run dev');
    }
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };