export type AppMode = 'new_layout' | 'declutter';

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

// 신규 추가: 살고 있는 방/거실 짐정리 & 재배치 분석 타입
export type DeclutterProblemType = 
  | 'floor_clutter'     // 바닥에 짐이 널브러져 발 디딜 틈 없음
  | 'blocked_doors'     // 가구가 문이나 창문을 가려 답답함
  | 'lack_storage'      // 옷과 잡동사니 수납공간이 절대 부족
  | 'add_new_furniture';// 새 가구(책상/수납장) 1개 추가하고 싶음

export interface DeclutterMoveItem {
  furnitureName: string;
  from: string;
  to: string;
  reason: string;
}

export interface BudgetItemRecommendation {
  name: string;
  specGuide: string;
  purpose: string;
  searchKeyword: string;
  priceRange: string;
}

export interface DeclutterAnalysisResult {
  id: string;
  createdAt: string;
  imageUrl?: string;
  roomType: string;
  diagnosis: {
    blockedCorridor: string;
    deadSpace: string;
  };
  step1_storage: {
    floorClearAction: string;
    deadSpaceAction: string;
  };
  step2_rearrange: {
    moves: DeclutterMoveItem[];
    gainedSpaceDescription: string;
  };
  step3_budgetItems: BudgetItemRecommendation[];
}
