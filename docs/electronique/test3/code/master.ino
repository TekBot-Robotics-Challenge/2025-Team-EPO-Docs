#include <Wire.h>
#include <Servo.h>

// Servomoteurs pour les segments a, b, c, d
Servo servos[4];
const int servoPins[4] = {3, 5, 6, 9}; // PWM pins pour a, b, c, d

// Adresse I2C de l'esclave
const int slaveAddress = 0x08;

// Représentation des chiffres de 0 à 9 sur les 7 segments
const byte chiffres[10][7] = {
  {1, 1, 1, 1, 1, 1, 0},  // 0
  {0, 1, 1, 0, 0, 0, 0},  // 1
  {1, 1, 0, 1, 1, 0, 1},  // 2
  {1, 1, 1, 1, 0, 0, 1},  // 3
  {0, 1, 1, 0, 0, 1, 1},  // 4
  {1, 0, 1, 1, 0, 1, 1},  // 5
  {1, 0, 1, 1, 1, 1, 1},  // 6
  {1, 1, 1, 0, 0, 0, 0},  // 7
  {1, 1, 1, 1, 1, 1, 1},  // 8
  {1, 1, 1, 1, 0, 1, 1}   // 9
};

int compteur = 0;
bool croissant = true;
unsigned long previousMillis = 0;
const unsigned long interval = 1000; // 1 seconde

void setup() {
  Wire.begin(); // Mode maître
  for (int i = 0; i < 4; i++) {
    servos[i].attach(servoPins[i]);
  }
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    // Envoyer les segments e, f, g à l'esclave
    Wire.beginTransmission(slaveAddress);
    Wire.write(chiffres[compteur][4]); // e
    Wire.write(chiffres[compteur][5]); // f
    Wire.write(chiffres[compteur][6]); // g
    Wire.endTransmission();

    // Piloter les segments a, b, c, d
    for (int i = 0; i < 4; i++) {
      if (chiffres[compteur][i] == 1) {
        servos[i].write(0);    // angle ON
      } else {
        servos[i].write(90);   // angle OFF
      }
    }

    // Mise à jour du compteur
    if (croissant) {
      compteur++;
      if (compteur == 9) croissant = false;
    } else {
      compteur--;
      if (compteur == 0) croissant = true;
    }
  }
}
