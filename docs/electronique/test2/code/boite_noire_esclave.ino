#include <Wire.h>                // Bibliothèque pour la communication I2C
#include <LiquidCrystal.h>      // Bibliothèque pour contrôler un écran LCD en mode parallèle (4 bits)

// Déclaration des broches pour le mode 4 bits : RS, E, D4, D5, D6, D7
LiquidCrystal lcd(7, 6, 5, 4, 3, 2); // À adapter selon ton câblage physique

String message = "";  // Chaîne utilisée pour stocker les caractères reçus par I2C

void setup() {
  lcd.begin(16, 2);             // Initialise l'écran LCD avec 16 colonnes et 2 lignes
  lcd.clear();                  // Efface l’écran
  lcd.print("En attente...");   // Affiche un message initial

  Wire.begin(0x08);             // Initialise le périphérique I2C comme esclave à l'adresse 0x08
  Wire.onReceive(recevoirDonnees); // Lorsque des données sont reçues, appeler cette fonction
}

void loop() {
  // Boucle vide : tout est géré par interruption via la fonction recevoirDonnees()
}

void recevoirDonnees(int nbOctets) {
  message = "";                         // Réinitialiser le message

  while (Wire.available()) {           // Tant qu’il reste des octets à lire
    char c = Wire.read();              // Lire un caractère depuis le maître I2C
    message += c;                      // L'ajouter à la chaîne message
  }

  lcd.clear();                         // Efface l'écran avant d’afficher un nouveau message
  lcd.setCursor(0, 0);                 // Place le curseur au début de la première ligne

  if (message.length() <= 16) {
    lcd.print(message);               // Si message tient sur une ligne, l’afficher en entier
  } else {
    lcd.print(message.substring(0, 16));   // Affiche les 16 premiers caractères sur la 1re ligne
    lcd.setCursor(0, 1);                   // Passe à la 2e ligne
    lcd.print(message.substring(16, 32));  // Affiche les 16 suivants sur la 2e ligne
  }
}