#include <Wire.h>
#include <Servo.h>

// Servomoteurs pour les segments e, f, g
Servo servos[3];
const int servoPins[3] = {3, 5, 6}; // PWM pins pour e, f, g

byte segments[3] = {0, 0, 0}; // Valeurs reçues du maître
byte lastSegments[3] = {2, 2, 2}; // Valeurs précédentes (2 = valeur impossible, pour forcer le 1er affichage)

void setup() {
  Wire.begin(0x08); // Adresse I2C de l’esclave
  Wire.onReceive(recevoirData);

  for (int i = 0; i < 3; i++) {
    servos[i].attach(servoPins[i]);
  }
}

void loop() {
  // Actualiser les servos uniquement si une valeur a changé
  for (int i = 0; i < 3; i++) {
    if (segments[i] != lastSegments[i]) {
      if (segments[i] == 1)
        servos[i].write(0);   // Position ON
      else
        servos[i].write(90);  // Position OFF
      lastSegments[i] = segments[i];
    }
  }

  // Pas de delay() ici → boucle continue non bloquante
}

// Réception des segments e, f, g depuis le maître
void recevoirData(int nbOctets) {
  for (int i = 0; i < 3 && Wire.available(); i++) {
    segments[i] = Wire.read();
  }
}
