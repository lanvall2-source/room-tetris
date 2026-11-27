import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Ruler,
  Compass,
  BedDouble,
  Sliders,
  HelpCircle,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { RoomTetrisArchitectureDiagram } from './RoomTetrisArchitectureDiagram';

interface FirstTimeGuideBannerProps {
  onOpenGuideModal: () => void;
}

const STORAGE_KEY = 'rt_onboarding_collapsed_v1';

export function FirstTimeGuideBanner({ onOpenGuideModal }: FirstTimeGuideBannerProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [showDiagram, setShowDiagram] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed));
    } catch {
      // ignore
    }
  }, [isCollapsed]);

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white border border-blue-200/80 shadow-2xs overflow-hidden transition-all duration-200 break-keep mb-3.5">
      {/* 배너 상단 헤더 바 */}
      <div className="px-4 py-3 flex items-center justify-between gap-2 border-b border-blue-100/70 bg-white/50 backdrop-blur-2xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-2xs shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-black text-xs text-slate-900">
              초보자 3분 퀵가이드
            </span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full border border-blue-200/80">
              가구 실패 방지
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setShowDiagram((prev) => !prev)}
              className="text-[11px] font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-200 transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              {showDiagram ? (
                <>
                  <EyeOff className="w-3 h-3 text-slate-500" />
                  <span className="hidden sm:inline">구조도 닫기</span>
                  <span className="sm:hidden">구조도</span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 text-blue-600" />
                  <span className="hidden sm:inline">공식 구조도</span>
                  <span className="sm:hidden">구조도</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onOpenGuideModal}
            className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-100/70 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <HelpCircle className="w-3 h-3" />
            <span>상세 FAQ</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={isCollapsed ? '가이드 펼치기' : '가이드 접기'}
            title={isCollapsed ? '펼치기' : '접기'}
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* 접힌 상태 요약 */}
      {isCollapsed ? (
        <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-600 bg-white/30">
          <div className="flex items-center gap-2 text-[11px] font-medium truncate">
            <span className="text-blue-600 font-bold shrink-0">1. 공간 실측</span>
            <span className="text-slate-300">➔</span>
            <span className="text-emerald-600 font-bold shrink-0">2. 가구 테트리스</span>
            <span className="text-slate-300">➔</span>
            <span className="text-amber-600 font-bold shrink-0">3. 비우기 &amp; 스타일링</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="text-[11px] font-bold text-blue-600 hover:underline shrink-0 ml-2 cursor-pointer"
          >
            펼치기
          </button>
        </div>
      ) : (
        /* 펼쳐진 상태 본문 */
        <div className="p-4 space-y-3.5">
          {/* 3단계 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1단계 */}
            <div className="p-3 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-black text-[11px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="text-[10px] font-bold text-blue-600">공간 실측</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 mb-0.5">
                  내 방 크기 선택
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  5평·7평·1.5룸 중 선택하고 문 열림 반경(800mm) 여유를 체크하세요.
                </p>
              </div>
            </div>

            {/* 2단계 */}
            <div className="p-3 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-black text-[11px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">동선 검증</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 mb-0.5">
                  1초 가구 테트리스
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  침대와 책상의 황금 배치와 최소 보행 통로(600mm)를 2D 도면으로 확인합니다.
                </p>
              </div>
            </div>

            {/* 3단계 */}
            <div className="p-3 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-black text-[11px] flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="text-[10px] font-bold text-amber-600">비우기 &amp; 스타일링</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 mb-0.5">
                  바닥 짐 비우기 &amp; 테마
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  바닥 짐을 수납으로 매립하고 우드·모던·코지 테마를 바꿔보세요.
                </p>
              </div>
            </div>
          </div>

          {/* 인라인 라이프사이클 다이어그램 (토글 시 노출) */}
          {showDiagram && (
            <div className="pt-1">
              <RoomTetrisArchitectureDiagram />
            </div>
          )}

          {/* 하단 팁 바 */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-blue-100/70">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              사진 업로드 없이도 1초 만에 2D 가구배치 완성
            </span>
            <button
              type="button"
              onClick={onOpenGuideModal}
              className="text-blue-600 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>자세한 가이드 &amp; 치수표 보기</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
