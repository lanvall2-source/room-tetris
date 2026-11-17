import React, { useState, useRef } from 'react';
import { DeclutterProblemType } from '../types';
import { DECLUTTER_PRESETS } from '../data/declutterPresets';
import { 
  Camera, Upload, Sparkles, Boxes, DoorClosed, Layers, PlusCircle, 
  ArrowRight, Key, ShieldCheck, CheckSquare, Square, Zap 
} from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface DeclutterInputViewProps {
  onAnalyze: (data: {
    problemType: DeclutterProblemType;
    imageFile?: File;
    imagePreviewUrl?: string;
    existingFurniture: string[];
    userNotes?: string;
    apiKey?: string;
  }) => void;
  isLoading: boolean;
  quotaLabel?: string;
}

const COMMON_FURNITURE_LIST = [
  '침대 (SS/Q)', '컴퓨터 책상', '옷장/행거', '서랍장', 
  '소파/좌식의자', '빨래 건조대', '책장/선반', '전신거울'
];

export const DeclutterInputView: React.FC<DeclutterInputViewProps> = ({
  onAnalyze,
  isLoading,
  quotaLabel,
}) => {
  const [selectedProblem, setSelectedProblem] = useState<DeclutterProblemType>('floor_clutter');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalKb: number;
    compressedKb: number;
    ratio: number;
  } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>([
    '침대 (SS/Q)', '컴퓨터 책상', '옷장/행거', '빨래 건조대'
  ]);
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
      } catch {
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

  const toggleFurniture = (item: string) => {
    setSelectedFurniture(prev => 
      prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      problemType: selectedProblem,
      imageFile: imageFile || undefined,
      imagePreviewUrl: imagePreviewUrl || undefined,
      existingFurniture: selectedFurniture,
      userNotes: userNotes.trim() || undefined,
      apiKey: apiKey.trim() || undefined
    });
  };

  return (
    <div className="space-y-5 pb-8 break-keep">
      
      {/* 1. 상단 히어로 배너 */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-slate-50 p-6 sm:p-7 border border-amber-200/80 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>살고 있는 방 / 거실 짐정리 & 기존 가구 재배치</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            방이 좁은 게 아니라, <span className="text-amber-700">배치와 동선</span>이 꼬인 겁니다
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
            가구 새로 살 필요 없습니다. 문 열리는 반경(800mm)과 침대 밑 데드스페이스를 활용해 <strong>기존 가구 위치만 바꿔서 체감 평수 1.5배</strong>를 확보해 드립니다.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>사진은 서버에 저장되지 않고 내 브라우저에서 안전 분석</span>
            </div>
            {quotaLabel && (
              <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                {quotaLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        
        {/* 2. 현재 방 사진 업로드 */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-600" />
              <span>현재 방/거실 상태 사진 (선택 권장)</span>
            </label>
            <span className="text-[11px] text-slate-400">짐 엉킨 곳이나 가구 배치 각도</span>
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
              className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition-all bg-slate-50/60 hover:bg-amber-50/30 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs group-hover:scale-105 text-slate-500 group-hover:text-amber-600 flex items-center justify-center mx-auto transition-all border border-slate-200">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 mt-3 group-hover:text-amber-800 transition-colors">
                {isCompressing ? '사진을 초경량 압축 중...' : '여기를 눌러 현재 방/짐 사진 업로드'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                스마트폰 사진 자동 초경량 압축 지원 (사진 없이도 아래 고민 유형으로 즉시 진단 가능)
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

        {/* 3. 현재 가장 심각한 방의 문제점 선택 */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-600" />
              <span>현재 가장 답답한 문제점 (필수)</span>
            </label>
            <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              맞춤 처방
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DECLUTTER_PRESETS.map((preset) => {
              const isSelected = selectedProblem === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedProblem(preset.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {preset.id === 'floor_clutter' && <Layers className="w-5 h-5" />}
                    {preset.id === 'blocked_doors' && <DoorClosed className="w-5 h-5" />}
                    {preset.id === 'lack_storage' && <Boxes className="w-5 h-5" />}
                    {preset.id === 'add_new_furniture' && <PlusCircle className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900 block truncate">{preset.title}</span>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{preset.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. 현재 방에 있는 기존 가구 체크리스트 */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>현재 방에 두고 있는 가구들 (선택)</span>
            </label>
            <span className="text-[11px] text-slate-400">재배치 대상 가구</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COMMON_FURNITURE_LIST.map((item) => {
              const isChecked = selectedFurniture.includes(item);
              return (
                <div
                  key={item}
                  onClick={() => toggleFurniture(item)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                    isChecked
                      ? 'border-amber-400 bg-amber-50/80 text-amber-950'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-amber-700 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className="truncate">{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. 추가 고민사항 메모 */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-2">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <span>추가로 버리거나 새로 들이고 싶은 짐 (선택)</span>
          </label>
          <input
            type="text"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="예: 행거를 치우고 서랍장 1개로 바꾸고 싶음, 전신거울 둘 자리가 없음"
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50/70"
          />
        </div>

        {/* 6. 파워유저용 무료 API Key 설정 */}
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
                onChange={(e) => {
                  setApiKey(e.target.value);
                  localStorage.setItem('roomtetris_gemini_key', e.target.value);
                }}
                placeholder="AIzaSy... (Gemini API Key)"
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}
        </div>

        {/* 7. 분석 제출 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-amber-600 hover:bg-amber-500 active:scale-[0.99] transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>바닥 짐 수직수납 및 가구 재배치 동선 계산 중...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>집안정리 & 가구 재배치 처방전 받기</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>
    </div>
  );
};
