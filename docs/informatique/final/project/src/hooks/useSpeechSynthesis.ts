import { useCallback, useEffect, useState } from 'react';

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Charger les voix disponibles
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Chercher une voix française féminine de qualité
      const frenchFemaleVoices = availableVoices.filter(voice => 
        voice.lang.startsWith('fr') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('femme') ||
         voice.name.toLowerCase().includes('amélie') ||
         voice.name.toLowerCase().includes('céline') ||
         voice.name.toLowerCase().includes('marie') ||
         voice.name.toLowerCase().includes('julie') ||
         voice.name.toLowerCase().includes('virginie') ||
         voice.name.toLowerCase().includes('thomas') === false)
      );

      // Prioriser les voix premium/naturelles
      const premiumVoice = frenchFemaleVoices.find(voice => 
        voice.name.toLowerCase().includes('premium') ||
        voice.name.toLowerCase().includes('enhanced') ||
        voice.name.toLowerCase().includes('neural') ||
        voice.name.toLowerCase().includes('natural')
      );

      // Ou prendre la première voix féminine française disponible
      const bestVoice = premiumVoice || frenchFemaleVoices[0] || 
                       availableVoices.find(voice => voice.lang.startsWith('fr')) ||
                       availableVoices[0];

      setSelectedVoice(bestVoice);
    };

    // Charger immédiatement si les voix sont déjà disponibles
    loadVoices();
    
    // Écouter l'événement de chargement des voix
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window && selectedVoice) {
      // Arrêter toute synthèse en cours
      speechSynthesis.cancel();
      
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configuration de la voix
        utterance.voice = selectedVoice;
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9; // Légèrement plus lent pour une meilleure compréhension
        utterance.pitch = 1.1; // Légèrement plus aigu pour une voix plus féminine
        utterance.volume = 0.9;
        
        // Gestion des erreurs
        utterance.onerror = (event) => {
          console.error('Erreur de synthèse vocale:', event.error);
        };
        
        speechSynthesis.speak(utterance);
      }, 100);
    }
  }, [selectedVoice]);

  const announceDetection = useCallback((couleur: string) => {
    const colorMessages: { [key: string]: string } = {
      jaune: "Déchet jaune détecté. Veuillez le placer dans la benne jaune.",
      bleu: "Déchet bleu détecté. Veuillez le placer dans la benne bleue.",
      vert: "Déchet vert détecté. Veuillez le placer dans la benne verte.",
      rouge: "Déchet rouge détecté. Veuillez le placer dans la benne rouge.",
      noir: "Déchet noir détecté. Veuillez le placer dans la benne noire.",
      blanc: "Déchet blanc détecté. Veuillez le placer dans la benne blanche."
    };
    
    const message = colorMessages[couleur] || `Déchet ${couleur} détecté.`;
    speak(message);
  }, [speak]);

  // Fonction pour changer manuellement de voix
  const changeVoice = useCallback((voiceIndex: number) => {
    if (voices[voiceIndex]) {
      setSelectedVoice(voices[voiceIndex]);
    }
  }, [voices]);

  return {
    speak,
    announceDetection,
    voices,
    selectedVoice,
    changeVoice
  };
};