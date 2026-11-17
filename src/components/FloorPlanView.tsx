import React from 'react';
import { LayoutOption } from '../types';

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
  const padding = 32;
  const scale = Math.min(300 / roomWidthMm, 390 / roomDepthMm);
  const svgWidth = roomWidthMm * scale + padding * 2;
  const svgHeight = roomDepthMm * scale + padding * 2;

  const roomX = padding;
  const roomY = padding;
  const roomW = roomWidthMm * scale;
  const roomH = roomDepthMm * scale;

  // 인테리어 소프트 파스텔 컬러 매핑
  const getFurnitureStyles = (type: string) => {
    switch (type) {
      case 'bed':
        return { fill: '#EFF6FF', stroke: '#2563EB', text: '#1E40AF', sub: '#3B82F6' };
      case 'desk':
        return { fill: '#ECFDF5', stroke: '#059669', text: '#065F46', sub: '#10B981' };
      case 'wardrobe':
        return { fill: '#FAF5FF', stroke: '#7C3AED', text: '#5B21B6', sub: '#8B5CF6' };
      case 'shelf':
      default:
        return { fill: '#FFFBEB', stroke: '#D97706', text: '#92400E', sub: '#F59E0B' };
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col items-center select-none">
      <div className="flex items-center justify-between w-full mb-3 px-1 text-xs text-slate-500">
        <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          2D 룸테트리스 평면도 ({activeOption.title.split(':')[0]})
        </span>
        <span className="font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
          {roomWidthMm} x {roomDepthMm} mm
        </span>
      </div>

      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full max-w-[340px] h-auto drop-shadow-xs"
      >
        <defs>
          {/* 밝은 건축 모눈 그리드 */}
          <pattern id="lightGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.8" />
          </pattern>
          {/* 화살표 마커 */}
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#059669" />
          </marker>
        </defs>

        {/* 방 바닥 배경 (클린 화이트 & 모눈) */}
        <rect
          x={roomX}
          y={roomY}
          width={roomW}
          height={roomH}
          fill="#FAFAFA"
          stroke="#334155"
          strokeWidth="4"
          rx="4"
        />
        <rect
          x={roomX}
          y={roomY}
          width={roomW}
          height={roomH}
          fill="url(#lightGrid)"
        />

        {/* 1. 창문 (상단 벽면) */}
        {windowWall === 'top' && (
          <g>
            <rect
              x={roomX + roomW * 0.25}
              y={roomY - 4}
              width={roomW * 0.5}
              height={8}
              fill="#0284C7"
              rx="2"
            />
            <text
              x={roomX + roomW * 0.5}
              y={roomY - 8}
              fill="#0284C7"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              창문 (채광/환기)
            </text>
          </g>
        )}

        {/* 2. 출입문 & 800mm 개폐 반경 위험 구역 */}
        <g>
          {/* 800mm 문 열림 호선 */}
          <path
            d={`M ${roomX + 5} ${roomY + roomH} A ${800 * scale} ${800 * scale} 0 0 1 ${roomX + 5 + 800 * scale} ${roomY + roomH - 800 * scale}`}
            fill="none"
            stroke="#E11D48"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          {/* 열린 문 잎 */}
          <line
            x1={roomX + 5}
            y1={roomY + roomH}
            x2={roomX + 5}
            y2={roomY + roomH - 800 * scale}
            stroke="#E11D48"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <text
            x={roomX + 15}
            y={roomY + roomH - 10}
            fill="#E11D48"
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
          const styles = getFurnitureStyles(item.type);

          return (
            <g key={item.id} className="transition-all duration-300">
              {/* 가구 사각형 */}
              <rect
                x={itemX}
                y={itemY}
                width={itemW}
                height={itemH}
                fill={styles.fill}
                stroke={styles.stroke}
                strokeWidth="2"
                rx="4"
              />

              {/* 침대 베개 디테일 */}
              {item.type === 'bed' && (
                <rect
                  x={itemX + itemW * 0.15}
                  y={itemY + itemH * 0.06}
                  width={itemW * 0.7}
                  height={itemH * 0.14}
                  fill="#DBEAFE"
                  stroke="#93C5FD"
                  strokeWidth="1"
                  rx="3"
                />
              )}

              {/* 책상 모니터 디테일 */}
              {item.type === 'desk' && (
                <line
                  x1={itemX + itemW * 0.25}
                  y1={itemY + itemH * 0.18}
                  x2={itemX + itemW * 0.75}
                  y2={itemY + itemH * 0.18}
                  stroke={styles.sub}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* 가구 텍스트 */}
              <text
                x={itemX + itemW / 2}
                y={itemY + itemH / 2 - 2}
                fill={styles.text}
                fontSize="10"
                fontWeight="extrabold"
                textAnchor="middle"
              >
                {item.name.split(' ')[0]}
              </text>
              <text
                x={itemX + itemW / 2}
                y={itemY + itemH / 2 + 10}
                fill={styles.sub}
                fontSize="8"
                fontWeight="bold"
                textAnchor="middle"
              >
                {item.widthMm}x{item.depthMm}
              </text>
            </g>
          );
        })}

        {/* 4. 보행 동선 화살표 가이드 (Green Path) */}
        <path
          d={`M ${roomX + roomW * 0.45} ${roomY + roomH - 25} L ${roomX + roomW * 0.45} ${roomY + roomH * 0.4}`}
          fill="none"
          stroke="#059669"
          strokeWidth="2"
          strokeDasharray="4 3"
          markerEnd="url(#arrow)"
        />
        <text
          x={roomX + roomW * 0.48}
          y={roomY + roomH * 0.65}
          fill="#059669"
          fontSize="9"
          fontWeight="bold"
        >
          통로 확보(600mm+)
        </text>
      </svg>

      {/* 범례 (Legend) */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-50 border border-blue-500" /> 침대 (SS)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-500" /> 책상
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-50 border border-purple-500" /> 옷장/수납
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border border-rose-500 border-dashed" /> 문 열림 반경
        </span>
      </div>
    </div>
  );
};
