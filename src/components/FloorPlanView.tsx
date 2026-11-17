import React from 'react';
import { LayoutOption, FurnitureItem } from '../types';

interface FloorPlanViewProps {
  roomWidthMm: number;
  roomDepthMm: number;
  activeOption: LayoutOption;
  windowWall?: 'top' | 'right' | 'bottom' | 'left';
  doorPosition?: string;
}

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({
  roomWidthMm = 2400,
  roomDepthMm = 3500,
  activeOption,
  windowWall = 'top',
  doorPosition = 'bottom-left'
}) => {
  // SVG 캔버스 비율 계산 (최대 360 x 480 뷰포트)
  const padding = 30;
  const scale = Math.min(300 / roomWidthMm, 400 / roomDepthMm);
  const svgWidth = roomWidthMm * scale + padding * 2;
  const svgHeight = roomDepthMm * scale + padding * 2;

  const roomX = padding;
  const roomY = padding;
  const roomW = roomWidthMm * scale;
  const roomH = roomDepthMm * scale;

  return (
    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center select-none shadow-inner">
      <div className="flex items-center justify-between w-full mb-2 px-1 text-xs text-slate-400">
        <span className="font-bold text-slate-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          2D 룸테트리스 평면도 ({activeOption.title.split(':')[0]})
        </span>
        <span>{roomWidthMm} x {roomDepthMm} mm</span>
      </div>

      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full max-w-[340px] h-auto drop-shadow-md"
      >
        <defs>
          {/* 바닥 모눈 패턴 */}
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.6" />
          </pattern>
          {/* 문 열림 위험 구역 패턴 */}
          <pattern id="dangerZone" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" />
          </pattern>
        </defs>

        {/* 방 바닥 배경 */}
        <rect
          x={roomX}
          y={roomY}
          width={roomW}
          height={roomH}
          fill="#090d16"
          stroke="#475569"
          strokeWidth="4"
          rx="4"
        />
        <rect
          x={roomX}
          y={roomY}
          width={roomW}
          height={roomH}
          fill="url(#grid)"
        />

        {/* 1. 창문 (상단 벽면 기준) */}
        {windowWall === 'top' && (
          <g>
            <rect
              x={roomX + roomW * 0.25}
              y={roomY - 4}
              width={roomW * 0.5}
              height={8}
              fill="#38bdf8"
              rx="2"
            />
            <text
              x={roomX + roomW * 0.5}
              y={roomY - 8}
              fill="#38bdf8"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              창문 (채광/환기)
            </text>
          </g>
        )}

        {/* 2. 출입문 & 문 열림 반경 (800mm 간섭 데드존) */}
        <g>
          {/* 800mm 문 열림 호선 (Keep Out 데드존) */}
          <path
            d={`M ${roomX + 5} ${roomY + roomH} A ${800 * scale} ${800 * scale} 0 0 1 ${roomX + 5 + 800 * scale} ${roomY + roomH - 800 * scale}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          {/* 열린 문 잎 (800mm leaf) */}
          <line
            x1={roomX + 5}
            y1={roomY + roomH}
            x2={roomX + 5}
            y2={roomY + roomH - 800 * scale}
            stroke="#f87171"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text
            x={roomX + 15}
            y={roomY + roomH - 12}
            fill="#f87171"
            fontSize="9"
            fontWeight="bold"
          >
            방문 800mm (간섭 주의)
          </text>
        </g>

        {/* 3. 배치된 가구 블록들 */}
        {activeOption.furniture.map((item) => {
          const itemX = roomX + item.xMm * scale;
          const itemY = roomY + item.yMm * scale;
          const itemW = item.widthMm * scale;
          const itemH = item.depthMm * scale;

          return (
            <g key={item.id} className="transition-all duration-300">
              {/* 가구 블록 사각형 */}
              <rect
                x={itemX}
                y={itemY}
                width={itemW}
                height={itemH}
                fill={`${item.color}35`}
                stroke={item.color}
                strokeWidth="2"
                rx="3"
              />

              {/* 침대일 경우 베개 및 이불 디테일 */}
              {item.type === 'bed' && (
                <rect
                  x={itemX + itemW * 0.15}
                  y={itemY + itemH * 0.05}
                  width={itemW * 0.7}
                  height={itemH * 0.15}
                  fill="#ffffff30"
                  rx="2"
                />
              )}

              {/* 책상일 경우 모니터/의자 라인 */}
              {item.type === 'desk' && (
                <line
                  x1={itemX + itemW * 0.25}
                  y1={itemY + itemH * 0.15}
                  x2={itemX + itemW * 0.75}
                  y2={itemY + itemH * 0.15}
                  stroke="#ffffff60"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* 가구 라벨 및 치수 텍스트 */}
              <text
                x={itemX + itemW / 2}
                y={itemY + itemH / 2 - 2}
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {item.name.split(' ')[0]}
              </text>
              <text
                x={itemX + itemW / 2}
                y={itemY + itemH / 2 + 10}
                fill="#cbd5e1"
                fontSize="8"
                textAnchor="middle"
              >
                {item.widthMm}x{item.depthMm}
              </text>
            </g>
          );
        })}

        {/* 4. 보행 동선 화살표 가이드 (Green Path) */}
        <path
          d={`M ${roomX + roomW * 0.45} ${roomY + roomH - 30} L ${roomX + roomW * 0.45} ${roomY + roomH * 0.4}`}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray="4 4"
          markerEnd="url(#arrow)"
        />
        <text
          x={roomX + roomW * 0.48}
          y={roomY + roomH * 0.65}
          fill="#10b981"
          fontSize="9"
          fontWeight="bold"
        >
          통로 확보(600mm+)
        </text>
      </svg>

      {/* 범례 (Legend) */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-blue-500/80 border border-blue-400" /> 침대 (SS)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/80 border border-emerald-400" /> 책상
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-purple-500/80 border border-purple-400" /> 옷장/수납
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded border border-rose-500 border-dashed" /> 문 열림 반경
        </span>
      </div>
    </div>
  );
};
