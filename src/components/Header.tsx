import React from 'react';
import { Ruler, HelpCircle, Share2, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenInfoModal: () => void;
  onShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenInfoModal,
  onShare,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-900 px-4 py-2.5 shadow-xs">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        
        {/* 로고 & 타이틀 */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center shadow-md shadow-blue-600/20 text-white">
            <Ruler className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 flex items-center gap-1">
                룸테트리스
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80">
                  방꾸미기
                </span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
              자취방 가구배치 &amp; 인테리어 시뮬레이터
            </p>
          </div>
        </div>

        {/* 우측 버튼들 (토스 환경 최적화: 깔끔한 공유 & 가이드 안내) */}
        <div className="flex items-center gap-1.5">
          {/* 가이드 & FAQ 안내 */}
          <button
            onClick={onOpenInfoModal}
            aria-label="가이드 & FAQ 안내"
            className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs"
            title="이용 가이드 & FAQ"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">가이드·FAQ</span>
          </button>

          {/* 친구 공유 버튼 */}
          <button
            onClick={onShare}
            aria-label="내 방 인테리어 공유하기"
            className="flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-700 font-bold px-2.5 py-1.5 rounded-xl border border-blue-200/80 transition-all cursor-pointer shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>공유</span>
          </button>
        </div>

      </div>
    </header>
  );
};
