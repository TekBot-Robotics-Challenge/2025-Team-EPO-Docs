#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define SERIAL_BAUD 9600

const char* ssid = "HONOR Pad 8";
const char* password = "12345678";

const char* apiUrl = "http://10.28.172.240:3001/tri"; // Remplace par ton IP + port

void setup() {
  Serial.begin(SERIAL_BAUD);
  WiFi.begin(ssid,password);

  Serial.println("🔌 Connexion au WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("✅ Connecté au WiFi !");
  Serial.print("🔗 IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (Serial.available()) {
    String couleur = Serial.readStringUntil('\n');
    couleur.trim();  // Nettoie les sauts de ligne

    if (couleur.length() > 0) {
      Serial.println("🎨 Couleur reçue : " + couleur);
      envoyerDonnees(couleur);
    }
  }
}

void envoyerDonnees(const String& couleur) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client;

    http.begin(client, apiUrl);
    http.addHeader("Content-Type", "application/json");

    // Création du JSON avec couleur + timestamp
    String payload = "{";
    payload += "\"couleur\":\"" + couleur + "\",";
    payload += "\"timestamp\":\"" + String(millis()) + "\"";  // simple timestamp
    payload += "}";

    Serial.println("📤 Envoi POST à l’API : " + payload);
    int httpCode = http.POST(payload);

    if (httpCode > 0) {
      String response = http.getString();
      Serial.println("✅ Réponse API : " + response);
    } else {
      Serial.println("❌ Erreur HTTP : " + String(httpCode));
    }

    http.end();
  } else {
    Serial.println("🚫 WiFi non connecté !");
  }
}
