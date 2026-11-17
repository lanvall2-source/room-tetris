import React from 'react';
import { Smartphone, Ruler, Info, Ticket } from 'lucide-react';

interface HeaderProps {
  onOpenPwaModal: () => void;
  onOpenInfoModal: () => void;
  onOpenPaymentModal: () => void;
  creditText: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPwaModal,
  onOpenInfoModal,
  onOpenPaymentModal,
  creditText,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 px-4 py-3 shadow-xs">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        
        {/* 로고 & 타이틀 */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-600/20 text-white">
            <Ruler className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                룸테트리스
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  RoomTetris
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              1인 가구 생존형 가구배치 & mm 수치 가이드
            </p>
          </div>
        </div>

        {/* 우측 버튼들 */}
        <div className="flex items-center gap-2">
          {/* 유료/무료 크레딧 티켓 버튼 */}
          <button
            onClick={onOpenPaymentModal}
            aria-label="분석 티켓"
            className="flex items-center gap-1 text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer shadow-xs"
          >
            <Ticket className="w-3.5 h-3.5 text-emerald-600" />
            <span>{creditText}</span>
          </button>

          {/* 가이드 안내 */}
          <button
            onClick={onOpenInfoModal}
            aria-label="가이드 안내"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <Info className="w-5 h-5" />
          </button>

          {/* PWA 앱 설치 버튼 */}
          <button
            onClick={onOpenPwaModal}
            aria-label="앱 설치"
            className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>앱 설치</span>
          </button>
        </div>

      </div>
    </header>
  );
};
