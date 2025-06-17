#include <Wire.h>                   // Bibliothèque pour la communication I2C
#include <MPU6050.h>                // Bibliothèque pour le capteur MPU6050
#include <LiquidCrystal_I2C.h>      // Bibliothèque pour l'écran LCD I2C

// Création d’un objet pour communiquer avec le MPU6050 (accéléro + gyroscope)
MPU6050 mpu;

// Création de l’objet pour un écran LCD 16x2 à l’adresse I2C 0x27
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Seuil d'accélération (en m/s²) pour déterminer la direction du mouvement
const float seuil = 5.0;

void setup() {
  Wire.begin();                     // Démarrage de la communication I2C
  Serial.begin(9600);              // Démarrage du moniteur série (vitesse : 9600 bauds)

  mpu.initialize();                // Initialisation du capteur MPU6050
  if (mpu.testConnection()) {      // Test de la connexion avec le capteur
    Serial.println("MPU6050 OK");  // Affichage dans le moniteur série si la connexion est bonne
  } else {
    Serial.println("Erreur MPU6050 !"); // Message d'erreur si échec
    while (1);                     // Boucle infinie pour arrêter le programme
  }

  lcd.init();                      // Initialisation de l’écran LCD
  lcd.backlight();                 // Activation du rétroéclairage
  lcd.setCursor(0, 0);
  lcd.print("Initialisation...");
  delay(1000);
  lcd.clear();                     // Efface l’écran après 1 seconde
}

void loop() {
  // Variables pour les données brutes du capteur
  int16_t ax, ay, az;              // Accélérations brutes (sur 16 bits signés)
  int16_t gx, gy, gz;              // Vitesse angulaire brute (gyroscope)

  // Lecture des données du capteur
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  // Conversion des accélérations en m/s²
  float ax_ms2 = ax / 16384.0 * 9.81;
  float ay_ms2 = ay / 16384.0 * 9.81;
  float az_ms2 = az / 16384.0 * 9.81;

  // Conversion du gyroscope en °/s (degré par seconde)
  float gx_dps = gx / 131.0;
  float gy_dps = gy / 131.0;
  float gz_dps = gz / 131.0;

  // Détection de la direction du mouvement
  String direction = detecterDirection(ax_ms2, ay_ms2, az_ms2);

  // Affichage de la direction sur le LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Direction:");
  lcd.setCursor(0, 1);
  lcd.print(direction);
  delay(1000);

  // Affichage des accélérations
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("aX:");
  lcd.print(ax_ms2, 1);
  lcd.print("m/s2");
  lcd.setCursor(0, 1);
  lcd.print("aY:");
  lcd.print(ay_ms2, 1);
  lcd.print("m/s2");
  delay(1000);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("aZ:");
  lcd.print(az_ms2, 1);
  lcd.print("m/s2");
  delay(1000);

  // Affichage des vitesses de rotation (gyroscope)
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("GyX:");
  lcd.print(gx_dps, 1);
  lcd.print((char)223);  // Symbole ° (degré)
  lcd.print("/s");
  lcd.setCursor(0, 1);
  lcd.print("GyY:");
  lcd.print(gy_dps, 1);
  lcd.print((char)223);
  lcd.print("/s");
  delay(1000);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("GyZ:");
  lcd.print(gz_dps, 1);
  lcd.print((char)223);
  lcd.print("/s");
  delay(1000);
}

// === Fonction pour détecter la direction du mouvement selon les accélérations ===
String detecterDirection(float ax, float ay, float az) {
  if (az > seuil) return "Haut";       // Vers le haut
  if (az < -seuil) return "Bas";       // Vers le bas
  if (ax > seuil) return "Droite";     // Vers la droite
  if (ax < -seuil) return "Gauche";    // Vers la gauche
  if (ay > seuil) return "Avant";      // En avant
  if (ay < -seuil) return "Arriere";   // En arrière
  return "Stable";                     // Pas de mouvement significatif
}