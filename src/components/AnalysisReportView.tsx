import React, { useState } from 'react';
import { RoomAnalysisResult, LayoutOption } from '../types';
import { FloorPlanView } from './FloorPlanView';
import { 
  Ruler, BedDouble, Share2, Copy, RotateCcw, ExternalLink, 
  Check, ShieldAlert, Info 
} from 'lucide-react';
import { getCoupangSearchUrl, AFFILIATE_CONFIG } from '../utils/affiliate';

interface AnalysisReportViewProps {
  result: RoomAnalysisResult;
  onReset: () => void;
}

export const AnalysisReportView: React.FC<AnalysisReportViewProps> = ({
  result,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState<'optionA' | 'optionB' | 'optionC'>('optionA');
  const [copied, setCopied] = useState(false);

  const activeOption: LayoutOption = result.options[activeTab];

  const handleCopyMarkdown = () => {
    const text = `
## 📐 공간 구조 분석
* **크기 및 특징:** ${result.roomSummary.sizeAndFeatures}
* **핵심 포인트:** ${result.roomSummary.keyPoints}

## 🛏️ 룸테트리스: 가구 배치 제안
* **${result.options.optionA.title}**
  * 배치 설명: ${result.options.optionA.description}
  * 동선 장점: ${result.options.optionA.advantages}
* **${result.options.optionB.title}**
  * 배치 설명: ${result.options.optionB.description}
  * 동선 장점: ${result.options.optionB.advantages}
* **${result.options.optionC.title}**
  * 배치 설명: ${result.options.optionC.description}
  * 동선 장점: ${result.options.optionC.advantages}

## ⚠️ 가구 구매 실패 방지 가이드 (수치 팩트체크)
* **침대:** ${result.failureGuide.bed}
* **책상/테이블:** ${result.failureGuide.desk}
* **기타 간섭 주의:** ${result.failureGuide.clearance}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '룸테트리스 - 생존형 가구배치 컨설팅 리포트',
        text: `${result.roomSummary.sizeAndFeatures} 생존형 가구 배치 결과`,
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopyMarkdown();
      alert('분석 결과가 클립보드에 복사되었습니다.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 break-keep">
      
      {/* 상단 액션 바 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>다른 방 분석하기</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? '복사됨!' : '텍스트 복사'}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl transition-all shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>공유</span>
          </button>
        </div>
      </div>

      {/* 사진 프리뷰 (업로드된 사진이 있는 경우) */}
      {result.imageUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white max-h-56 relative shadow-xs">
          <img
            src={result.imageUrl}
            alt="업로드된 방 사진"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-[11px] text-emerald-800 font-extrabold px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs">
            AI 비전 스캔 완료
          </div>
        </div>
      )}

      {/* 섹션 1: 📐 공간 구조 분석 */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Ruler className="w-4 h-4" />
          </div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
            📐 공간 구조 분석
          </h2>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
            <strong className="text-blue-700 block mb-1">크기 및 특징</strong>
            <p>{result.roomSummary.sizeAndFeatures}</p>
          </div>
          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-100">
            <strong className="text-amber-800 block mb-1">핵심 포인트 (주의 구역)</strong>
            <p className="text-slate-800">{result.roomSummary.keyPoints}</p>
          </div>
        </div>
      </div>

      {/* 섹션 2: 🛏️ 룸테트리스: 가구 배치 제안 (3가지) */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <BedDouble className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              🛏️ 룸테트리스: 가구 배치 제안
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
            3가지 생존 옵션
          </span>
        </div>

        {/* 옵션 선택 탭 3종 */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
          {(['optionA', 'optionB', 'optionC'] as const).map(key => {
            const opt = result.options[key];
            const isSelected = activeTab === key;

            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{key === 'optionA' ? '옵션 A' : key === 'optionB' ? '옵션 B' : '옵션 C'}</span>
                <span className={`text-[10px] font-medium ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {opt.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2D 룸테트리스 탑뷰 도면 렌더링 */}
        <FloorPlanView
          roomWidthMm={result.roomDimensions.widthMm}
          roomDepthMm={result.roomDimensions.depthMm}
          activeOption={activeOption}
        />

        {/* 선택된 옵션의 상세 설명 */}
        <div className="space-y-2.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 text-xs sm:text-sm">
          <div>
            <span className="font-extrabold text-emerald-800 text-xs sm:text-sm block mb-1">
              {activeOption.title}
            </span>
            <p className="text-slate-700 leading-relaxed">
              <strong>배치 설명:</strong> {activeOption.description}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-200/80">
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-emerald-700">동선 장점:</strong> {activeOption.advantages}
            </p>
          </div>
        </div>

        {/* 추천 가구 규격 & 쿠팡 파트너스 최저가 검색 연계 */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800 block">
            이 배치에 딱 맞는 가구 규격 (실측 추천):
          </span>
          <div className="space-y-1.5">
            {activeOption.furniture.map(f => (
              <div
                key={f.id}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: f.color }}
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 block truncate">{f.name}</span>
                    <span className="text-[11px] text-slate-500">{f.recommendedSpec}</span>
                  </div>
                </div>

                <a
                  href={getCoupangSearchUrl(f.searchKeyword || f.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs transition-all ml-2"
                >
                  <span>최저가 보기</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            ))}
          </div>

          {/* 제휴 마케팅 공정위 표준 문구 배너 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 text-[11px] text-slate-500 flex items-center gap-2 mt-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{AFFILIATE_CONFIG.disclaimerText}</span>
          </div>
        </div>

      </div>

      {/* 섹션 3: ⚠️ 가구 구매 실패 방지 가이드 (수치 팩트체크) */}
      <div className="rounded-2xl bg-white p-5 border border-rose-200 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 border-b border-rose-100 pb-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              ⚠️ 가구 구매 실패 방지 가이드 (수치 팩트체크)
            </h2>
            <p className="text-[11px] text-rose-700 font-medium">
              구매 전 반드시 확인해야 할 mm 단위 한계치입니다.
            </p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
          {/* 침대 가이드 */}
          <div className="bg-rose-50/40 p-3.5 rounded-xl border border-rose-100 space-y-1">
            <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              침대 한계 규격
            </span>
            <p className="leading-relaxed text-slate-800">{result.failureGuide.bed}</p>
          </div>

          {/* 책상/테이블 가이드 */}
          <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-100 space-y-1">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              책상 / 테이블 한계 규격
            </span>
            <p className="leading-relaxed text-slate-800">{result.failureGuide.desk}</p>
          </div>

          {/* 기타 간섭 주의 */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              문 열림 반경 및 몰딩 간섭 주의
            </span>
            <p className="leading-relaxed text-slate-800">{result.failureGuide.clearance}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
