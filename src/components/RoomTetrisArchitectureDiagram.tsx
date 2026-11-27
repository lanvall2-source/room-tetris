import React from 'react';

export function RoomTetrisArchitectureDiagram() {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 p-4 sm:p-6 shadow-xs break-keep">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200/60">
        <div>
          <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase text-blue-600 block">
            SPATIAL TETRIS ARCHITECTURE
          </span>
          <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            원룸·자취방 3단계 공간 생존 &amp; 가구배치 공식
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full self-start sm:self-auto border border-slate-200">
          가구 구매 실패 0% 프로세스
        </span>
      </div>

      {/* 반응형 SVG 다이어그램 */}
      <div className="w-full">
        <svg
          viewBox="0 0 900 280"
          className="w-full h-auto drop-shadow-2xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 정의: 그라디언트 & 필터 */}
          <defs>
            <linearGradient id="cardGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
            <linearGradient id="cardGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0FDF4" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
            <linearGradient id="cardGrad3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
            <filter id="shadowLight" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.04" />
            </filter>
          </defs>

          {/* 연결 커넥터 1 -> 2 */}
          <path
            d="M 285 140 L 315 140"
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          <polygon points="315,136 323,140 315,144" fill="#64748B" />

          {/* 연결 커넥터 2 -> 3 */}
          <path
            d="M 585 140 L 615 140"
            stroke="#94A3B8"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          <polygon points="615,136 623,140 615,144" fill="#64748B" />

          {/* STEP 01 카드 */}
          <g filter="url(#shadowLight)">
            <rect
              x="20"
              y="20"
              width="265"
              height="240"
              rx="16"
              fill="url(#cardGrad1)"
              stroke="#BFDBFE"
              strokeWidth="1.5"
            />
            {/* Step Badge */}
            <rect x="36" y="36" width="68" height="24" rx="12" fill="#2563EB" />
            <text x="70" y="52" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
              STEP 01
            </text>
            <text x="114" y="52" fill="#2563EB" fontSize="11" fontWeight="700" fontFamily="sans-serif">
              공간 실측 &amp; 프리셋
            </text>

            {/* 카드 제목 */}
            <text x="36" y="86" fill="#0F172A" fontSize="16" fontWeight="800" fontFamily="sans-serif">
              방 크기 &amp; 여유치수 실측
            </text>
            <text x="36" y="106" fill="#64748B" fontSize="11" fontWeight="500" fontFamily="sans-serif">
              평형별 실평수 · 간섭 요소 확인
            </text>

            <line x1="36" y1="120" x2="265" y2="120" stroke="#E2E8F0" strokeWidth="1" />

            {/* 상세 항목 리스트 */}
            <circle cx="44" cy="144" r="3" fill="#2563EB" />
            <text x="54" y="148" fill="#334155" fontSize="12" fontWeight="600" fontFamily="sans-serif">
              5평 / 7평 / 1.5룸 맞춤 프리셋 선택
            </text>

            <circle cx="44" cy="174" r="3" fill="#2563EB" />
            <text x="54" y="178" fill="#334155" fontSize="12" fontWeight="600" fontFamily="sans-serif">
              출입문 개폐 반경 800mm 사수
            </text>

            <circle cx="44" cy="204" r="3" fill="#2563EB" />
            <text x="54" y="208" fill="#334155" fontSize="12" fontWeight="600" fontFamily="sans-serif">
              걸레받이 몰딩 15mm 오차 자동 계산
            </text>

            <rect x="36" y="226" width="233" height="22" rx="6" fill="#EFF6FF" />
            <text x="152" y="241" fill="#1D4ED8" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
              ✓ 사진 업로드 시 추가 맞춤 피드백 지원
            </text>
          </g>

          {/* STEP 02 카드 */}
          <g filter="url(#shadowLight)">
            <rect
              x="320"
              y="20"
              width="265"
              height="240"
              rx="16"
              fill="url(#cardGrad2)"
              stroke="#A7F3D0"
              strokeWidth="1.5"
            />
            {/* Step Badge */}
            <rect x="336" y="36" width="68" height="24" rx="12" fill="#059669" />
            <text x="370" y="52" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
              STEP 02
            </text>
            <text x="414" y="52" fill="#059669" fontSize="11" fontWeight="700" fontFamily="sans-serif">
              가구 테트리스 &amp; 동선
            </text>

            {/* 카드 제목 */}
            <text x="336" y="86" fill="#0F172A" fontSize="16" fontWeight="800" fontFamily="sans-serif">
              2D 가구 테트리스 &amp; 배치
            </text>
            <text x="336" y="106" fill="#64748B" fontSize="11" fontWeight="500" fontFamily="sans-serif">
              침대·책상 골든존 &amp; 보행로 확보
            </text>

            <line x1="336" y1="120" x2="565" y2="120" stroke="#E2E8F0" strokeWidth="1" />

            {/* 상세 항목 리스트 */}
            <circle cx="344" cy="144" r="3" fill="#059669" />
            <text x="354" y="148" fill="#334155" fontSize="12" fontWeight="600" fontFamily="sans-serif">
              최소 보행 통로 폭 600mm 확보
            </text>

            <circle cx="344" cy="174" r="3" fill="#059669" />
            <text x="354" y="178" fill="#334155" fontSize="12" fontWeight="600" fontFamily="sans-serif">
              창문 채광 간섭 &amp; 콘센트 위치 매핑
            </text>

            <circle cx="344" cy="204" r="3" fill="#059669" />
            <text x="354" y="208" fill="#334155" fontSize="12" fontWeight="600" fontFamily="sans-serif">
              1초 만에 확인하는 2D 평면 도면
            </text>

            <rect x="336" y="226" width="233" height="22" rx="6" fill="#ECFDF5" />
            <text x="452" y="241" fill="#047857" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
              ✓ 침대 헤드 및 책상 시선 방향 분리
            </text>
          </g>

          {/* STEP 03 카드 */}
          <g filter="url(#shadowLight)">
            <rect
              x="620"
              y="20"
              width="265"
              height="240"
              rx="16"
              fill="url(#cardGrad3)"
              stroke="#FDE68A"
              strokeWidth="1.5"
            />
            {/* Step Badge */}
            <rect x="636" y="36" width="68" height="24" rx="12" fill="#D97706" />
            <text x="670" y="52" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
              STEP 03
            </text>
            <text x="714" y="52" fill="#D97706" fontSize="11" fontWeight="700" fontFamily="sans-serif">
              비우기 &amp; 스타일링
            </text>

            {/* 카드 제목 */}
            <text x="636" y="86" fill="#0F172A" fontSize="16" fontWeight="800" fontFamily="sans-serif">
              데드스페이스 비우기 &amp; 테마
            </text>
            <text x="636" y="106" fill="#64748B" fontSize="11" fontWeight="500" fontFamily="sans-serif">
              수납 매립 · 3대 감성 스타일링
            </text>

            <line x1="636" y1="120" x2="865" y2="120" stroke="#E2E8F0" strokeWidth="1" />

            {/* 상세 항목 리스트 */}
            <circle cx="644" cy="144" r="3" fill="#D97706" />
            <text x="654" y="148" fill="#334155" fontSize="12" fontWeight="600" fontFamily="sans-serif">
              바닥 짐 공중부양 (수납 침대/틈새장)
            </text>

            <circle cx="644" cy="174" r="3" fill="#D97706" />
            <text x="654" y="178" fill="#334155" fontSize="12" fontWeight="600" fontFamily="sans-serif">
              우드 · 모던 · 코지 3대 테마 실시간 전환
            </text>

            <circle cx="644" cy="204" r="3" fill="#D97706" />
            <text x="654" y="208" fill="#334155" fontSize="12" fontWeight="600" fontFamily="sans-serif">
              가구 추천 규격 &amp; 카카오톡 친구 공유
            </text>

            <rect x="636" y="226" width="233" height="22" rx="6" fill="#FEF3C7" />
            <text x="752" y="241" fill="#B45309" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
              ✓ 토스 사용자 평생 100% 무료 무제한
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
