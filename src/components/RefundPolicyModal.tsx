import React from 'react';
import { X, ShieldAlert, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

interface RefundPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RefundPolicyModal: React.FC<RefundPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* 모달 상단 */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                취소 및 환불 정책 (이용약관)
              </h2>
              <p className="text-[11px] text-slate-500">
                전자상거래 등에서의 소비자보호에 관한 법률 준수
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 정책 본문 */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <strong className="text-emerald-900 flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. 미사용 분석권 전액 환불 (결제일로부터 7일 이내)
            </strong>
            <p className="text-slate-600 text-xs">
              구매 후 사용하지 않은 1회 분석권 또는 3회 패키지 잔여 티켓은 결제일로부터 7일 이내 요청 시 수수료 없이 100% 전액 환불됩니다.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1">
            <strong className="text-amber-900 flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              2. 분석 완료된 디지털 콘텐츠 환불 제한
            </strong>
            <p className="text-slate-600 text-xs">
              본 서비스는 결제 즉시 AI 비전 공간 분석 및 2D 맞춤 도면이 생성되어 제공되는 <strong>디지털 콘텐츠 상품</strong>입니다. 
              분석이 시작되어 결과 리포트가 열람된 이후에는 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호에 따라 단순 변심에 의한 청약철회 및 환불이 제한됩니다.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
            <strong className="text-blue-900 flex items-center gap-1.5 font-bold">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              3. 시스템 오류 및 서비스 하자 발생 시
            </strong>
            <p className="text-slate-600 text-xs">
              네트워크 장애, 서버 오류 등으로 인해 결제 후 분석 결과가 정상적으로 표시되지 않거나 오류가 발생한 경우, 고객센터로 접수해 주시면 <strong>즉시 분석권 재지급 또는 100% 결제 취소(환불)</strong> 처리를 보장합니다.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
            <strong className="text-slate-900 block font-bold">환불 접수 및 고객 문의</strong>
            <p>이메일: <strong>lanvall2@gmail.com</strong></p>
            <p>처리 기간: 접수 확인 후 영업일 기준 1~2일 이내 카드 승인 취소 또는 환불 처리</p>
          </div>

        </div>

        {/* 닫기 버튼 */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
