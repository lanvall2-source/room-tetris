import React, { useState, useEffect } from 'react';
import { RoomAnalysisResult, RoomPresetId } from './types';
import { PRESET_ANALYSIS_DATABASE } from './data/presets';
import { analyzeRoomWithGemini, parseMarkdownToResult } from './utils/aiConsultant';
import { Header } from './components/Header';
import { RoomInputView } from './components/RoomInputView';
import { AnalysisReportView } from './components/AnalysisReportView';
import { PwaInstallModal } from './components/PwaInstallModal';
import { InfoModal } from './components/InfoModal';

const STORAGE_KEY_RESULT = 'roomtetris_result_v1';

export function App() {
  const [currentResult, setCurrentResult] = useState<RoomAnalysisResult | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RESULT);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // 로컬스토리지 자동 보존
  useEffect(() => {
    if (currentResult) {
      localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(currentResult));
    }
  }, [currentResult]);

  // PWA 설치 감지
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // 분석 핸들러
  const handleAnalyze = async (data: {
    presetId: RoomPresetId;
    imageFile?: File;
    imagePreviewUrl?: string;
    userNotes?: string;
    apiKey?: string;
  }) => {
    setIsLoading(true);

    try {
      if (data.imagePreviewUrl && data.apiKey) {
        // 1. 실시간 Gemini Vision API 호출
        const markdown = await analyzeRoomWithGemini(
          data.imagePreviewUrl,
          data.apiKey,
          data.userNotes
        );
        const parsed = parseMarkdownToResult(markdown, data.presetId, data.imagePreviewUrl);
        setCurrentResult(parsed);
      } else {
        // 2. 고정밀 룸 프리셋 데이터베이스 로드 (사진 유무 무관 3초 즉시 분석)
        // 1초 인위적 딜레이로 스캔 체감 효과 부여
        await new Promise((r) => setTimeout(r, 900));

        const base = PRESET_ANALYSIS_DATABASE[data.presetId] || PRESET_ANALYSIS_DATABASE.studio_5py;
        const result: RoomAnalysisResult = {
          ...base,
          id: `res-${Date.now()}`,
          createdAt: new Date().toISOString(),
          imageUrl: data.imagePreviewUrl,
        };

        setCurrentResult(result);
      }
    } catch (err: any) {
      alert(`분석 중 오류가 발생했습니다: ${err.message || '네트워크 확인 필요'}\n기본 템플릿으로 분석을 진행합니다.`);
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

  const handleReset = () => {
    setCurrentResult(null);
    localStorage.removeItem(STORAGE_KEY_RESULT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 상단 고정 헤더 */}
      <Header
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      {/* 메인 본문 컨테이너 */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-4">
        {currentResult ? (
          <AnalysisReportView
            result={currentResult}
            onReset={handleReset}
          />
        ) : (
          <RoomInputView
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
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
