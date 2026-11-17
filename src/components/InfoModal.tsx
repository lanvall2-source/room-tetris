import React from 'react';
import { X, Ruler, ShieldCheck } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in break-keep">
      <div className="w-full sm:max-w-md bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
        
        {/* 헤더 */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">생존 가구배치 3대 원칙</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              1. 출입문 개폐 반경 800mm 사수
            </span>
            <p className="text-slate-600">
              방문이 안쪽으로 열리는 반경 800mm 이내에는 어떠한 가구도 두지 마세요. 문이 반만 열리거나 옷장 문과 부딪혀 파손되는 원인이 됩니다.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1">
            <span className="font-extrabold text-blue-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              2. 최소 통로 폭 600mm 확보
            </span>
            <p className="text-slate-600">
              침대와 책상, 또는 침대와 벽 사이에는 사람이 정면으로 걸어 다닐 수 있는 최소 폭 600mm가 필요합니다. 400mm 이하는 옆걸음질로 다녀야 합니다.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1">
            <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              3. 걸레받이 몰딩 15mm 오차 계산
            </span>
            <p className="text-slate-600">
              벽면 바닥에는 걸레받이 몰딩이 12~15mm 돌출되어 있습니다. 가로 1200mm 공간에 딱 1200mm 가구를 사면 들어가지 않으므로 가구 실측 시 20~30mm 여유를 두어야 합니다.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>사진 및 분석 데이터는 서버에 저장되지 않고 브라우저에만 남습니다.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
