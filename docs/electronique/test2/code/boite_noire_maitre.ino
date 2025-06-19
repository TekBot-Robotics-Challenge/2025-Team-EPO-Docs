#include <Wire.h>         // Inclusion de la bibliothèque pour la communication I2C
#include <MPU6050.h>      // Inclusion de la bibliothèque pour le capteur MPU6050 (accéléro + gyroscope)

MPU6050 mpu;              // Création de l'objet mpu pour interagir avec le capteur

const float seuil = 5.0;  // Seuil d’accélération (en m/s²) pour détecter un mouvement significatif

void setup() {
  Wire.begin();           // Initialise la communication I2C en mode maître
  Serial.begin(9600);     // Initialise la communication série à 9600 bauds
  mpu.initialize();       // Initialise le capteur MPU6050

  if (mpu.testConnection()) {          // Vérifie si le capteur répond bien
    Serial.println("MPU6050 OK");      // Si oui, afficher OK dans le moniteur série
  } else {
    Serial.println("Erreur MPU6050 !"); // Sinon, message d'erreur
    while (1);                          // Boucle infinie pour bloquer le programme
  }
}

void loop() {
  int16_t ax, ay, az, gx, gy, gz;               // Variables brutes pour les données accéléro et gyro
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz); // Lecture des 6 données (accéléro + gyroscope)

  // Conversion des données brutes d’accélération en m/s² (résolution du capteur = 16384 LSB/g)
  float ax_ms2 = ax / 16384.0 * 9.81;
  float ay_ms2 = ay / 16384.0 * 9.81;
  float az_ms2 = az / 16384.0 * 9.81;

  // Conversion des données brutes de gyroscope en degrés par seconde (résolution = 131 LSB/°/s)
  float gx_dps = gx / 131.0;
  float gy_dps = gy / 131.0;
  float gz_dps = gz / 131.0;

  // Détection de la direction du mouvement selon les seuils
  String direction = detecterDirection(ax_ms2, ay_ms2, az_ms2);

  // Envoi des données formatées vers un écran LCD via I2C (adresse 0x08)
  envoyerTexte("Direction: " + direction);
  delay(1000);

  envoyerTexte("aX: " + String(ax_ms2, 1) + " m/s2");
  delay(1000);

  envoyerTexte("aY: " + String(ay_ms2, 1) + " m/s2");
  delay(1000);

  envoyerTexte("aZ: " + String(az_ms2, 1) + " m/s2");
  delay(1000);

  envoyerTexte("GyX: " + String(gx_dps, 1) + (char)223 + "/s");  // 223 = symbole degré
  delay(1000);

  envoyerTexte("GyY: " + String(gy_dps, 1) + (char)223 + "/s");
  delay(1000);

  envoyerTexte("GyZ: " + String(gz_dps, 1) + (char)223 + "/s");
  delay(1000);
}

// Fonction pour détecter la direction selon les valeurs d’accélération et le seuil
String detecterDirection(float ax, float ay, float az) {
  if (az > seuil) return "Haut";
  if (az < -seuil) return "Bas";
  if (ax > seuil) return "Droite";
  if (ax < -seuil) return "Gauche";
  if (ay > seuil) return "Avant";
  if (ay < -seuil) return "Arriere";
  return "Stable";
}

// Fonction d’envoi de texte via I2C à l’esclave (ex. : un LCD géré par un autre Arduino)
void envoyerTexte(String texte) {
  Wire.beginTransmission(0x08);         // Début de la transmission à l'adresse esclave 0x08
  for (int i = 0; i < texte.length(); i++) {
    Wire.write(texte[i]);               // Envoie caractère par caractère
  }
  Wire.endTransmission();               // Fin de la transmission I2C
}