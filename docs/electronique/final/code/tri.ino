#define S2 2
#define S3 3
#define OUT 4
#define LDR_ENTREE A0
#define LDR_COULEUR A1
#define EMERGENCY_BTN 9
#define LASER_1 11
#define LASER_2 12
#define RELAY_PIN 5 // Broche pour le relais
#define LED_ROUGE 6 // Broche pour la LED rouge
#define LED_BLEU 7 // Broche pour la LED bleue
#define LED_VERT 8 // Broche pour la LED verte
#define LED_JAUNE 10 // Broche pour la LED jaune

bool moteurEnMarche = false;
byte red = 0, green = 0, blue = 0;

void setup() {
  Serial.begin(9600);
  Serial.println("🟢 Démarrage du système...");
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(OUT, INPUT);
  pinMode(LDR_ENTREE, INPUT);
  pinMode(LDR_COULEUR, INPUT);
  pinMode(EMERGENCY_BTN, INPUT_PULLUP);
  pinMode(LASER_1, OUTPUT);
  pinMode(LASER_2, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_ROUGE, OUTPUT);
  pinMode(LED_BLEU, OUTPUT);
  pinMode(LED_VERT, OUTPUT);
  pinMode(LED_JAUNE, OUTPUT);

  digitalWrite(LASER_1, HIGH);
  digitalWrite(LASER_2, HIGH);
  digitalWrite(RELAY_PIN, LOW); 

  Serial.println("✅ Système prêt !");
}

void loop() {
  if (digitalRead(EMERGENCY_BTN) == LOW) {
    stopConvoyeur();
    Serial.println("🚨 Arrêt d'urgence activé !");
    while (digitalRead(EMERGENCY_BTN) == LOW); // attendre relâchement
    Serial.println("🔄 Urgence levée");
  }

  bool presence = analogRead(LDR_ENTREE) < 800;
  bool dansZoneCouleur = analogRead(LDR_COULEUR) < 800;

  if (presence && !moteurEnMarche) {
    Serial.println("📦 Déchet détecté ➜ démarrage du convoyeur");
    demarrerConvoyeur();
  }

  if (!presence) {
    Serial.println("⚠️ Plus de déchet ➜ arrêt du convoyeur");
    stopConvoyeur();
  }

  if (dansZoneCouleur) {
    Serial.println("📍 Déchet en zone de détection ➜ arrêt");
    stopConvoyeur();
    String couleur = detecterCouleur();
    Serial.println("🎨 Couleur détectée : " + couleur);
    Serial.println("📤 Envoi à l’ESP01...");
    Serial.println(couleur);  // UART vers ESP01

    // Allumer la LED correspondante
    allumerLED(couleur);

    // Attendre le retrait du cube
    Serial.println("⏳ Attente du retrait du déchet...");
    while (analogRead(LDR_COULEUR) < 800);
    delay(100);
    Serial.println("✅ Déchet retiré ➜ redémarrage");
    // Éteindre toutes les LEDs après le retrait du déchet
    digitalWrite(LED_ROUGE, LOW);
    digitalWrite(LED_BLEU, LOW);
    digitalWrite(LED_VERT, LOW);
    digitalWrite(LED_JAUNE, LOW);
  }
}

void demarrerConvoyeur() {
  moteurEnMarche = true;
  Serial.println("▶️ Convoyeur en marche");
  digitalWrite(RELAY_PIN, HIGH); // Activer le relais pour démarrer le moteur
}

void stopConvoyeur() {
  moteurEnMarche = false;
  Serial.println("⏹️ Convoyeur arrêté");
  digitalWrite(RELAY_PIN, LOW); // Désactiver le relais pour arrêter le moteur
}

String detecterCouleur() {
  while (true) {
    lireCouleur();
    Serial.print("🔍 RGB: R="); Serial.print(red);
    Serial.print(" G="); Serial.print(green);
    Serial.print(" B="); Serial.println(blue);
    if (red < 11 && green > 15 && blue > 15) return "rouge";
    if (red > 15 && green > 15 && blue < 11) return "bleu";
    if (red < 11 && blue < 11 && green < 11) return "vert";
    if (red < 10 && blue > 10 && green < 11)) return "jaune";
    delay(100);  // attendre avant prochaine lecture
  }
}

void lireCouleur() {
  digitalWrite(S2, LOW); digitalWrite(S3, LOW);
  red = pulseIn(OUT, digitalRead(OUT) == HIGH ? LOW : HIGH);
  digitalWrite(S3, HIGH);
  blue = pulseIn(OUT, digitalRead(OUT) == HIGH ? LOW : HIGH);
  digitalWrite(S2, HIGH);
  green = pulseIn(OUT, digitalRead(OUT) == HIGH ? LOW : HIGH);
}

void allumerLED(String couleur) {
  if (couleur == "rouge") {
    digitalWrite(LED_ROUGE, HIGH);
  } else if (couleur == "bleu") {
    digitalWrite(LED_BLEU, HIGH);
  } else if (couleur == "vert") {
    digitalWrite(LED_VERT, HIGH);
  } else if (couleur == "jaune") {
    digitalWrite(LED_JAUNE, HIGH);
  }
}
