import React, { useState } from 'react';
import { RoomAnalysisResult, LayoutOption, DecorThemeId, DecorAccessoryState } from '../types';
import { FloorPlanView } from './FloorPlanView';
import { 
  Ruler, BedDouble, Share2, Copy, RotateCcw, 
  Check, ShieldAlert, Sparkles, Palette 
} from 'lucide-react';
import { getCoupangSearchUrl } from '../utils/affiliate';

interface AnalysisReportViewProps {
  result: RoomAnalysisResult;
  onReset: () => void;
  initialTheme?: DecorThemeId;
}

export const AnalysisReportView: React.FC<AnalysisReportViewProps> = ({
  result,
  onReset,
  initialTheme = 'wood',
}) => {
  const [activeTab, setActiveTab] = useState<'optionA' | 'optionB' | 'optionC'>('optionA');
  const [currentTheme, setCurrentTheme] = useState<DecorThemeId>(initialTheme);
  const [accessories, setAccessories] = useState<DecorAccessoryState>({
    rug: true,
    mirror: true,
    plant: true,
    lamp: true,
  });
  const [copied, setCopied] = useState(false);

  const activeOption: LayoutOption = result.options[activeTab];

  const handleToggleAccessory = (key: keyof DecorAccessoryState) => {
    setAccessories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleShare = () => {
    const shareText = `[룸테트리스] 내 방 가구배치 & 방꾸미기 완성!\n${result.roomSummary.sizeAndFeatures}\n추천 배치: ${activeOption.title}\n나도 방꾸미기 해보기: ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: '룸테트리스 - 내 방 가구배치 & 방꾸미기 결과',
        text: shareText,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      alert('🎉 내 방 인테리어 결과가 복사되었습니다!\n친구에게 공유해보세요.');
    }
  };

  return (
    <div className="space-y-4 pb-8 break-keep">
      
      {/* 1. 상단 액션 바: 다시하기 & 공유 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>다른 방 꾸미기</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? '복사 완료!' : '결과 공유'}</span>
        </button>
      </div>

      {/* 2. 공간 요약 헤더 카드 */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
            공간 구조 분석 결과
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-black text-slate-900">
          {result.roomSummary.sizeAndFeatures}
        </h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          {result.roomSummary.keyPoints}
        </p>
      </div>

      {/* 3. 3대 추천 배치 탭 선택 */}
      <div className="grid grid-cols-3 p-1 bg-slate-200/80 rounded-2xl border border-slate-300/60 shadow-xs">
        {(['optionA', 'optionB', 'optionC'] as const).map((tabKey) => {
          const opt = result.options[tabKey];
          const isSelected = activeTab === tabKey;
          return (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`py-2 px-1.5 rounded-xl text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-blue-900 font-black shadow-xs border border-slate-200'
                  : 'text-slate-600 font-bold hover:text-slate-900'
              }`}
            >
              <span className="text-[10px] block opacity-80">{opt.badge}</span>
              <span className="text-xs truncate block">{opt.title.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 4. 감성 테마 실시간 스위처 */}
      <div className="flex items-center justify-between px-2 text-xs">
        <span className="font-bold text-slate-600 flex items-center gap-1">
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          <span>인테리어 분위기:</span>
        </span>
        <div className="flex items-center gap-1">
          {(
            [
              { id: 'wood', label: '🌿 우드' },
              { id: 'modern', label: '🏙️ 모던' },
              { id: 'cozy', label: '🧸 코지' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setCurrentTheme(t.id)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                currentTheme === t.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. 2D 방꾸미기 평면도 컴포넌트 */}
      <FloorPlanView
        roomWidthMm={result.roomDimensions.widthMm}
        roomDepthMm={result.roomDimensions.depthMm}
        activeOption={activeOption}
        theme={currentTheme}
        accessories={accessories}
        onToggleAccessory={handleToggleAccessory}
      />

      {/* 6. 현재 옵션 상세 설명 카드 */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              {activeOption.badge}
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              {activeOption.title}
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
            {activeOption.description}
          </p>
        </div>

        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
          <strong className="block mb-0.5 text-blue-950 font-black">✨ 동선 및 생활 장점:</strong>
          {activeOption.advantages}
        </div>
      </div>

      {/* 7. 가구 구매 실패 방지 수치 가이드 */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-black text-slate-900 uppercase">
            가구 구매 실패 방지 치수 가이드 (mm)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="font-extrabold text-slate-800 block mb-1">🛏️ 침대 추천 규격</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {result.failureGuide.bed}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="font-extrabold text-slate-800 block mb-1">💻 책상/테이블 한계</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {result.failureGuide.desk}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="font-extrabold text-slate-800 block mb-1">🚪 문/통로 간섭 주의</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {result.failureGuide.clearance}
            </p>
          </div>
        </div>
      </div>

      {/* 8. 하단 토스 공유 CTA */}
      <button
        onClick={handleShare}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
        <span>내 방 인테리어 결과 친구에게 공유하기</span>
      </button>

    </div>
  );
};
