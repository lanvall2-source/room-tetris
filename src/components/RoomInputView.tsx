import React, { useState, useRef } from 'react';
import { RoomPreset, RoomPresetId } from '../types';
import { ROOM_PRESETS, PRESET_ANALYSIS_DATABASE } from '../data/presets';
import { 
  Camera, Upload, Sparkles, Building, Maximize2, Columns, Home, 
  HelpCircle, AlertCircle, ArrowRight, Key, CheckCircle, Info 
} from 'lucide-react';

interface RoomInputViewProps {
  onAnalyze: (data: {
    presetId: RoomPresetId;
    imageFile?: File;
    imagePreviewUrl?: string;
    userNotes?: string;
    apiKey?: string;
  }) => void;
  isLoading: boolean;
}

export const RoomInputView: React.FC<RoomInputViewProps> = ({
  onAnalyze,
  isLoading
}) => {
  const [selectedPreset, setSelectedPreset] = useState<RoomPresetId>('studio_5py');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('roomtetris_gemini_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
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
    <div className="space-y-6 pb-8 break-keep">
      
      {/* 1. 상단 히어로 배너 */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 p-6 sm:p-7 border border-slate-700/60 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>원룸·소형평수 생존형 가구배치 컨설턴트</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            방 사진 올리면 <span className="text-emerald-400">가구 구매 실패</span> 막아드립니다
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            감성 인테리어는 사치! 문 열리는 반경(800mm), 창문 채광, 콘센트 간섭을 철저히 계산하여 딱 맞는 <strong>mm 단위 기성 가구 사이즈</strong>를 제안합니다.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 2. 사진 업로드 영역 */}
        <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>방 사진 업로드 (선택 or 추천)</span>
            </label>
            <span className="text-[11px] text-slate-400">창문/방문이 보이는 각도 권장</span>
          </div>

          {imagePreviewUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 max-h-64 bg-slate-950">
              <img
                src={imagePreviewUrl}
                alt="업로드된 방 사진"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-2 right-2 bg-slate-950/80 hover:bg-rose-950 text-slate-200 hover:text-rose-400 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
              >
                사진 지우기
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-950/80 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-800 group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-400 flex items-center justify-center mx-auto transition-colors">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-200 mt-3">
                여기를 눌러 내 방 사진 촬영 또는 업로드
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                사진이 없어도 아래 템플릿으로 3초 만에 분석 가능합니다.
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

        {/* 3. 방 구조 프리셋 선택 (사진 유무 무관 필수 선택) */}
        <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-xl space-y-3">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-emerald-400" />
            <span>내 방과 가장 가까운 구조 선택</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ROOM_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all text-left flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-500/10 scale-[1.01]'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {preset.id === 'studio_5py' && <Maximize2 className="w-4 h-4" />}
                    {preset.id === 'officetel_7py' && <Building className="w-4 h-4" />}
                    {preset.id === 'studio_9py' && <Columns className="w-4 h-4" />}
                    {preset.id === 'villa_12py' && <Home className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {preset.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                      {preset.subtitle}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {preset.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. 나의 우선순위 및 가구 희망사항 (선택) */}
        <div className="rounded-2xl bg-slate-900/90 p-5 border border-slate-800 shadow-xl space-y-2">
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
            <span>나의 필수 가구 / 생활 패턴 (선택 메모)</span>
            <span className="text-[11px] text-slate-400">생존 우선순위</span>
          </label>
          <input
            type="text"
            placeholder="예: 듀얼 모니터 데스크 필수, 옷이 많아서 수납 필요, 퀸 침대 가능한지 궁금해요"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* 5. Gemini API Key 설정 (선택 사항 서랍) */}
        <div className="px-1 text-right">
          <button
            type="button"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 ml-auto"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{apiKey ? 'Gemini API Key 설정됨 ✓' : '내 Gemini API Key 사용하기 (선택)'}</span>
          </button>

          {showApiKeyInput && (
            <div className="mt-2 p-3 bg-slate-900 rounded-xl border border-slate-800 text-left space-y-2">
              <span className="text-[11px] text-slate-300 block">
                Google AI Studio 무료 API Key를 입력하면 실시간 맞춤 비전 분석이 실행됩니다:
              </span>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKeyInput(false)}
                  className="bg-emerald-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg"
                >
                  저장
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 6. 메인 분석 시작 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:scale-98 text-slate-950 font-extrabold text-sm py-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>동선 및 수치 팩트체크 분석 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
              <span>룸테트리스 3대 생존 배치 분석하기</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </>
          )}
        </button>

      </form>
    </div>
  );
};
