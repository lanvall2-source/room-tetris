import React, { useState, useRef } from 'react';
import { DeclutterProblemType } from '../types';
import { DECLUTTER_PRESETS } from '../data/declutterPresets';
import { 
  Camera, Upload, Sparkles, Boxes, DoorClosed, Layers, PlusCircle, 
  ArrowRight, Key, ShieldCheck, CheckSquare, Square 
} from 'lucide-react';

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
}

const COMMON_FURNITURE_LIST = [
  '침대 (SS/Q)', '컴퓨터 책상', '옷장/행거', '서랍장', 
  '소파/좌식의자', '빨래 건조대', '책장/선반', '전신거울'
];

export const DeclutterInputView: React.FC<DeclutterInputViewProps> = ({
  onAnalyze,
  isLoading
}) => {
  const [selectedProblem, setSelectedProblem] = useState<DeclutterProblemType>('floor_clutter');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>([
    '침대 (SS/Q)', '컴퓨터 책상', '옷장/행거', '빨래 건조대'
  ]);
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
      <div className="rounded-3xl bg-gradient-to-br from-amber-50/70 via-white to-slate-50 p-6 sm:p-7 border border-amber-200/80 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>살고 있는 방 & 거실 집안정리 컨설턴트</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            어지러운 내 방 사진 올리면<br />
            <span className="text-amber-600">가구 재배치 & 짐정리</span> 해드립니다
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            가구를 다 버리거나 새로 살 필요 없습니다! <strong>위치만 바꿔도 공간이 1.5평 넓어지는 비포/애프터</strong>와 만원대 틈새 수납법을 제시합니다.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>어질러진 사진도 안심! 외부에 노출되지 않고 내 기기에서만 분석</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        
        {/* 2. 현재 방 사진 업로드 */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-600" />
              <span>현재 방 / 거실 사진 업로드 (선택 권장)</span>
            </label>
            <span className="text-[11px] text-slate-400">정리 안 된 상태 그대로 촬영</span>
          </div>

          {imagePreviewUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-64 bg-slate-100 shadow-inner">
              <img
                src={imagePreviewUrl}
                alt="업로드된 방 상태 사진"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-2 right-2 bg-slate-900/80 hover:bg-rose-600 text-white text-xs px-3 py-1.5 rounded-xl shadow transition-colors font-medium"
              >
                사진 지우기
              </button>
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
                여기를 눌러 현재 방/거실 사진 촬영 또는 업로드
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                사진이 없어도 아래 고민 유형을 누르면 즉시 진단 리포트가 생성됩니다.
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

        {/* 3. 가장 큰 고민 사항 (문제 유형 선택) */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
            <Boxes className="w-4 h-4 text-amber-600" />
            <span>현재 가장 큰 공간 고민 선택</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DECLUTTER_PRESETS.map((preset) => {
              const isSelected = selectedProblem === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedProblem(preset.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all text-left flex items-start gap-3 ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-500 shadow-sm ring-1 ring-amber-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {preset.id === 'floor_clutter' && <Boxes className="w-4 h-4" />}
                    {preset.id === 'blocked_doors' && <DoorClosed className="w-4 h-4" />}
                    {preset.id === 'lack_storage' && <Layers className="w-4 h-4" />}
                    {preset.id === 'add_new_furniture' && <PlusCircle className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {preset.title}
                    </div>
                    <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
                      {preset.badge}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {preset.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. 현재 방에 있는 기존 가구 체크 */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-3">
          <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
            <span>현재 방에 있는 가구들 (복수 선택)</span>
            <span className="text-[11px] text-slate-400">재배치 대상</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COMMON_FURNITURE_LIST.map(item => {
              const checked = selectedFurniture.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleFurniture(item)}
                  className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all text-left ${
                    checked
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {checked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className="truncate">{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. 메모 */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs space-y-2">
          <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
            <span>추가 고민 사항 (선택)</span>
            <span className="text-[11px] text-slate-400">자유 작성</span>
          </label>
          <input
            type="text"
            placeholder="예: 옷이 너무 많아서 계절 옷 정리가 안 돼요, 침대 옆에 건조대를 치우고 싶어요"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-600"
          />
        </div>

        {/* 6. 메인 분석 시작 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-600 hover:bg-amber-500 active:scale-98 text-white font-extrabold text-sm py-4 rounded-2xl shadow-md shadow-amber-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>방 상태 진단 및 가구 이동 경로 계산 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>집안정리 & 가구 재배치 솔루션 받기</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>

      </form>
    </div>
  );
};
