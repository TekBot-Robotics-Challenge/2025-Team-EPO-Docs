export interface WasteDetection {
  couleur: string;
  timestamp: string;
  id: string;
}

export interface WasteStats {
  total: number;
  jaune: number;
  bleu: number;
  vert: number;
  rouge: number;
  noir: number;
  blanc: number;
}

export interface ConveyorItem {
  id: string;
  couleur: string;
  position: number;
  timestamp: string;
}