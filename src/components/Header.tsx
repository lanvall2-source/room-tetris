import React from 'react';
import { Sparkles, Smartphone, Ruler, Info } from 'lucide-react';

interface HeaderProps {
  onOpenPwaModal: () => void;
  onOpenInfoModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPwaModal,
  onOpenInfoModal
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 py-3">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        
        {/* 로고 & 타이틀 */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Ruler className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                룸테트리스
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  RoomTetris
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              1인 가구 생존형 가구배치 & mm 수치 가이드
            </p>
          </div>
        </div>

        {/* 우측 버튼들 */}
        <div className="flex items-center gap-2">
          {/* 정보 모달 */}
          <button
            onClick={onOpenInfoModal}
            aria-label="가이드 안내"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>

          {/* PWA 앱 설치 버튼 */}
          <button
            onClick={onOpenPwaModal}
            aria-label="앱 설치"
            className="flex items-center gap-1 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="font-semibold">앱 설치</span>
          </button>
        </div>

      </div>
    </header>
  );
};
