# 🤖 Plateforme Web Convoyeur Intelligent de Tri

Système de tri intelligent de déchets avec interface web temps réel connectée à un ATMega + ESP-01.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Arduino Nano  │    │    ESP-01    │    │   API Backend   │
│   + Capteurs    │───▶│   Wi-Fi      │───▶│   Express.js    │
│   (TCS3200)     │    │   Module     │    │   Port 3001     │
└─────────────────┘    └──────────────┘    └─────────────────┘
                                                     │
                                                     ▼
                                           ┌─────────────────┐
                                           │  Frontend React │
                                           │  Port 5173      │
                                           └─────────────────┘
```

##  Démarrage 

### 1. Installation des dépendances

```bash
# Frontend React
npm install

# Backend API
cd server
npm install
```

### 2. Démarrage des services

```bash
# Terminal 1 - API Backend
cd server
npm run dev

# Terminal 2 - Frontend React
npm run dev
```

### 3. Test de l'API

```bash
cd server
npm test
```

## 📡 API Endpoints

### 📥 POST /tri
Reçoit les données de l'ESP-01
```json
{
  "couleur": "jaune",
  "timestamp": "2025-01-20T14:30:00Z"
}
```

### 📤 GET /stats
Retourne les statistiques de tri avec polling intelligent
```json
{
  "success": true,
  "timestamp": 1642684200000,
  "data": {
    "stats": {
      "total": 42,
      "jaune": 8,
      "bleu": 6,
      "vert": 7,
      "rouge": 5,
      "noir": 9,
      "blanc": 7
    },
    "detectionHistory": [...]
  }
}
```

### 📊 Autres endpoints
- `GET /history` - Historique complet des détections
- `POST /reset` - Réinitialiser les statistiques
- `GET /status` - État du système

## 🔧 Configuration ESP-01

### Code Arduino pour ESP-01
```cpp
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "VOTRE_WIFI";
const char* password = "VOTRE_MOT_DE_PASSE";
const char* serverURL = "http://192.168.1.100:3001/tri";

void sendDetection(String couleur) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");
    
    StaticJsonDocument<200> doc;
    doc["couleur"] = couleur;
    doc["timestamp"] = "2025-01-20T" + String(millis()) + "Z";
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode > 0) {
      Serial.println("Détection envoyée: " + couleur);
    }
    
    http.end();
  }
}
```

## 🎯 Fonctionnalités

### ✨ Interface Web
- **Animation temps réel** du convoyeur avec visualisation des déchets
- **Compteurs dynamiques** par couleur avec graphiques
- **Synthèse vocale** automatique pour les consignes de tri
- **Historique** des détections avec horodatage
- **Tableau de bord** avec métriques de performance
- **Design responsive** adapté mobile/desktop

### 🔄 API Backend
- **Réception ESP-01** via POST /tri
- **Polling intelligent** avec détection de changements
- **Stockage mémoire** optimisé pour l'IoT
- **Validation** des données entrantes
- **Gestion d'erreurs** robuste

### 🎨 Design
- **Palette industrielle** moderne
- **Animations fluides** et micro-interactions
- **Typographie** claire et hiérarchisée
- **Logos TEKBOT** et TRC 2025 intégrés
- **Thème sombre/clair** adaptatif

##  Tests et Simulation

L'application inclut un mode simulation pour tester sans matériel:
- Génération automatique de détections
- Simulation du comportement ESP-01
- Tests unitaires de l'API
- Validation des endpoints

##  Responsive Design

- **Mobile** (320px+): Interface compacte avec navigation tactile
- **Tablette** (768px+): Layout adapté avec sidebar
- **Desktop** (1024px+): Interface complète avec tous les panneaux

## Sécurité

- Validation stricte des données entrantes
- Limitation du taux de requêtes
- Gestion des erreurs sans exposition d'informations sensibles
- CORS configuré pour la production

##  Performance

- **Polling intelligent** pour réduire la bande passante
- **Stockage mémoire** optimisé
- **Animations GPU** pour la fluidité
- **Lazy loading** des composants

## 🛠️ Technologies

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **Vite** pour le build

### Backend
- **Express.js** + Node.js
- **CORS** pour les requêtes cross-origin

### Matériel
- **microcontroleur** (ATmega328P)
- **ESP-01** (ESP8266)
- **Capteur TCS3200** (détection couleur)
- **LDR** (détection présence)



**TEKBOT - TRC 2025**   **Team EPO**| Système de Tri Intelligent