import React, { useState } from 'react';
import { DeclutterAnalysisResult } from '../types';
import { 
  RotateCcw, Copy, Share2, Check, ArrowRight, AlertTriangle, 
  Trash2, RefreshCw, ShoppingCart, ExternalLink, Sparkles, CheckCircle2, Info 
} from 'lucide-react';
import { getCoupangSearchUrl, AFFILIATE_CONFIG } from '../utils/affiliate';

interface DeclutterReportViewProps {
  result: DeclutterAnalysisResult;
  onReset: () => void;
}

export const DeclutterReportView: React.FC<DeclutterReportViewProps> = ({
  result,
  onReset
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    const text = `
## 🔍 현재 방 상태 진단 (데드스페이스 팩트폭격)
* **동선 차단 구역:** ${result.diagnosis.blockedCorridor}
* **죽어있는 공간:** ${result.diagnosis.deadSpace}

## 🧹 1단계: 바닥 짐 제거 & 수납 매립 솔루션
* **바닥 짐 올리기:** ${result.step1_storage.floorClearAction}
* **데드스페이스 활용:** ${result.step1_storage.deadSpaceAction}

## 🔄 2단계: 기존 가구 재배치 (비포 ➔ 애프터)
${result.step2_rearrange.moves.map(m => `* **${m.furnitureName}:** [${m.from}] ➔ [${m.to}] (${m.reason})`).join('\n')}
* **체감 효과:** ${result.step2_rearrange.gainedSpaceDescription}

## 🛒 3단계: 공간 살리는 만원대 틈새 생존템 (수치 팩트체크)
${result.step3_budgetItems.map(b => `* **${b.name} (${b.priceRange}):** ${b.specGuide} - ${b.purpose}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '룸테트리스 - 살고 있는 집 정리 & 가구 재배치 리포트',
        text: `현재 방 상태 진단 및 가구 재배치 솔루션`,
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopyMarkdown();
      alert('분석 결과가 복사되었습니다.');
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
          <span>다른 방 정리하기</span>
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

      {/* 사진 프리뷰 */}
      {result.imageUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white max-h-56 relative shadow-xs">
          <img
            src={result.imageUrl}
            alt="진단 대상 방 사진"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-[11px] text-emerald-800 font-extrabold px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs">
            방 상태 진단 완료
          </div>
        </div>
      )}

      {/* 섹션 1: 🔍 현재 방 상태 진단 (팩트폭격) */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              🔍 현재 방 상태 진단 (데드스페이스 팩트체크)
            </h2>
            <p className="text-[11px] text-slate-500">
              방이 좁아지는 근본적인 원인을 정확히 짚어냅니다.
            </p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100">
            <strong className="text-rose-700 block mb-1">동선 차단 구역</strong>
            <p>{result.diagnosis.blockedCorridor}</p>
          </div>
          <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
            <strong className="text-amber-800 block mb-1">방치된 죽은 공간 (데드스페이스)</strong>
            <p>{result.diagnosis.deadSpace}</p>
          </div>
        </div>
      </div>

      {/* 섹션 2: 🧹 1단계: 바닥 짐 제거 & 수납 매립 솔루션 */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              🧹 1단계: 바닥 짐 제거 & 수납 매립 솔루션
            </h2>
            <p className="text-[11px] text-slate-500">
              가구를 옮기기 전, 바닥 면적부터 복원하는 단계입니다.
            </p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-emerald-800 block">바닥 짐 수직 공중부양</span>
            <p className="leading-relaxed">{result.step1_storage.floorClearAction}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-blue-800 block">데드스페이스 수납 매립</span>
            <p className="leading-relaxed">{result.step1_storage.deadSpaceAction}</p>
          </div>
        </div>
      </div>

      {/* 섹션 3: 🔄 2단계: 기존 가구 재배치 (비포 ➔ 애프터) */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              🔄 2단계: 기존 가구 재배치 (비포 ➔ 애프터)
            </h2>
            <p className="text-[11px] text-slate-500">
              새로 사지 않고 위치만 바꿔서 공간을 넓힙니다.
            </p>
          </div>
        </div>

        {/* 가구 이동 목록 카드 */}
        <div className="space-y-2">
          {result.step2_rearrange.moves.map((move, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {move.furnitureName}
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                  재배치 추천
                </span>
              </div>

              {/* Before ➔ After 표시 바 */}
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 text-slate-700">
                <span className="text-slate-400 line-through shrink-0 text-[11px]">{move.from}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-emerald-800 text-[11px] sm:text-xs">{move.to}</span>
              </div>

              <p className="text-slate-500 text-[11px] leading-relaxed pt-0.5">
                💡 <strong>이유:</strong> {move.reason}
              </p>
            </div>
          ))}
        </div>

        {/* 체감 공간 확장 효과 배너 */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed font-medium">
          ✨ <strong>체감 효과:</strong> {result.step2_rearrange.gainedSpaceDescription}
        </div>
      </div>

      {/* 섹션 4: 🛒 3단계: 공간 살리는 만원대 틈새 생존템 (수치 팩트체크) */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                🛒 3단계: 공간 살리는 틈새 생존템 (수치 팩트체크)
              </h2>
              <p className="text-[11px] text-slate-500">
                가구 새로 살 필요 없이 만원대로 수납력을 2배 늘리는 아이템
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {result.step3_budgetItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 flex items-center justify-between text-xs transition-colors"
            >
              <div className="min-w-0 space-y-0.5 pr-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-900">{item.name}</span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                    {item.priceRange}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  규격: {item.specGuide}
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  효과: {item.purpose}
                </div>
              </div>

              <a
                href={getCoupangSearchUrl(item.searchKeyword)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs transition-all ml-1 whitespace-nowrap"
              >
                <span>최저가 보기</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          ))}
        </div>

        {/* 제휴 마케팅 공정위 표준 문구 배너 */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 text-[11px] text-slate-500 flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-600 shrink-0" />
          <span>{AFFILIATE_CONFIG.disclaimerText}</span>
        </div>
      </div>

    </div>
  );
};
