import React, { useState, useRef } from 'react';
import { RoomPreset, RoomPresetId } from '../types';
import { ROOM_PRESETS } from '../data/presets';
import { 
  Camera, Upload, Sparkles, Building, Maximize2, Columns, Home, 
  ArrowRight, Key, CheckCircle, Info, ShieldCheck, Zap 
} from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface RoomInputViewProps {
  onAnalyze: (data: {
    presetId: RoomPresetId;
    imageFile?: File;
    imagePreviewUrl?: string;
    userNotes?: string;
    apiKey?: string;
  }) => void;
  isLoading: boolean;
  quotaLabel?: string;
}

export const RoomInputView: React.FC<RoomInputViewProps> = ({
  onAnalyze,
  isLoading,
  quotaLabel,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<RoomPresetId>('studio_5py');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalKb: number;
    compressedKb: number;
    ratio: number;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('roomtetris_gemini_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setIsCompressing(true);
      try {
        const res = await compressImage(file, 1080, 1080, 0.82);
        setImagePreviewUrl(res.dataUrl);
        setCompressionStats({
          originalKb: res.originalSizeKb,
          compressedKb: res.compressedSizeKb,
          ratio: res.compressionRatio,
        });
      } catch (err) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreviewUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setCompressionStats(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('roomtetris_gemini_key', key);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      presetId: selectedPreset,
      imageFile: imageFile || undefined,
      imagePreviewUrl: imagePreviewUrl || undefined,
      userNotes: userNotes.trim() || undefined,
      apiKey: apiKey.trim() || undefined
    });
  };

  return (
    <div className="space-y-5 pb-8 break-keep">
      
      {/* 1. 상단 히어로 배너 */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 p-6 sm:p-7 border border-emerald-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>원룸·소형평수 생존형 가구배치 컨설턴트</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            방 사진 올리면 <span className="text-emerald-600">가구 구매 실패</span> 막아드립니다
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
            감성 인테리어는 사치! 문 열리는 반경(800mm), 창문 채광, 콘센트 간섭을 철저히 계산하여 딱 맞는 <strong>mm 단위 기성 가구 사이즈</strong>를 제안합니다.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>사진은 서버에 저장되지 않고 내 브라우저에서 안전 분석</span>
            </div>
            {quotaLabel && (
              <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                {quotaLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        
        {/* 2. 사진 업로드 영역 */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>방 사진 업로드 (선택 권장)</span>
            </label>
            <span className="text-[11px] text-slate-400">창문/방문이 보이는 각도</span>
          </div>

          {imagePreviewUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-64 bg-slate-100 shadow-inner">
              <img
                src={imagePreviewUrl}
                alt="업로드된 방 사진"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-2 right-2 bg-slate-900/80 hover:bg-rose-600 text-white text-xs px-3 py-1.5 rounded-xl shadow transition-colors font-medium cursor-pointer"
              >
                사진 지우기
              </button>

              {/* 실시간 초경량 압축 상태 표시 배너 */}
              {compressionStats && (
                <div className="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-md text-[11px] text-emerald-400 font-semibold px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    초경량 압축: {compressionStats.originalKb}KB ➔ {compressionStats.compressedKb}KB ({compressionStats.ratio}% 절감)
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition-all bg-slate-50/60 hover:bg-emerald-50/30 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs group-hover:scale-105 text-slate-500 group-hover:text-emerald-600 flex items-center justify-center mx-auto transition-all border border-slate-200">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 mt-3 group-hover:text-emerald-700 transition-colors">
                {isCompressing ? '사진을 초경량 압축 중...' : '여기를 눌러 내 방 사진 촬영 또는 업로드'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                스마트폰 사진 자동 초경량 압축 지원 (사진 없이도 템플릿으로 분석 가능)
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* 3. 방 구조 프리셋 선택 */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-emerald-600" />
              <span>내 방과 가장 가까운 구조 선택</span>
            </label>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              필수 선택
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ROOM_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {preset.id === 'studio_5py' && <Building className="w-5 h-5" />}
                    {preset.id === 'officetel_7py' && <Home className="w-5 h-5" />}
                    {preset.id === 'studio_9py' && <Columns className="w-5 h-5" />}
                    {preset.id === 'villa_12py' && <Building className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{preset.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{preset.areaPy}평</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{preset.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. 특이사항 / 요구사항 메모 */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-2">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <span>특별히 신경 써야 할 점 (선택)</span>
          </label>
          <input
            type="text"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="예: 듀얼 모니터 데스크 필수, 문 옆에 보일러실 돌출 기둥 있음"
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/70"
          />
        </div>

        {/* 5. 파워유저용 무료 API Key 설정 아코디언 */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-slate-400" />
            <span>{showApiKeyInput ? 'API 키 설정 닫기' : '개발자/파워유저: 본인 Gemini API Key 등록 (무제한 무료)'}</span>
          </button>

          {showApiKeyInput && (
            <div className="mt-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Google AI Studio에서 무료로 발급받은 Gemini API 키를 넣으시면 <strong>평생 횟수 제한 없이 무제한 실시간 분석</strong>을 이용하실 수 있습니다.
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                placeholder="AIzaSy... (Gemini API Key)"
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* 6. 제출 / 분석 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>동선 및 가구 한계치수 팩트체크 분석 중...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>생존형 가구배치 팩트체크 리포트 받기</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>
    </div>
  );
};
