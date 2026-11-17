import React, { useState, useEffect } from 'react';
import { 
  RoomAnalysisResult, RoomPresetId, AppMode, 
  DeclutterAnalysisResult, DeclutterProblemType 
} from './types';
import { PRESET_ANALYSIS_DATABASE } from './data/presets';
import { DECLUTTER_PRESETS } from './data/declutterPresets';
import { analyzeRoomWithGemini, parseMarkdownToResult } from './utils/aiConsultant';
import { Header } from './components/Header';
import { RoomInputView } from './components/RoomInputView';
import { AnalysisReportView } from './components/AnalysisReportView';
import { DeclutterInputView } from './components/DeclutterInputView';
import { DeclutterReportView } from './components/DeclutterReportView';
import { PwaInstallModal } from './components/PwaInstallModal';
import { InfoModal } from './components/InfoModal';
import { BedDouble, Sparkles, Package } from 'lucide-react';

const STORAGE_KEY_RESULT = 'roomtetris_result_v1';
const STORAGE_KEY_DECLUTTER = 'roomtetris_declutter_v1';
const STORAGE_KEY_MODE = 'roomtetris_mode_v1';

export function App() {
  const [appMode, setAppMode] = useState<AppMode>(() => {
    return (localStorage.getItem(STORAGE_KEY_MODE) as AppMode) || 'new_layout';
  });

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
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

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

  // PWA 설치 감지
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // 모드 1: 신규 가구배치 분석 핸들러
  const handleAnalyzeNewLayout = async (data: {
    presetId: RoomPresetId;
    imageFile?: File;
    imagePreviewUrl?: string;
    userNotes?: string;
    apiKey?: string;
  }) => {
    setIsLoading(true);

    try {
      if (data.imagePreviewUrl && data.apiKey) {
        const markdown = await analyzeRoomWithGemini(
          data.imagePreviewUrl,
          data.apiKey,
          data.userNotes
        );
        const parsed = parseMarkdownToResult(markdown, data.presetId, data.imagePreviewUrl);
        setCurrentResult(parsed);
      } else {
        await new Promise((r) => setTimeout(r, 850));
        const base = PRESET_ANALYSIS_DATABASE[data.presetId] || PRESET_ANALYSIS_DATABASE.studio_5py;
        setCurrentResult({
          ...base,
          id: `res-${Date.now()}`,
          createdAt: new Date().toISOString(),
          imageUrl: data.imagePreviewUrl,
        });
      }
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
    apiKey?: string;
  }) => {
    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 900));
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* 상단 고정 헤더 */}
      <Header
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      {/* 메인 본문 컨테이너 */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-3.5">
        
        {/* 모드 선택 세그먼트 (결과 화면이 아닐 때 상단 노출) */}
        {!currentResult && !declutterResult && (
          <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-2xl mb-4 border border-slate-300/60 shadow-xs">
            <button
              onClick={() => setAppMode('new_layout')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                appMode === 'new_layout'
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BedDouble className="w-4 h-4 text-emerald-600" />
              <span>빈 방 / 이사 가구배치</span>
            </button>

            <button
              onClick={() => setAppMode('declutter')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                appMode === 'declutter'
                  ? 'bg-white text-amber-800 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4 text-amber-600" />
              <span>살고 있는 방 / 짐정리·재배치</span>
            </button>
          </div>
        )}

        {/* 모드 1: 신규 가구배치 화면 */}
        {appMode === 'new_layout' && (
          currentResult ? (
            <AnalysisReportView
              result={currentResult}
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
            />
          )
        )}

      </main>

      {/* PWA 설치 모달 */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        deferredPrompt={deferredPrompt}
      />

      {/* 생존 원칙 안내 모달 */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

    </div>
  );
}

export default App;
