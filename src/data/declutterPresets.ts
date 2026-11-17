import { DeclutterAnalysisResult, DeclutterProblemType } from '../types';

export interface DeclutterPresetScenario {
  id: DeclutterProblemType;
  title: string;
  badge: string;
  description: string;
  icon: string;
  result: DeclutterAnalysisResult;
}

export const DECLUTTER_PRESETS: DeclutterPresetScenario[] = [
  {
    id: 'floor_clutter',
    title: '바닥에 짐이 쌓여 발 디딜 틈이 없는 상태',
    badge: '바닥 적체형',
    description: '빨래 건조대, 쇼핑백, 운동기구, 미개봉 박스가 바닥 중앙을 점령해 보행 동선이 막힌 상태',
    icon: 'Boxes',
    result: {
      id: 'dec-floor',
      createdAt: new Date().toISOString(),
      roomType: '원룸 / 1인 가구 침실',
      diagnosis: {
        blockedCorridor: '침대 측면과 책상 사이 바닥에 캐리어와 리빙박스가 겹겹이 쌓여 실제 보행 통로가 300mm 이하로 축소되었습니다. 발끝으로 걸어 다녀야 하며 청소기 진입이 불가능한 상태입니다.',
        deadSpace: '침대 하부 220mm의 거대한 바닥 면적과 방문 뒤쪽 250mm 벽면 틈새가 완전히 비어있어, 수평 바닥 공간만 낭비되고 수직 공간은 방치되어 있습니다.'
      },
      step1_storage: {
        floorClearAction: '바닥에 방치된 의류와 가방은 바닥에서 즉시 퇴출! 폭 800mm 슬림 2단 스탠드 행거를 벽면 코너에 세워 수직으로 20벌 이상 걸어 올리세요.',
        deadSpaceAction: '침대 밑 높이 180mm 이하의 바퀴 달린 언더베드 투명 리빙박스 4개를 투입하여 계절 옷과 잡동사니를 100% 침대 밑으로 숨기세요. 바닥 면적 0.8평이 즉시 복원됩니다.'
      },
      step2_rearrange: {
        moves: [
          {
            furnitureName: '기존 슈퍼싱글 침대',
            from: '방 한가운데 어정쩡하게 떠 있는 위치',
            to: '창가 안쪽 가장자리 벽면으로 90도 회전 밀착',
            reason: '방문을 열었을 때 한눈에 들어오는 중앙 시야를 완전히 개방하고 안쪽 수면 공간을 아늑하게 독립시킵니다.'
          },
          {
            furnitureName: '기존 컴퓨터 책상',
            from: '방문 바로 앞(문 열림 간섭 구역)',
            to: '침대 발치 반대편 벽면(콘센트 인접벽)',
            reason: '방문이 800mm 시원하게 열리며, 의자를 뒤로 뺄 때 침대 프레임에 걸리지 않는 800mm 회전 반경을 확보합니다.'
          },
          {
            furnitureName: '빨래 건조대 & 짐박스',
            from: '방 중앙 통로',
            to: '접이식 원터치 건조대로 교체 후 미사용 시 문 뒤 틈새(150mm) 매립',
            reason: '빨래를 널지 않을 때 방 한가운데 흉물스럽게 차지하던 1㎡ 공간을 완전히 제거합니다.'
          }
        ],
        gainedSpaceDescription: '방 중앙에 가로 1800mm x 세로 1600mm의 탁 트인 빈 바닥이 생겨, 요가 매트를 깔거나 친구가 와도 여유로운 체감 면적 +1.5평 확장 효과를 얻습니다.'
      },
      step3_budgetItems: [
        {
          name: '언더베드 슬라이딩 수납박스 (높이 160mm)',
          specGuide: '가로 800 x 세로 450 x 높이 160 mm (바퀴형 2~4개 세트)',
          purpose: '침대 밑 데드스페이스에 계절 옷/잡화 100% 매립',
          searchKeyword: '침대밑 슬라이딩 수납박스 바퀴형',
          priceRange: '1~2만 원대'
        },
        {
          name: '무타공 슬림 2단 스탠드 행거 (폭 600mm)',
          specGuide: '폭 600 x 깊이 350 x 높이 1600 mm (선반 일체형)',
          purpose: '바닥에 던져두던 겉옷과 가방을 수직 공중부양',
          searchKeyword: '슬림 2단 스탠드 행거 600',
          priceRange: '1~2만 원대'
        },
        {
          name: '접이식 원터치 기둥형 빨래건조대',
          specGuide: '접었을 때 두께 120mm 이하',
          purpose: '빨래 건조 후 문 뒤 틈새에 쏙 넣어 바닥 개방',
          searchKeyword: '접이식 슬림 빨래건조대',
          priceRange: '1만 원대'
        }
      ]
    }
  },
  {
    id: 'blocked_doors',
    title: '가구가 방문이나 창문을 가려 답답한 상태',
    badge: '도어/창문 간섭형',
    description: '옷장이나 책상이 방문 뒤에 걸려 문이 반만 열리거나, 침대가 창문을 절반 가려 환기가 안 되는 상태',
    icon: 'DoorClosed',
    result: {
      id: 'dec-door',
      createdAt: new Date().toISOString(),
      roomType: '6~7평 오피스텔 / 원룸',
      diagnosis: {
        blockedCorridor: '출입문 안쪽 800mm 반경 내에 4단 서랍장이 배치되어 방문이 60도밖에 열리지 않습니다. 이사 짐이나 큰 짐을 들고 나갈 때마다 문콕이 발생합니다.',
        deadSpace: '높이 2100mm의 대형 옷장이 창문 전면을 30% 가로막아 자연 채광이 차단되고 방이 동굴처럼 어두워 보이는 역효과를 내고 있습니다.'
      },
      step1_storage: {
        floorClearAction: '창문을 가리고 있는 높은 옷장 상단의 잡동사니와 박스를 즉시 하부 서랍이나 붙박이장 안으로 재분배하여 창문 시야각을 100% 개방하세요.',
        deadSpaceAction: '문 뒤 100mm 틈새에 방문 걸이형 도어 후크를 걸어 모자, 가방, 에코백 6개를 벽 타공 없이 수납하세요.'
      },
      step2_rearrange: {
        moves: [
          {
            furnitureName: '4단 서랍장',
            from: '방문 바로 뒤(문 개폐 간섭 지점)',
            to: '창가 반대편 콘센트 벽면 코너로 이동',
            reason: '방문이 90도 이상 시원하게 열려 환기와 보행 개방감이 200% 증가합니다.'
          },
          {
            furnitureName: '키 큰 옷장',
            from: '창가 바로 옆(채광 차단 위치)',
            to: '입구 측면 기둥 벽면(어두운 내벽 코너)',
            reason: '창가 채광 라인이 완전히 살아나 자연광이 방 안쪽까지 깊숙이 들어옵니다.'
          }
        ],
        gainedSpaceDescription: '방문 개폐 반경 800mm가 완전히 정상화되어 출입 시 답답함이 사라지고, 창문 채광 면적이 2배 넓어져 방이 훨씬 밝고 쾌적해집니다.'
      },
      step3_budgetItems: [
        {
          name: '방문 걸이형 도어 후크 (무타공 6구)',
          specGuide: '문 두께 35~40mm 호환형 (쿠션 패드 포함)',
          purpose: '문 뒤 죽은 공간에 모자·가방 공중 수납',
          searchKeyword: '방문 도어후크 옷걸이 무타공',
          priceRange: '5천~1만 원대'
        },
        {
          name: '슬림 틈새 3단 트롤리 (폭 200mm)',
          specGuide: '가로 450 x 폭 200 x 높이 750 mm (바퀴형)',
          purpose: '가구 사이 200mm 애매한 틈새에 화장품·생필품 수납',
          searchKeyword: '슬림 틈새 트롤리 20cm',
          priceRange: '1~2만 원대'
        }
      ]
    }
  },
  {
    id: 'lack_storage',
    title: '옷과 잡동사니 수납공간이 절대적으로 부족한 상태',
    badge: '수납 포화형',
    description: '옷장에 옷이 다 안 들어가 의자 위, 침대 위, 박스 속에 분산되어 방이 항상 지저분해 보이는 상태',
    icon: 'Layers',
    result: {
      id: 'dec-storage',
      createdAt: new Date().toISOString(),
      roomType: '원룸 / 투룸 드레스룸',
      diagnosis: {
        blockedCorridor: '의자 등받이와 침대 헤드 위에 입었던 옷들이 산더미처럼 걸쳐져 있어 실질적인 수면 공간과 작업 공간이 침범당했습니다.',
        deadSpace: '기존 옷장 내부 상단과 하단의 남는 400mm 높이 공간을 활용하지 못하고 옷걸이봉 하나에만 의존하고 있어 수납 효율이 40% 수준에 머물러 있습니다.'
      },
      step1_storage: {
        floorClearAction: '기존 옷장 안쪽에 "옷장 분할 수납 선반" 또는 "압축봉 2단 걸이"를 설치하여 기존 옷장의 옷 수납 용량을 즉시 2배로 뻥튀기하세요.',
        deadSpaceAction: '옷걸이를 통일(슬림 논슬립 벨벳 옷걸이)하면 옷 사이 간격이 50% 줄어들어 옷장 하나에 15벌의 옷을 추가로 걸 수 있습니다.'
      },
      step2_rearrange: {
        moves: [
          {
            furnitureName: '산재된 서랍장 & 행거',
            from: '방 좌우로 흩어져 있는 배치',
            to: '한쪽 벽면으로 일렬 라인 정렬(드레스존 단일화)',
            reason: '시선이 분산되지 않고 한쪽 벽면을 완전한 붙박이형 드레스존으로 완성하여 방이 정돈되어 보입니다.'
          }
        ],
        gainedSpaceDescription: '옷장 주변 널브러진 옷더미가 사라지고, 의자와 침대가 본래의 기능을 온전히 되찾습니다.'
      },
      step3_budgetItems: [
        {
          name: '초슬림 논슬립 벨벳 옷걸이 30개 세트',
          specGuide: '두께 5mm 초슬림형 (흘러내림 방지 홈)',
          purpose: '옷장 부피를 절반으로 압축하여 15벌 추가 수납',
          searchKeyword: '초슬림 벨벳 옷걸이 세트',
          priceRange: '1만 원대'
        },
        {
          name: '패브릭 압축 의류 보관함 (대용량)',
          specGuide: '가로 600 x 깊이 400 x 높이 300 mm (투명창 투웨이 지퍼)',
          purpose: '패딩·코트·이불을 압축하여 옷장 상단에 적재',
          searchKeyword: '패브릭 의류 보관함 대용량',
          priceRange: '1만 원대'
        }
      ]
    }
  },
  {
    id: 'add_new_furniture',
    title: '새 가구(책상, 수납장 등)를 하나 더 넣고 싶은 상태',
    badge: '가구 추가형',
    description: '재택근무로 데스크가 필요하거나, 화장대/수납장을 추가하고 싶은데 공간이 안 나와 고민인 상태',
    icon: 'PlusCircle',
    result: {
      id: 'dec-add',
      createdAt: new Date().toISOString(),
      roomType: '소형 평수 원룸 / 거실',
      diagnosis: {
        blockedCorridor: '현재 가구들이 벽면마다 하나씩 흩어져 있어 가로 1000mm 이상의 연속된 빈 벽면이 하나도 나오지 않는 분산 배치 상태입니다.',
        deadSpace: '침대 옆 협탁과 콘센트 사이 400mm 틈새, 그리고 문 옆 800mm 빈 벽이 애매하게 비어있어 대형 가구는 못 넣고 먼지만 쌓이고 있습니다.'
      },
      step1_storage: {
        floorClearAction: '기존 가구들의 위치를 모듈처럼 벽면 라인에 맞춰 바짝 당겨 붙이면 연속된 빈 벽면 1200mm가 즉시 확보됩니다.',
        deadSpaceAction: '새 가구를 살 때 기존 가구의 높이와 수평선(라인)을 맞추면 방이 좁아 보이지 않고 빌트인 가구처럼 정돈된 느낌을 줍니다.'
      },
      step2_rearrange: {
        moves: [
          {
            furnitureName: '기존 1인용 침대',
            from: '창문 중앙 벽면',
            to: '창가 우측 코너 벽면에 바짝 밀착',
            reason: '좌측 벽면에 1200mm 데스크가 들어갈 황금 명당 자리가 단번에 확보됩니다.'
          }
        ],
        gainedSpaceDescription: '기존 가구 간격을 200mm씩 조여서 모아준 결과, 1200x600mm 컴퓨터 데스크를 넣고도 통로 650mm가 그대로 유지됩니다.'
      },
      step3_budgetItems: [
        {
          name: '1200x600 멀티탭 내장 슬림 컴퓨터 데스크',
          specGuide: '가로 1200 x 깊이 600 x 높이 720 mm (하부 프레임 슬림형)',
          purpose: '신규 작업 공간 확보 (통로 침범 제로)',
          searchKeyword: '1200x600 슬림 컴퓨터 책상',
          priceRange: '4~6만 원대'
        },
        {
          name: '슬라이딩 틈새 전신거울 수납장 (폭 300mm)',
          specGuide: '폭 300 x 깊이 400 x 높이 1600 mm (내부 악세서리 수납)',
          purpose: '화장대 대신 거울과 화장품 수납을 30cm에 종결',
          searchKeyword: '전신거울 수납장 30cm',
          priceRange: '3~4만 원대'
        }
      ]
    }
  }
];
