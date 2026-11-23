import React from 'react';
import { LayoutOption, DecorThemeId, DecorAccessoryState } from '../types';
import { Sparkles } from 'lucide-react';

interface FloorPlanViewProps {
  roomWidthMm: number;
  roomDepthMm: number;
  activeOption: LayoutOption;
  windowWall?: 'top' | 'right' | 'bottom' | 'left';
  doorPosition?: string;
  theme?: DecorThemeId;
  accessories?: DecorAccessoryState;
  onToggleAccessory?: (key: keyof DecorAccessoryState) => void;
}

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({
  roomWidthMm = 2400,
  roomDepthMm = 3500,
  activeOption,
  windowWall = 'top',
  doorPosition = 'bottom-left',
  theme = 'wood',
  accessories = { rug: true, mirror: true, plant: true, lamp: true },
  onToggleAccessory,
}) => {
  const padding = 28;
  const scale = Math.min(290 / roomWidthMm, 360 / roomDepthMm);
  const svgWidth = roomWidthMm * scale + padding * 2;
  const svgHeight = roomDepthMm * scale + padding * 2;

  const roomX = padding;
  const roomY = padding;
  const roomW = roomWidthMm * scale;
  const roomH = roomDepthMm * scale;

  // 인테리어 테마별 팔레트
  const themeColors = {
    wood: {
      floor: '#FDFBF7',
      floorGrid: '#F1E9DA',
      wallStroke: '#785A3C',
      rugFill: '#F5EBE1',
      rugStroke: '#D8C7B5',
      bed: { fill: '#F5EBE0', stroke: '#8C6849', text: '#543D2B', sub: '#B08968' },
      desk: { fill: '#E8F5E9', stroke: '#388E3C', text: '#1B5E20', sub: '#4CAF50' },
      wardrobe: { fill: '#EDE7F6', stroke: '#5E35B1', text: '#311B92', sub: '#7E57C2' },
      default: { fill: '#FFF8E1', stroke: '#FFA000', text: '#FF6F00', sub: '#FFB300' },
    },
    modern: {
      floor: '#F8FAFC',
      floorGrid: '#E2E8F0',
      wallStroke: '#334155',
      rugFill: '#E2E8F0',
      rugStroke: '#94A3B8',
      bed: { fill: '#EFF6FF', stroke: '#2563EB', text: '#1E40AF', sub: '#3B82F6' },
      desk: { fill: '#F1F5F9', stroke: '#475569', text: '#0F172A', sub: '#64748B' },
      wardrobe: { fill: '#FFF1F2', stroke: '#E11D48', text: '#9F1239', sub: '#F43F5E' },
      default: { fill: '#F8FAFC', stroke: '#64748B', text: '#334155', sub: '#94A3B8' },
    },
    cozy: {
      floor: '#FFFDF9',
      floorGrid: '#FCE7D6',
      wallStroke: '#9A5B32',
      rugFill: '#FCE7F3',
      rugStroke: '#F472B6',
      bed: { fill: '#FFF1F2', stroke: '#E11D48', text: '#9F1239', sub: '#FB7185' },
      desk: { fill: '#FFFBEB', stroke: '#D97706', text: '#92400E', sub: '#F59E0B' },
      wardrobe: { fill: '#F3E8FF', stroke: '#9333EA', text: '#6B21A8', sub: '#C084FC' },
      default: { fill: '#FEF3C7', stroke: '#F59E0B', text: '#B45309', sub: '#FBBF24' },
    },
  }[theme];

  const getFurnitureStyles = (type: string) => {
    switch (type) {
      case 'bed':
        return themeColors.bed;
      case 'desk':
        return themeColors.desk;
      case 'wardrobe':
        return themeColors.wardrobe;
      default:
        return themeColors.default;
    }
  };

  return (
    <div className="bg-white p-3.5 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col items-center select-none">
      {/* 도면 헤더 정보 */}
      <div className="flex items-center justify-between w-full mb-2.5 px-1 text-xs text-slate-500">
        <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          2D 인테리어 평면도 ({activeOption.title.split(':')[0]})
        </span>
        <span className="font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px]">
          {roomWidthMm} x {roomDepthMm} mm
        </span>
      </div>

      {/* SVG 2D 평면도 캔버스 */}
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full max-w-[320px] h-auto drop-shadow-xs"
      >
        <defs>
          <pattern id="roomGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={themeColors.floorGrid} strokeWidth="0.8" />
          </pattern>
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 방 바닥 배경 */}
        <rect
          x={roomX}
          y={roomY}
          width={roomW}
          height={roomH}
          fill={themeColors.floor}
          stroke={themeColors.wallStroke}
          strokeWidth="4"
          rx="6"
        />
        <rect
          x={roomX}
          y={roomY}
          width={roomW}
          height={roomH}
          fill="url(#roomGrid)"
        />

        {/* ================= 방꾸미기 소품: 원형 러그 (중앙) ================= */}
        {accessories.rug && (
          <g className="transition-opacity duration-300">
            <ellipse
              cx={roomX + roomW * 0.52}
              cy={roomY + roomH * 0.52}
              rx={roomW * 0.28}
              ry={roomH * 0.20}
              fill={themeColors.rugFill}
              stroke={themeColors.rugStroke}
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.9"
            />
            <text
              x={roomX + roomW * 0.52}
              y={roomY + roomH * 0.53}
              fill={themeColors.rugStroke}
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
            >
              🧶 러그
            </text>
          </g>
        )}

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
              y={roomY - 7}
              fill="#0284C7"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
            >
              창문 (채광/환기)
            </text>
          </g>
        )}

        {/* 2. 출입문 & 800mm 개폐 반경 안전선 */}
        <g>
          <path
            d={`M ${roomX + 5} ${roomY + roomH} A ${800 * scale} ${800 * scale} 0 0 1 ${roomX + 5 + 800 * scale} ${roomY + roomH - 800 * scale}`}
            fill="none"
            stroke="#E11D48"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <line
            x1={roomX + 5}
            y1={roomY + roomH}
            x2={roomX + 5}
            y2={roomY + roomH - 800 * scale}
            stroke="#E11D48"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text
            x={roomX + 12}
            y={roomY + roomH - 8}
            fill="#E11D48"
            fontSize="8"
            fontWeight="bold"
          >
            방문 800mm 반경
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
              <rect
                x={itemX}
                y={itemY}
                width={itemW}
                height={itemH}
                fill={styles.fill}
                stroke={styles.stroke}
                strokeWidth="2"
                rx="5"
                className="drop-shadow-2xs"
              />

              {/* 침대 베개 그래픽 디테일 */}
              {item.type === 'bed' && (
                <rect
                  x={itemX + itemW * 0.15}
                  y={itemY + itemH * 0.08}
                  width={itemW * 0.7}
                  height={itemH * 0.18}
                  fill="#FFFFFF"
                  stroke={styles.sub}
                  strokeWidth="1"
                  rx="3"
                />
              )}

              {/* 책상 모니터 디테일 */}
              {item.type === 'desk' && (
                <rect
                  x={itemX + itemW * 0.3}
                  y={itemY + itemH * 0.1}
                  width={itemW * 0.4}
                  height={itemH * 0.12}
                  fill="#334155"
                  rx="1"
                />
              )}

              {/* 옷장 문 분할선 */}
              {item.type === 'wardrobe' && (
                <line
                  x1={itemX + itemW * 0.5}
                  y1={itemY}
                  x2={itemX + itemW * 0.5}
                  y2={itemY + itemH}
                  stroke={styles.stroke}
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />
              )}

              {/* 가구 텍스트 & 규격 */}
              <text
                x={itemX + itemW / 2}
                y={itemY + itemH / 2 - 2}
                fill={styles.text}
                fontSize="10"
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {item.label}
              </text>
              <text
                x={itemX + itemW / 2}
                y={itemY + itemH / 2 + 10}
                fill={styles.sub}
                fontSize="8"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {item.widthMm}x{item.depthMm}
              </text>
            </g>
          );
        })}

        {/* ================= 방꾸미기 소품: 전신 거울 ================= */}
        {accessories.mirror && (
          <g>
            <rect
              x={roomX + roomW - 14}
              y={roomY + roomH * 0.65}
              width={10}
              height={32}
              fill="#E0F2FE"
              stroke="#0284C7"
              strokeWidth="1.2"
              rx="2"
            />
            <text
              x={roomX + roomW - 9}
              y={roomY + roomH * 0.65 + 17}
              fill="#0369A1"
              fontSize="7"
              fontWeight="bold"
              textAnchor="middle"
            >
              🪞
            </text>
          </g>
        )}

        {/* ================= 방꾸미기 소품: 반려식물 ================= */}
        {accessories.plant && (
          <g>
            <circle
              cx={roomX + roomW - 14}
              cy={roomY + 16}
              r={9}
              fill="#DCFCE7"
              stroke="#16A34A"
              strokeWidth="1.5"
            />
            <text
              x={roomX + roomW - 14}
              y={roomY + 19}
              fontSize="9"
              textAnchor="middle"
            >
              🪴
            </text>
          </g>
        )}

        {/* ================= 방꾸미기 소품: 스탠드 무드등 ================= */}
        {accessories.lamp && (
          <g>
            <circle
              cx={roomX + 16}
              cy={roomY + 16}
              r={20}
              fill="url(#lampGlow)"
            />
            <circle
              cx={roomX + 16}
              cy={roomY + 16}
              r={7}
              fill="#FEF08A"
              stroke="#CA8A04"
              strokeWidth="1.2"
            />
            <text
              x={roomX + 16}
              y={roomY + 19}
              fontSize="8"
              textAnchor="middle"
            >
              💡
            </text>
          </g>
        )}
      </svg>

      {/* ================= 방꾸미기 소품 온/오프 토글 바 ================= */}
      {onToggleAccessory && (
        <div className="w-full mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>방꾸미기 소품:</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleAccessory('rug')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                accessories.rug ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-400'
              }`}
            >
              🧶 러그
            </button>
            <button
              type="button"
              onClick={() => onToggleAccessory('mirror')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                accessories.mirror ? 'bg-sky-100 text-sky-800 border border-sky-300' : 'bg-slate-100 text-slate-400'
              }`}
            >
              🪞 전신거울
            </button>
            <button
              type="button"
              onClick={() => onToggleAccessory('plant')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                accessories.plant ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-100 text-slate-400'
              }`}
            >
              🪴 반려식물
            </button>
            <button
              type="button"
              onClick={() => onToggleAccessory('lamp')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                accessories.lamp ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-slate-100 text-slate-400'
              }`}
            >
              💡 무드등
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
