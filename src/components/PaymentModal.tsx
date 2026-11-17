import React, { useState } from 'react';
import { 
  X, Check, Sparkles, ShieldCheck, Zap, Share2, 
  CreditCard, ArrowRight, Lock, Gift 
} from 'lucide-react';
import { addPaidCredits, claimShareBonus } from '../utils/creditManager';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'bundle'>('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // 결제 진행 (토스페이/카카오페이 즉시 연동 시뮬레이터 및 크레딧 충전)
  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 800));

    const creditToAdd = selectedPlan === 'single' ? 1 : 3;
    addPaidCredits(creditToAdd);
    setIsProcessing(false);

    alert(`🎉 결제가 완료되었습니다! (${creditToAdd}회 분석권 충전)\n지금 바로 내 방 분석을 시작합니다.`);
    onSuccess();
    onClose();
  };

  // 친구에게 공유하고 1회 무료 충전
  const handleShare = async () => {
    const shareData = {
      title: '룸테트리스 - 원룸 생존형 가구배치 & 치수 가이드',
      text: '가구 사기 전에 1mm 단위로 문 열림 간섭 체크하세요! 1인 가구 필수 앱',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        const res = claimShareBonus();
        setShareMessage(res.message);
        if (res.success) {
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1200);
        }
      } catch {
        // 취소된 경우 무시
      }
    } else {
      await navigator.clipboard.writeText(window.location.origin);
      const res = claimShareBonus();
      setShareMessage(res.message);
      if (res.success) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* 모달 상단 헤더 */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white p-5 sm:p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>가구 구매 실패 100% 방지 보증</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black leading-tight mb-1.5">
            10만원짜리 가구 반품비,<br />물지 마세요!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100">
            커피 한 잔 값으로 1mm 단위 한계치수와 문 열림 간섭을 완벽히 회피하세요.
          </p>
        </div>

        {/* 요금제 선택 영역 */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          
          <div className="space-y-3">
            {/* 단건 1회권 */}
            <div
              onClick={() => setSelectedPlan('single')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'single'
                  ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    selectedPlan === 'single' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {selectedPlan === 'single' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">내 방 맞춤 1회 분석권</h3>
                    <p className="text-xs text-slate-500">실사진 AI 정밀 도면 + mm 단위 수치 리포트</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-slate-900">1,900원</div>
                  <div className="text-[10px] text-emerald-700 font-bold">커피 반 잔 값</div>
                </div>
              </div>
            </div>

            {/* 이사 3회 패키지 (인기) */}
            <div
              onClick={() => setSelectedPlan('bundle')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedPlan === 'bundle'
                  ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="absolute -top-2.5 right-4 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                인기 32% 할인
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    selectedPlan === 'bundle' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {selectedPlan === 'bundle' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">이사/정리 3회 패키지</h3>
                    <p className="text-xs text-slate-500">방 + 거실 + 주방 3장 분석 (가족/친구 공유 가능)</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-slate-900">3,900원</div>
                  <div className="text-[10px] text-slate-400 line-through">5,700원</div>
                </div>
              </div>
            </div>
          </div>

          {/* 결제 포함 혜택 리스트 */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>사진 속 창문, 콘센트, 800mm 문 열림 반경 자동 감지</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>휴식형·작업형·수납형 3가지 2D 평면도 즉시 생성</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>침대·책상·옷장 mm 단위 구매 한계치수 팩트체크</span>
            </div>
          </div>

          {/* 간편 결제 버튼 */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>안전 결제 처리 중...</span>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>{selectedPlan === 'single' ? '1,900원' : '3,900원'} 간편 결제하기</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" /> 카카오페이 / 토스 / 네이버페이 지원
            </span>
            <span>•</span>
            <span>즉시 환불 보장</span>
          </div>

          {/* 바이럴 무료 옵션: 친구에게 공유하고 1회 무료 충전 */}
          <div className="border-t border-slate-200 pt-3">
            {shareMessage && (
              <div className="p-2.5 mb-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200">
                {shareMessage}
              </div>
            )}
            <button
              onClick={handleShare}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-amber-400 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4 text-amber-600" />
              <span>친구에게 링크 공유하고 1회 무료 받기 (+1회 즉시 지급)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
