import React, { useState, useRef } from 'react';
import { RoomPresetId, DecorThemeId } from '../types';
import { ROOM_PRESETS } from '../data/presets';
import { 
  Camera, Upload, Sparkles, Maximize2, 
  ArrowRight, ShieldCheck, Zap, Palette, Home, CheckCircle2,
  Trees, Sliders, Heart, Building2, LayoutGrid
} from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

interface RoomInputViewProps {
  onAnalyze: (data: {
    presetId: RoomPresetId;
    theme?: DecorThemeId;
    imageFile?: File;
    imagePreviewUrl?: string;
    userNotes?: string;
  }) => void;
  isLoading: boolean;
}

const DECOR_THEMES = [
  { id: 'wood' as DecorThemeId, name: '내추럴 우드', icon: Trees, desc: '따뜻한 원목 & 화이트 감성', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'modern' as DecorThemeId, name: '모던 미드센추리', icon: Sliders, desc: '세련된 스틸 & 포인트 컬러', badge: 'bg-slate-100 text-slate-800 border-slate-300' },
  { id: 'cozy' as DecorThemeId, name: '포근한 코지', icon: Heart, desc: '패브릭 & 부드러운 웜톤', badge: 'bg-rose-50 text-rose-800 border-rose-200' },
];

const renderPresetIcon = (iconName: string) => {
  switch (iconName) {
    case 'Maximize2':
      return <Maximize2 className="w-4 h-4 text-blue-600" />;
    case 'Building':
      return <Building2 className="w-4 h-4 text-indigo-600" />;
    case 'Columns':
      return <LayoutGrid className="w-4 h-4 text-teal-600" />;
    case 'Home':
      return <Home className="w-4 h-4 text-amber-600" />;
    default:
      return <Home className="w-4 h-4 text-blue-600" />;
  }
};

export const RoomInputView: React.FC<RoomInputViewProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<RoomPresetId>('studio_5py');
  const [selectedTheme, setSelectedTheme] = useState<DecorThemeId>('wood');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setIsCompressing(true);
      try {
        const res = await compressImage(file, 1080, 1080, 0.82);
        setImagePreviewUrl(res.dataUrl);
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      presetId: selectedPreset,
      theme: selectedTheme,
      imageFile: imageFile || undefined,
      imagePreviewUrl: imagePreviewUrl || undefined,
    });
  };

  return (
    <div className="space-y-4 pb-8 break-keep">
      
      {/* 1. 상단 감성 히어로 배너 */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white p-5 sm:p-6 border border-blue-100/90 shadow-xs relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-black mb-2.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>원룸·자취방 방꾸미기 시뮬레이터</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            내 방에 딱 맞는 <span className="text-blue-600">감성 가구배치</span>를 찾아보세요
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-normal">
            이사 가기 전, 가구 사기 전에 1초 만에 2D 평면도로 맞춰보는 방꾸미기!
            문 열리는 반경(800mm), 보행 동선, 콘센트 간섭을 계산해 실패 없는 배치를 제안합니다.
          </p>

          <div className="mt-3 pt-2.5 border-t border-blue-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-blue-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              토스 회원 평생 100% 무료
            </span>
            <span className="text-slate-400">사진 없이도 1초 즉시 완성</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* 2. 방꾸미기 무드 테마 선택 */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>원하는 방꾸미기 무드 선택</span>
            </label>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
              인테리어 테마
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {DECOR_THEMES.map((theme) => {
              const isSelected = selectedTheme === theme.id;
              const IconComp = theme.icon;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 shadow-2xs ${
                      theme.id === 'wood'
                        ? 'bg-amber-100 text-amber-800'
                        : theme.id === 'modern'
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <strong className="text-xs font-extrabold text-slate-900 block">
                    {theme.name}
                  </strong>
                  <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {theme.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. 내 방 구조 프리셋 선택 */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-blue-600" />
              <span>내 방과 가장 가까운 구조 선택</span>
            </label>
            <span className="text-[10px] font-bold text-slate-400">
              필수 선택
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ROOM_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                      {renderPresetIcon(preset.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs font-extrabold text-slate-900">
                          {preset.name}
                        </strong>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                          {preset.areaPyeong}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {preset.subtitle} ({preset.widthMm}x{preset.depthMm}mm)
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. 방 사진 업로드 (선택 사항) */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>방 사진 첨부 (선택)</span>
            </label>
            <span className="text-[10px] text-slate-400">사진 없어도 바로 분석 가능</span>
          </div>

          {imagePreviewUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100 shadow-inner">
              <img
                src={imagePreviewUrl}
                alt="업로드된 방 사진"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-2 right-2 bg-slate-900/80 hover:bg-rose-600 text-white text-xs px-2.5 py-1 rounded-xl shadow transition-colors font-medium cursor-pointer"
              >
                사진 지우기
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-blue-50/30 group"
            >
              <div className="flex items-center justify-center gap-2 text-slate-500 group-hover:text-blue-600">
                <Upload className="w-4 h-4" />
                <span className="text-xs font-bold">내 방 사진 올려보기 (선택)</span>
              </div>
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

        {/* 5. 원클릭 분석 시작 CTA 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <span>방꾸미기 인테리어 배치 분석 중...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>1초 만에 내 방 인테리어 & 가구배치 확인하기</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>
    </div>
  );
};
