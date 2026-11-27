import { RoomPreset, RoomAnalysisResult } from '../types';

export const ROOM_PRESETS: RoomPreset[] = [
  {
    id: 'studio_5py',
    name: '5평 초소형 직사각형 원룸',
    subtitle: '2.4m x 3.5m (약 16.5㎡)',
    areaPyeong: '5평',
    widthMm: 2400,
    depthMm: 3500,
    windowWall: 'top',
    doorPosition: 'bottom-left',
    description: '대학가, 고시텔 개조형 원룸. 문 열림 반경과 창문 간섭 회피가 생존의 핵심.',
    icon: 'Maximize2'
  },
  {
    id: 'officetel_7py',
    name: '7평 표준 오피스텔 (빌트인형)',
    subtitle: '2.8m x 4.2m (약 23㎡)',
    areaPyeong: '7평',
    widthMm: 2800,
    depthMm: 4200,
    windowWall: 'top',
    doorPosition: 'bottom-center',
    description: '한쪽 벽면 전체가 신발장·주방·옷장 빌트인 구조. 잔여 가용 벽면 2개 활용 집중.',
    icon: 'Building'
  },
  {
    id: 'studio_9py',
    name: '9평 분리형 원룸 / 1.5룸',
    subtitle: '3.2m x 4.5m (약 29㎡)',
    areaPyeong: '9평',
    widthMm: 3200,
    depthMm: 4500,
    windowWall: 'top',
    doorPosition: 'bottom-left',
    description: '주방 분리형 또는 중문 구조. 침실 영역과 작업/거실 영역의 완벽한 2분할 가능.',
    icon: 'Columns'
  },
  {
    id: 'villa_12py',
    name: '12평 소형 빌라 (안방)',
    subtitle: '3.4m x 3.6m (약 39㎡ 중 메인 룸)',
    areaPyeong: '12평형 안방',
    widthMm: 3400,
    depthMm: 3600,
    windowWall: 'top',
    doorPosition: 'left',
    description: '구축 빌라 특유의 정사각형 구조. 벽면 몰딩과 방문/베란다문 양방향 간섭 주의.',
    icon: 'Home'
  }
];

export const PRESET_ANALYSIS_DATABASE: Record<string, RoomAnalysisResult> = {
  studio_5py: {
    id: 'res-5py',
    createdAt: new Date().toISOString(),
    roomDimensions: { widthMm: 2400, depthMm: 3500 },
    roomSummary: {
      sizeAndFeatures: '가로 2400mm x 세로 3500mm (실평수 약 5평 내외). 전형적인 1인 가구 직사각형 튜브형 원룸 구조로 여유 통로 폭이 극도로 제한적입니다.',
      keyPoints: '정면 상단 전창 채광, 좌측 하단 방문 개폐 반경 800mm 발생. 침대를 어디에 두느냐에 따라 방 중앙 통로(최소 600mm) 확보 여부가 결정됩니다.'
    },
    options: {
      optionA: {
        id: 'optionA',
        title: '옵션 A: [휴식 집중형 배치]',
        badge: '수면 독립형',
        description: '창가 안쪽 우측 벽면에 슈퍼싱글(1100x2000mm) 침대를 밀착 배치하고, 방문 반대편 안쪽 벽면에 1000x500mm 데스크를 배치합니다.',
        advantages: '방문 진입 시 시야가 트이며, 수면 시 현관/복도 소음으로부터 가장 먼 안쪽 공간을 독립적으로 확보할 수 있습니다.',
        furniture: [
          {
            id: 'bed-1',
            name: '슈퍼싱글(SS) 수납침대',
            type: 'bed',
            widthMm: 1100,
            depthMm: 2050,
            xMm: 1250,
            yMm: 50,
            rotation: 0,
            label: '침대 (SS 1100x2000)',
            color: '#3B82F6',
            recommendedSpec: '폭 1100mm 서랍형 프레임',
            searchKeyword: '슈퍼싱글 수납침대 1100'
          },
          {
            id: 'desk-1',
            name: '콤팩트 컴퓨터 데스크',
            type: 'desk',
            widthMm: 1000,
            depthMm: 550,
            xMm: 50,
            yMm: 50,
            rotation: 0,
            label: '책상 (1000x550)',
            color: '#10B981',
            recommendedSpec: '1000 x 550 mm 이하',
            searchKeyword: '1인용 컴퓨터 책상 1000'
          },
          {
            id: 'wardrobe-1',
            name: '슬라이딩 2단 행거장',
            type: 'wardrobe',
            widthMm: 800,
            depthMm: 500,
            xMm: 50,
            yMm: 1800,
            rotation: 0,
            label: '옷장 (800x500)',
            color: '#8B5CF6',
            recommendedSpec: '슬라이딩 도어 필수 (여닫이 불가)',
            searchKeyword: '슬라이딩 옷장 800'
          }
        ]
      },
      optionB: {
        id: 'optionB',
        title: '옵션 B: [작업/재택근무 집중형 배치]',
        badge: '데스크 쾌적형',
        description: '창가 전면 정중앙에 1200x600mm 대형 모니터용 데스크를 배치하여 자연 채광을 확보하고, 침대를 우측 벽면 중앙으로 가로 배치합니다.',
        advantages: '모니터 역광 없이 쾌적한 데스크 작업 공간이 생기며, 화상 회의 시 침대가 노출되지 않는 깔끔한 벽면 배경이 형성됩니다.',
        furniture: [
          {
            id: 'desk-2',
            name: '1200 모니터암 데스크',
            type: 'desk',
            widthMm: 1200,
            depthMm: 600,
            xMm: 600,
            yMm: 50,
            rotation: 0,
            label: '책상 (1200x600 창가)',
            color: '#10B981',
            recommendedSpec: '1200 x 600 mm',
            searchKeyword: '1200 컴퓨터 책상'
          },
          {
            id: 'bed-2',
            name: '싱글(S) 헤드리스 침대',
            type: 'bed',
            widthMm: 1000,
            depthMm: 2000,
            xMm: 1350,
            yMm: 1100,
            rotation: 0,
            label: '침대 (S 1000x2000)',
            color: '#3B82F6',
            recommendedSpec: '헤드리스 싱글 권장 (폭 1000mm)',
            searchKeyword: '헤드리스 싱글침대'
          },
          {
            id: 'wardrobe-2',
            name: '슬림 틈새 행거',
            type: 'wardrobe',
            widthMm: 600,
            depthMm: 450,
            xMm: 50,
            yMm: 1800,
            rotation: 0,
            label: '슬림 행거',
            color: '#8B5CF6',
            recommendedSpec: '폭 600mm 슬림형',
            searchKeyword: '슬림 드레스룸 행거'
          }
        ]
      },
      optionC: {
        id: 'optionC',
        title: '옵션 C: [수납 극대화형 배치]',
        badge: '짐 많은 자취생',
        description: '침대 하부 4단 서랍형 SS침대를 창가 벽면에 올인원 밀착하고, 반대편 벽면에 모듈형 옷장 1400mm를 연결 설치합니다.',
        advantages: '계절 옷과 캐리어, 리빙박스를 침대와 벽면 수납장에 100% 매립하여 바닥 중앙 데드스페이스를 완전히 제거합니다.',
        furniture: [
          {
            id: 'bed-3',
            name: '하이그로시 벙커수납침대',
            type: 'bed',
            widthMm: 1100,
            depthMm: 2050,
            xMm: 1250,
            yMm: 50,
            rotation: 0,
            label: '수납침대 (1100x2050)',
            color: '#3B82F6',
            recommendedSpec: '벙커형 개폐식 수납 프레임',
            searchKeyword: '벙커 수납침대 슈퍼싱글'
          },
          {
            id: 'wardrobe-3',
            name: '2단 모듈 드레스룸',
            type: 'wardrobe',
            widthMm: 1200,
            depthMm: 450,
            xMm: 50,
            yMm: 1000,
            rotation: 0,
            label: '드레스룸 (1200x450)',
            color: '#8B5CF6',
            recommendedSpec: '커튼형 오픈 드레스룸',
            searchKeyword: '모듈형 드레스룸 행거'
          },
          {
            id: 'desk-3',
            name: '접이식/스마트 슬림 데스크',
            type: 'desk',
            widthMm: 800,
            depthMm: 450,
            xMm: 50,
            yMm: 50,
            rotation: 0,
            label: '접이식 데스크 (800x450)',
            color: '#10B981',
            recommendedSpec: '사용 후 접어서 보관 가능한 슬림형',
            searchKeyword: '접이식 1인 컴퓨터 책상'
          }
        ]
      }
    },
    failureGuide: {
      bed: '이 방에는 퀸(Q, 폭 1500mm) 사이즈 절대 불가! 반드시 폭 1100mm 이하의 슈퍼싱글(SS) 또는 싱글(S) 프레임을 선택해야 최소 보행 통로(600mm)가 확보됩니다. 헤드보드가 두꺼운 가죽 프레임은 전장 2200mm를 초과하여 창문을 가리므로 헤드리스(길이 2000mm)를 강력 추천합니다.',
      desk: '가로 1200mm x 깊이 600mm가 설치 가능한 절대적 한계치입니다. 깊이 700~800mm 대형 게이밍 데스크를 구매하면 의자를 뒤로 뺄 공간(최소 750mm)이 침대 프레임에 부딪혀 앉을 수 없게 됩니다.',
      clearance: '출입문 안쪽 열림 반경 800mm 이내에는 높이 600mm 이상의 수납장을 절대 배치하지 마세요. 문이 반만 열리는 대참사가 발생합니다. 또한 걸레받이 몰딩(보통 12~15mm 돌출)으로 인해 실측 가용 폭은 벽면 치수보다 30mm 줄어든다는 점을 가구 주문 전 반드시 계산하세요.'
    }
  },

  officetel_7py: {
    id: 'res-7py',
    createdAt: new Date().toISOString(),
    roomDimensions: { widthMm: 2800, depthMm: 4200 },
    roomSummary: {
      sizeAndFeatures: '가로 2800mm x 세로 4200mm (전용면적 약 7평). 좌측 또는 우측 한 벽면 전체가 빌트인(신발장-싱크대-냉장고-붙박이장)으로 마감되어 있어 실제 가구를 놓을 수 있는 벽면은 창가벽과 반대편 긴 벽 2개뿐입니다.',
      keyPoints: '빌트인 수납장 도어 및 냉장고 문 열림 반경 600mm 침범 금지. 창문 하부 환기창/에어컨 실외기실 도어 간섭 회피가 핵심입니다.'
    },
    options: {
      optionA: {
        id: 'optionA',
        title: '옵션 A: [휴식 집중형 배치]',
        badge: '호텔식 아늑형',
        description: '창가 헤드 배치로 슈퍼싱글 침대를 창가와 반대편 긴 벽 사이에 배치하고, 빌트인 옷장과 간섭 없는 창가 코너에 1200x600mm 데스크를 배치합니다.',
        advantages: '주방 싱크대/조리 공간과 침실 영역이 시각적으로 완벽히 분리되며, 쾌적한 1인 소파 또는 좌식 테이블을 둘 중앙 공간이 남습니다.',
        furniture: [
          {
            id: 'bed-o1',
            name: '슈퍼싱글 패브릭 침대',
            type: 'bed',
            widthMm: 1150,
            depthMm: 2050,
            xMm: 1600,
            yMm: 50,
            rotation: 0,
            label: '침대 (SS 1150x2050)',
            color: '#3B82F6',
            recommendedSpec: '폭 1100~1150mm',
            searchKeyword: '오피스텔 슈퍼싱글 침대'
          },
          {
            id: 'desk-o1',
            name: '1200x600 베이직 데스크',
            type: 'desk',
            widthMm: 1200,
            depthMm: 600,
            xMm: 1550,
            yMm: 2200,
            rotation: 0,
            label: '책상 (1200x600)',
            color: '#10B981',
            recommendedSpec: '가로 1200mm 이하',
            searchKeyword: '1200x600 컴퓨터 데스크'
          }
        ]
      },
      optionB: {
        id: 'optionB',
        title: '옵션 B: [작업/재택근무 집중형 배치]',
        badge: '듀얼모니터 홈오피스',
        description: '창가 정면을 1400x700mm 대형 작업용 데스크로 채우고, 침대를 창가 아래가 아닌 우측 긴 벽면 중앙에 붙여 홈오피스 무드를 구축합니다.',
        advantages: '창 밖 전망을 보며 업무 몰입도가 극대화되며, 의자 가동 반경 900mm가 확보되어 허리가 편안합니다.',
        furniture: [
          {
            id: 'desk-o2',
            name: '1400x700 와이드 워크스테이션',
            type: 'desk',
            widthMm: 1400,
            depthMm: 700,
            xMm: 700,
            yMm: 50,
            rotation: 0,
            label: '데스크 (1400x700)',
            color: '#10B981',
            recommendedSpec: '1400 x 700 mm',
            searchKeyword: '1400 게이밍 컴퓨터 책상'
          },
          {
            id: 'bed-o2',
            name: '슈퍼싱글 서랍형 침대',
            type: 'bed',
            widthMm: 1100,
            depthMm: 2050,
            xMm: 1650,
            yMm: 1200,
            rotation: 0,
            label: '침대 (SS 1100x2050)',
            color: '#3B82F6',
            recommendedSpec: '단면 서랍형 프레임',
            searchKeyword: '서랍형 슈퍼싱글 침대'
          }
        ]
      },
      optionC: {
        id: 'optionC',
        title: '옵션 C: [수납 극대화형 배치]',
        badge: '원룸 파티션 분리형',
        description: '침대와 책상 사이에 폭 1000mm 높이 1200mm 오픈형 책장을 파티션 가벽으로 세워 침실과 서재를 완전 분리합니다.',
        advantages: '수납공간이 30% 증가함과 동시에 원룸 특유의 침대 노출감을 가려주어 호텔 스위트룸 같은 공간 분할 효과를 냅니다.',
        furniture: [
          {
            id: 'bed-o3',
            name: '수납 슈퍼싱글 침대',
            type: 'bed',
            widthMm: 1100,
            depthMm: 2050,
            xMm: 1650,
            yMm: 50,
            rotation: 0,
            label: '침대 (SS 1100x2050)',
            color: '#3B82F6',
            recommendedSpec: '하부 대용량 서랍형',
            searchKeyword: '수납침대 슈퍼싱글'
          },
          {
            id: 'shelf-o3',
            name: '파티션 수납 책장',
            type: 'shelf',
            widthMm: 1000,
            depthMm: 300,
            xMm: 1650,
            yMm: 2150,
            rotation: 0,
            label: '파티션 책장 (1000x300)',
            color: '#F59E0B',
            recommendedSpec: '오픈형 3단 책장',
            searchKeyword: '원룸 파티션 수납 책장'
          },
          {
            id: 'desk-o3',
            name: '1000x600 데스크',
            type: 'desk',
            widthMm: 1000,
            depthMm: 600,
            xMm: 1650,
            yMm: 2500,
            rotation: 0,
            label: '책상 (1000x600)',
            color: '#10B981',
            recommendedSpec: '1000 x 600 mm',
            searchKeyword: '1000 컴퓨터 책상'
          }
        ]
      }
    },
    failureGuide: {
      bed: '빌트인 옷장 문 열림 선으로부터 최소 700mm 이격되지 않으면 옷장 문이 침대 프레임에 걸려 열리지 않습니다. 퀸사이즈(1500mm)는 추천하지 않으며, 만약 퀸을 원한다면 창문 아래 가로 배치만 가능하나 창문 환기창 개폐가 매우 불편해집니다.',
      desk: '가로 1400mm 초과 가구는 권장하지 않습니다. 에어컨 실외기실 점검문 반경(보통 창가 코너에 위치)에 책상이 겹치면 화재/실외기 고장 시 가구를 전부 들어내야 하는 불상사가 생깁니다.',
      clearance: '빌트인 붙박이장 서랍/도어 앞 통로 최소 600mm 확보 필수. 바닥에 러그를 깔 때도 여닫이 도어 하단 틈새(보통 10~15mm)에 걸리지 않는 단모 러그만 선택하세요.'
    }
  }
};
