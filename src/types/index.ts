export type RoomPresetId = 'studio_5py' | 'officetel_7py' | 'studio_9py' | 'villa_12py' | 'custom';

export type WallPosition = 'top' | 'right' | 'bottom' | 'left';

export interface FurnitureItem {
  id: string;
  name: string;
  type: 'bed' | 'desk' | 'wardrobe' | 'shelf' | 'chair' | 'door' | 'window';
  widthMm: number;
  depthMm: number;
  xMm: number;
  yMm: number;
  rotation: 0 | 90 | 180 | 270;
  label: string;
  color: string;
  recommendedSpec?: string;
  searchKeyword?: string;
}

export interface LayoutOption {
  id: 'optionA' | 'optionB' | 'optionC';
  title: string;
  badge: string;
  description: string;
  advantages: string;
  furniture: FurnitureItem[];
}

export interface RoomAnalysisResult {
  id: string;
  createdAt: string;
  roomSummary: {
    sizeAndFeatures: string;
    keyPoints: string;
  };
  options: {
    optionA: LayoutOption;
    optionB: LayoutOption;
    optionC: LayoutOption;
  };
  failureGuide: {
    bed: string;
    desk: string;
    clearance: string;
  };
  imageUrl?: string;
  roomDimensions: {
    widthMm: number;
    depthMm: number;
  };
}

export interface RoomPreset {
  id: RoomPresetId;
  name: string;
  subtitle: string;
  areaPyeong: string;
  widthMm: number;
  depthMm: number;
  windowWall: WallPosition;
  doorPosition: string;
  description: string;
  icon: string;
}
