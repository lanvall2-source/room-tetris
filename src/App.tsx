import React, { useState, useEffect } from 'react';
import { 
  RoomAnalysisResult, RoomPresetId, AppMode, 
  DeclutterAnalysisResult, DeclutterProblemType 
} from './types';
import { PRESET_ANALYSIS_DATABASE } from './data/presets';
import { DECLUTTER_PRESETS } from './data/declutterPresets';
import { analyzeRoomWithGemini, parseMarkdownToResult } from './utils/aiConsultant';
import { getCreditStatus, consumeScanCredit, addPaidCredits, CreditStatus } from './utils/creditManager';
import { Header } from './components/Header';
import { RoomInputView } from './components/RoomInputView';
import { AnalysisReportView } from './components/AnalysisReportView';
import { DeclutterInputView } from './components/DeclutterInputView';
import { DeclutterReportView } from './components/DeclutterReportView';
import { PwaInstallModal } from './components/PwaInstallModal';
import { InfoModal } from './components/InfoModal';
import { PaymentModal } from './components/PaymentModal';
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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // 크레딧 및 무료 쿼터 상태
  const [creditStatus, setCreditStatus] = useState<CreditStatus>(() => {
    const customKey = localStorage.getItem('roomtetris_gemini_key');
    return getCreditStatus(!!customKey);
  });

  // 결제 대기 중인 작업 임시 보관
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const refreshCreditStatus = () => {
    const customKey = localStorage.getItem('roomtetris_gemini_key');
    setCreditStatus(getCreditStatus(!!customKey));
  };

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

  // 토스페이먼츠 결제 승인 리디렉션 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      const plan = params.get('plan');
      const creditToAdd = plan === 'bundle' ? 3 : 1;
      addPaidCredits(creditToAdd);
      refreshCreditStatus();
      alert(`🎉 토스페이먼츠 결제가 완료되었습니다! (${creditToAdd}회 분석권 충전)`);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('payment') === 'fail') {
      alert('결제가 취소되었거나 승인 처리에 실패했습니다.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // 모드 1: 신규 가구배치 분석 핸들러
  const handleAnalyzeNewLayout = async (data: {
    presetId: RoomPresetId;
    imageFile?: File;
    imagePreviewUrl?: string;
    userNotes?: string;
    apiKey?: string;
  }) => {
    const hasOwnKey = !!data.apiKey;

    // 쿼터 차감 검사 (소진 시 결제 모달 오픈)
    if (!consumeScanCredit(hasOwnKey)) {
      setPendingAction(() => () => handleAnalyzeNewLayout(data));
      setIsPaymentModalOpen(true);
      return;
    }

    refreshCreditStatus();
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
    const hasOwnKey = !!data.apiKey;

    // 쿼터 차감 검사
    if (!consumeScanCredit(hasOwnKey)) {
      setPendingAction(() => () => handleAnalyzeDeclutter(data));
      setIsPaymentModalOpen(true);
      return;
    }

    refreshCreditStatus();
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

  // 헤더 뱃지 텍스트 계산
  const getCreditBadgeText = () => {
    if (creditStatus.isUnlimitedKey) return '무제한 Key';
    if (creditStatus.hasFreeToday) return '오늘 무료 1회';
    if (creditStatus.totalUsable > 0) return `티켓 ${creditStatus.totalUsable}회`;
    return '티켓 1,900원';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* 상단 고정 헤더 */}
      <Header
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
        creditText={getCreditBadgeText()}
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
              quotaLabel={creditStatus.hasFreeToday ? '⚡ 오늘 1회 무료 분석 가능' : `남은 티켓: ${creditStatus.totalUsable}회`}
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
              quotaLabel={creditStatus.hasFreeToday ? '⚡ 오늘 1회 무료 분석 가능' : `남은 티켓: ${creditStatus.totalUsable}회`}
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

      {/* 가이드 안내 모달 */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* 1,900원 단건 결제 & 바이럴 무료 충전 모달 */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={() => {
          refreshCreditStatus();
          if (pendingAction) {
            const action = pendingAction;
            setPendingAction(null);
            action();
          }
        }}
      />

    </div>
  );
}

export default App;
