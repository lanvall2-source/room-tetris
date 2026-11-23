import React, { useState, useEffect } from 'react';
import { 
  RoomAnalysisResult, RoomPresetId, AppMode, 
  DeclutterAnalysisResult, DeclutterProblemType,
  DecorThemeId
} from './types';
import { PRESET_ANALYSIS_DATABASE } from './data/presets';
import { DECLUTTER_PRESETS } from './data/declutterPresets';
import { Header } from './components/Header';
import { RoomInputView } from './components/RoomInputView';
import { AnalysisReportView } from './components/AnalysisReportView';
import { DeclutterInputView } from './components/DeclutterInputView';
import { DeclutterReportView } from './components/DeclutterReportView';
import { InfoModal } from './components/InfoModal';
import { BedDouble, Sparkles, Package } from 'lucide-react';

const STORAGE_KEY_RESULT = 'roomtetris_result_v1';
const STORAGE_KEY_DECLUTTER = 'roomtetris_declutter_v1';
const STORAGE_KEY_MODE = 'roomtetris_mode_v1';

export function App() {
  const [appMode, setAppMode] = useState<AppMode>(() => {
    return (localStorage.getItem(STORAGE_KEY_MODE) as AppMode) || 'new_layout';
  });

  const [activeTheme, setActiveTheme] = useState<DecorThemeId>('wood');

  // 1. 신규 가구배치 결과 상태
  const [currentResult, setCurrentResult] = useState<RoomAnalysisResult | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RESULT);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // 2. 짐정리 & 재배치 결과 상태
  const [declutterResult, setDeclutterResult] = useState<DeclutterAnalysisResult | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DECLUTTER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // 로컬스토리지 보존
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODE, appMode);
  }, [appMode]);

  useEffect(() => {
    if (currentResult) {
      localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(currentResult));
    }
  }, [currentResult]);

  useEffect(() => {
    if (declutterResult) {
      localStorage.setItem(STORAGE_KEY_DECLUTTER, JSON.stringify(declutterResult));
    }
  }, [declutterResult]);

  // 친구 공유 핸들러 (토스 공유)
  const handleShare = async () => {
    const shareData = {
      title: '룸테트리스 (RoomTetris) - 자취방 가구배치 & 방꾸미기 시뮬레이터',
      text: '좁은 방 가구 구매 실패 100% 방지! 1초 만에 맞춰보는 내 방 2D 인테리어 도면',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // 취소 시 무시
      }
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      alert('🎉 룸테트리스 링크가 복사되었습니다!\n친구에게 공유해보세요.');
    }
  };

  // 모드 1: 신규 가구배치 분석 핸들러 (100% 무료 & 초고속)
  const handleAnalyzeNewLayout = async (data: {
    presetId: RoomPresetId;
    theme?: DecorThemeId;
    imageFile?: File;
    imagePreviewUrl?: string;
    userNotes?: string;
  }) => {
    setIsLoading(true);
    if (data.theme) setActiveTheme(data.theme);

    try {
      await new Promise((r) => setTimeout(r, 650));
      const base = PRESET_ANALYSIS_DATABASE[data.presetId] || PRESET_ANALYSIS_DATABASE.studio_5py;
      setCurrentResult({
        ...base,
        id: `res-${Date.now()}`,
        createdAt: new Date().toISOString(),
        imageUrl: data.imagePreviewUrl,
      });
    } catch (err: any) {
      const fallback = PRESET_ANALYSIS_DATABASE[data.presetId] || PRESET_ANALYSIS_DATABASE.studio_5py;
      setCurrentResult({
        ...fallback,
        id: `res-${Date.now()}`,
        imageUrl: data.imagePreviewUrl
      });
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 모드 2: 짐정리 & 재배치 분석 핸들러
  const handleAnalyzeDeclutter = async (data: {
    problemType: DeclutterProblemType;
    imageFile?: File;
    imagePreviewUrl?: string;
    existingFurniture: string[];
    userNotes?: string;
  }) => {
    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 650));
      const scenario = DECLUTTER_PRESETS.find(p => p.id === data.problemType) || DECLUTTER_PRESETS[0];

      setDeclutterResult({
        ...scenario.result,
        id: `dec-${Date.now()}`,
        createdAt: new Date().toISOString(),
        imageUrl: data.imagePreviewUrl
      });
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 상단 고정 헤더 (토스 최적화: 앱설치 버튼 제거 완료) */}
      <Header
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
        onShare={handleShare}
      />

      {/* 메인 본문 컨테이너 */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-3.5">
        
        {/* 모드 선택 세그먼트 (결과 화면이 아닐 때 상단 노출) */}
        {!currentResult && !declutterResult && (
          <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-2xl mb-3.5 border border-slate-300/60 shadow-xs">
            <button
              onClick={() => setAppMode('new_layout')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                appMode === 'new_layout'
                  ? 'bg-white text-blue-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BedDouble className="w-4 h-4 text-blue-600" />
              <span>방꾸미기 & 가구배치</span>
            </button>

            <button
              onClick={() => setAppMode('declutter')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                appMode === 'declutter'
                  ? 'bg-white text-amber-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4 text-amber-600" />
              <span>짐정리 & 공간 비우기</span>
            </button>
          </div>
        )}

        {/* 모드 1: 신규 가구배치 & 방꾸미기 화면 */}
        {appMode === 'new_layout' && (
          currentResult ? (
            <AnalysisReportView
              result={currentResult}
              initialTheme={activeTheme}
              onReset={() => {
                setCurrentResult(null);
                localStorage.removeItem(STORAGE_KEY_RESULT);
              }}
            />
          ) : (
            <RoomInputView
              onAnalyze={handleAnalyzeNewLayout}
              isLoading={isLoading}
            />
          )
        )}

        {/* 모드 2: 짐정리 & 재배치 화면 */}
        {appMode === 'declutter' && (
          declutterResult ? (
            <DeclutterReportView
              result={declutterResult}
              onReset={() => {
                setDeclutterResult(null);
                localStorage.removeItem(STORAGE_KEY_DECLUTTER);
              }}
            />
          ) : (
            <DeclutterInputView
              onAnalyze={handleAnalyzeDeclutter}
              isLoading={isLoading}
              quotaLabel="🎁 100% 무료"
            />
          )
        )}

      </main>

      {/* 하단 미니멀 푸터 (토스 환경 친화적) */}
      <footer className="mt-auto py-5 px-4 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500 space-y-1.5">
        <div className="flex items-center justify-center gap-3 font-semibold text-slate-600">
          <button 
            onClick={() => setIsInfoModalOpen(true)} 
            className="hover:text-slate-900 underline cursor-pointer"
          >
            서비스 소개
          </button>
          <span>•</span>
          <span>문의: lanvall2@gmail.com</span>
        </div>
        <p className="text-[10px] sm:text-[11px] text-slate-400">
          룸테트리스 (RoomTetris) | 토스 사용자를 위한 100% 무료 자취방 가구배치 & 방꾸미기
        </p>
      </footer>

      {/* 가이드 안내 모달 */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

    </div>
  );
}

export default App;
