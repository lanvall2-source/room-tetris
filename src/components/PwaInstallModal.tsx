import React, { useState, useEffect } from 'react';
import { X, Smartphone, Share2, PlusSquare, Sparkles } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt
}) => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onClose();
      }
    } else {
      alert('브라우저 메뉴(⋮)에서 [홈 화면에 추가] 또는 [앱 설치]를 선택해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in break-keep">
      <div className="w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">홈 화면에 룸테트리스 앱 추가</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="text-center py-2 space-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 text-slate-950">
              <Smartphone className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white pt-1">
              앱스토어 설치 없이 1초 바로가기
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              가구 살 때 언제든 폰에서 0.1초 만에 치수 확인이 가능합니다.
            </p>
          </div>

          {deferredPrompt && (
            <button
              onClick={handleNativeInstall}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 text-xs transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 stroke-[2.5]" />
              <span>지금 원클릭으로 홈 화면에 추가하기</span>
            </button>
          )}

          {isIOS ? (
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-3">
              <span className="text-xs font-bold text-emerald-400 block">
                아이폰 (Safari) 추가 방법
              </span>
              <ol className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                  <span>화면 하단 중앙의 <strong>공유 버튼</strong> [ <Share2 className="w-3.5 h-3.5 inline text-blue-400" /> ] 터치</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                  <span>스크롤 후 <strong>'홈 화면에 추가'</strong> [ <PlusSquare className="w-3.5 h-3.5 inline" /> ] 터치</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-[10px]">3</span>
                  <span>우측 상단 <strong>'추가'</strong> 터치하면 완료!</span>
                </li>
              </ol>
            </div>
          ) : (
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-3">
              <span className="text-xs font-bold text-emerald-400 block">
                안드로이드 (Chrome) 추가 방법
              </span>
              <ol className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                  <span>우측 상단 더보기 [ <strong>⋮</strong> ] 메뉴 터치</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                  <span><strong>'홈 화면에 추가'</strong> 또는 <strong>'앱 설치'</strong> 터치</span>
                </li>
              </ol>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
