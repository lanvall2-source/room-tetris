import React, { useState, useMemo } from 'react';
import {
  X,
  Ruler,
  HelpCircle,
  Search,
  BookOpen,
  BedDouble,
  Sliders,
  ShieldCheck,
  Package,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { RoomTetrisArchitectureDiagram } from './RoomTetrisArchitectureDiagram';

interface GuideAndFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'guide' | 'faq' | 'standards';
}

type TabType = 'guide' | 'faq' | 'standards';
type FaqCategory = 'all' | 'layout' | 'declutter' | 'dimension' | 'general';

interface FaqItem {
  id: string;
  category: FaqCategory;
  categoryLabel: string;
  question: string;
  answer: string;
  tip?: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'layout',
    categoryLabel: '가구배치',
    question: '원룸에서 침대와 책상은 어떻게 배치하는 것이 가장 좋은가요?',
    answer:
      '침대는 창문 바로 밑이나 가장 안쪽 벽면에 붙여 보행 동선을 방해하지 않게 배치하고, 책상은 침대와 최소 600mm 이상의 통로 거리를 확보하여 배치하는 것이 정석입니다. 책상에 앉았을 때 침대가 시야에 바로 보이지 않도록 시선 방향을 창문이나 벽 쪽으로 향하게 하면 공부/재택근무 집중도가 대폭 향상됩니다.',
    tip: '침대 헤드는 창문이나 벽에 붙이고, 방문을 열었을 때 바로 머리가 보이지 않는 안쪽 모서리가 이상적입니다.',
  },
  {
    id: 'faq-2',
    category: 'dimension',
    categoryLabel: '실측 치수',
    question: '방 치수를 잴 때 가장 많이 하는 실수는 무엇인가요?',
    answer:
      '바닥 면적만 재고 벽면 아래의 "걸레받이 몰딩(12~15mm 돌출)"과 "문짝 개폐 회전 반경(800mm)", "벽면 콘센트 위치"를 고려하지 않는 것입니다. 가로 1200mm 공간에 딱 1200mm 책상을 사면 몰딩에 걸려 들어가지 않으므로, 항상 가구 실측 시 양쪽 20~30mm 여유를 두어야 합니다.',
    tip: '방문이 안쪽으로 열릴 때 문틀에서 800mm 이내 영역에는 어떠한 가구도 배치하면 안 됩니다.',
  },
  {
    id: 'faq-3',
    category: 'dimension',
    categoryLabel: '실측 치수',
    question: '사람이 다니는 통로 폭은 최소 몇 mm가 필요한가요?',
    answer:
      '성인이 정면을 바라보고 편안하게 지나가려면 최소 600mm(0.6m)의 통로 폭이 필수적입니다. 만약 500mm 이하가 되면 옆걸음질로 통행해야 하며 일상생활에서 큰 피로감을 느끼게 됩니다. 의자에 앉았다 일어나는 공간은 책상 뒤로 최소 700~800mm가 필요합니다.',
  },
  {
    id: 'faq-4',
    category: 'declutter',
    categoryLabel: '짐정리/비우기',
    question: '좁은 방에서 바닥에 널브러진 짐을 없애는 가장 확실한 방법은?',
    answer:
      '룸테트리스의 "공중부양 & 수납 매립" 3원칙을 적용하세요: 1) 침대 하부 서랍이나 리프트업 수납 침대 활용, 2) 문 뒤 옷걸이 및 벽면 타공판을 이용한 수직 수납, 3) 바닥 공간을 차지하는 빨래건조대/행거를 접이식·틈새 수납으로 교체하여 바닥 가시 면적을 60% 이상 확보해야 방이 넓어 보입니다.',
  },
  {
    id: 'faq-5',
    category: 'layout',
    categoryLabel: '가구배치',
    question: '5평 원룸에 퀸(Q) 사이즈 침대를 놓아도 괜찮을까요?',
    answer:
      '권장하지 않습니다. 5평(약 16.5m²) 원룸은 가로·세로가 약 3.2m x 5m 수준으로, 퀸 침대(가로 1500mm x 세로 2000mm)를 배치하면 방 바닥 면적의 20% 이상을 차지하여 책상이나 옷장을 둘 공간과 보행 동선(600mm)이 완전히 막히게 됩니다. 5평 원룸에는 슈퍼싱글(1100x2000mm)이나 싱글(1000x2000mm)이 가장 적합합니다.',
  },
  {
    id: 'faq-6',
    category: 'general',
    categoryLabel: '기능/공유',
    question: '사진을 업로드하지 않아도 시뮬레이션이 가능한가요?',
    answer:
      '네, 100% 가능합니다! 5평 원룸, 7평 원룸, 1.5룸 등 한국 자취방 표준 평형 프리셋이 내장되어 있어 사진 없이도 클릭 1번(1초) 만에 정밀 2D 평면도와 가구 배치 시뮬레이션 결과를 즉시 확인할 수 있습니다.',
    tip: '방 사진을 업로드하시면 실제 방 형태와 창문/문 위치에 맞춘 시각 피드백을 함께 확인할 수 있습니다.',
  },
  {
    id: 'faq-7',
    category: 'general',
    categoryLabel: '기능/공유',
    question: '업로드한 방 사진이나 데이터가 서버에 저장되나요?',
    answer:
      '저장되지 않습니다. 사용자의 방 사진과 분석 결과는 사용자의 브라우저 로컬 저장소(LocalStorage)에만 안전하게 보관되며, 외부 서버로 전송되거나 저장되지 않으므로 사생활 침해 걱정 없이 안심하고 이용하실 수 있습니다.',
  },
  {
    id: 'faq-8',
    category: 'declutter',
    categoryLabel: '짐정리/비우기',
    question: '우드, 모던, 코지 테마는 무엇이 다른가요?',
    answer:
      '1) 내추럴 우드: 따뜻한 원목 가구와 화이트 톤으로 포근하고 편안한 자취방 감성을 연출합니다. 2) 모던 미드센추리: 스틸 프레임, 블랙/그레이 및 원색 포인트로 깔끔하고 세련된 오피스 겸용 분위기를 냅니다. 3) 포근한 코지: 패브릭 러그와 부드러운 파스텔 웜톤 조명으로 휴식 중심의 아늑한 공간을 만듭니다.',
  },
  {
    id: 'faq-9',
    category: 'general',
    categoryLabel: '기능/공유',
    question: '배치한 도면 결과를 친구나 룸메이트에게 공유하려면?',
    answer:
      '상단 헤더 또는 결과 리포트 하단의 [공유] 버튼을 누르면 스마트폰 카카오톡, 메시지 또는 클립보드 링크로 즉시 공유할 수 있습니다. 가구 사기 전이나 이사 전 친구에게 내 방 가구배치 의견을 물어보기에 매우 유용합니다.',
  },
];

export function GuideAndFaqModal({
  isOpen,
  onClose,
  initialTab = 'guide',
}: GuideAndFaqModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // 검색 & 카테고리 필터링
  const filteredFaqs = useMemo(() => {
    return FAQ_LIST.filter((item) => {
      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.tip && item.tip.toLowerCase().includes(q));
      return matchCategory && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 break-keep"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full sm:max-w-2xl bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
        {/* 모달 헤더 */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200 shrink-0">
              <HelpCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                룸테트리스 사용 가이드 &amp; FAQ
              </h2>
              <p className="text-[11px] text-slate-500">
                가구배치 3단계 공식 · 필수 치수표 · 자주 묻는 질문
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 내비게이션 바 */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-100/70 p-1 gap-1 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>3단계 공식</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>자주 묻는 질문 ({FAQ_LIST.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('standards')}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'standards'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'hover:text-slate-900'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-amber-600" />
            <span>필수 치수표</span>
          </button>
        </div>

        {/* 모달 본문 (스크롤) */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs max-h-[75vh]">
          {/* 탭 1: 3단계 가구배치 공식 & 다이어그램 */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <RoomTetrisArchitectureDiagram />

              {/* 생존 가구배치 3대 원칙 카드 */}
              <div className="space-y-2.5">
                <span className="font-black text-xs text-slate-900 block">
                  실패 방지! 자취방 생존 가구배치 3대 원칙
                </span>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    1. 출입문 개폐 반경 800mm 사수
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    방문이 안쪽으로 열리는 반경 800mm 이내에는 어떠한 가구도 두지 마세요.
                    문이 반만 열리거나 옷장 문과 부딪혀 파손되는 원인이 됩니다.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1">
                  <span className="font-extrabold text-blue-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    2. 최소 보행 통로 폭 600mm 확보
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    침대와 책상, 또는 침대와 벽 사이에는 사람이 정면으로 걸어 다닐 수 있는
                    최소 폭 600mm가 필요합니다. 400mm 이하는 매일 옆걸음질로 통행해야 합니다.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 space-y-1">
                  <span className="font-extrabold text-amber-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    3. 걸레받이 몰딩 15mm 오차 계산
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    벽면 바닥에는 걸레받이 몰딩이 12~15mm 돌출되어 있습니다. 가로 1200mm 공간에 딱
                    1200mm 가구를 사면 들어가지 않으므로 가구 실측 시 양쪽 20~30mm 여유를 두어야 합니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 탭 2: 자주 묻는 질문 (FAQ 9선) */}
          {activeTab === 'faq' && (
            <div className="space-y-3.5">
              {/* 검색창 */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="궁금한 내용을 검색해보세요 (예: 침대, 책상, 문, 치수...)"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* 카테고리 필터 칩 */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {[
                  { id: 'all', label: '전체 (9)' },
                  { id: 'layout', label: '가구배치' },
                  { id: 'declutter', label: '짐정리/비우기' },
                  { id: 'dimension', label: '실측 치수' },
                  { id: 'general', label: '기능/공유' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as FaqCategory)}
                    className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap cursor-pointer transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* FAQ 아코디언 리스트 */}
              <div className="space-y-2">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-xs">일치하는 질문이 없습니다.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="mt-2 text-[11px] text-blue-600 font-bold underline cursor-pointer"
                    >
                      전체 질문 다시 보기
                    </button>
                  </div>
                ) : (
                  filteredFaqs.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedFaqId(isExpanded ? null : faq.id)
                          }
                          className="w-full px-3.5 py-3 text-left flex items-start justify-between gap-2 cursor-pointer hover:bg-slate-50/80 transition-colors"
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-blue-600 uppercase">
                              [{faq.categoryLabel}]
                            </span>
                            <h4 className="font-bold text-xs text-slate-900 leading-snug">
                              Q. {faq.question}
                            </h4>
                          </div>
                          <span className="text-slate-400 mt-1 shrink-0">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="px-3.5 pb-3.5 pt-1 text-[11px] text-slate-600 border-t border-slate-100 bg-slate-50/50 space-y-2">
                            <p className="leading-relaxed">{faq.answer}</p>
                            {faq.tip && (
                              <div className="p-2 rounded-lg bg-blue-50/80 border border-blue-100 text-blue-800 text-[10px] flex items-start gap-1.5">
                                <span className="font-black shrink-0">TIP</span>
                                <span>{faq.tip}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* 탭 3: 필수 치수 & 가구 표준 규격표 */}
          {activeTab === 'standards' && (
            <div className="space-y-4">
              {/* 침대 표준 규격표 */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-xs text-slate-900">
                    침대 표준 규격 &amp; 원룸 추천 기준
                  </h4>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">사이즈</th>
                        <th className="py-2 px-3">가로 x 세로 (mm)</th>
                        <th className="py-2 px-3">추천 평형</th>
                        <th className="py-2 px-3">비고</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-900">싱글 (S)</td>
                        <td className="py-2 px-3">1,000 x 2,000</td>
                        <td className="py-2 px-3 text-blue-600 font-semibold">4~5평 미니원룸</td>
                        <td className="py-2 px-3 text-slate-500">최대 공간 확보</td>
                      </tr>
                      <tr className="hover:bg-slate-50 bg-blue-50/30">
                        <td className="py-2 px-3 font-bold text-blue-900">슈퍼싱글 (SS) ★</td>
                        <td className="py-2 px-3 font-semibold text-blue-900">1,100 x 2,000</td>
                        <td className="py-2 px-3 text-blue-700 font-bold">5~7평 원룸 (황금 표준)</td>
                        <td className="py-2 px-3 text-blue-700 font-medium">가장 추천하는 사이즈</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-900">더블 (D)</td>
                        <td className="py-2 px-3">1,350 x 2,000</td>
                        <td className="py-2 px-3 text-slate-700">7평 이상 원룸</td>
                        <td className="py-2 px-3 text-slate-500">여유로운 1인</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-900">퀸 (Q)</td>
                        <td className="py-2 px-3">1,500 x 2,000</td>
                        <td className="py-2 px-3 text-amber-700 font-semibold">8평 이상 / 1.5룸</td>
                        <td className="py-2 px-3 text-amber-700">5평 이하 배치 비권장</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 보행 동선 및 가구 간격 기준표 */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-xs text-slate-900">
                    생존 보행 동선 &amp; 간섭 여유 공간 기준
                  </h4>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">구분</th>
                        <th className="py-2 px-3">최소 필요 치수</th>
                        <th className="py-2 px-3">권장 여유 치수</th>
                        <th className="py-2 px-3">간섭 시 발생하는 문제</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-900">보행 통로 폭</td>
                        <td className="py-2 px-3 font-semibold text-rose-600">최소 600 mm</td>
                        <td className="py-2 px-3 text-emerald-700 font-bold">750~900 mm</td>
                        <td className="py-2 px-3 text-slate-500">옆걸음질 통행, 신체 타박상</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-900">출입문 개폐 반경</td>
                        <td className="py-2 px-3 font-semibold text-rose-600">최소 800 mm</td>
                        <td className="py-2 px-3 text-emerald-700 font-bold">850~900 mm</td>
                        <td className="py-2 px-3 text-slate-500">문이 반만 열림, 가구 모서리 파손</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-900">책상 의자 뒤 공간</td>
                        <td className="py-2 px-3 font-semibold text-rose-600">최소 700 mm</td>
                        <td className="py-2 px-3 text-emerald-700 font-bold">800~1,000 mm</td>
                        <td className="py-2 px-3 text-slate-500">의자를 뒤로 빼지 못해 착석 불편</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-900">옷장 문·서랍 인출</td>
                        <td className="py-2 px-3 font-semibold text-rose-600">최소 500 mm</td>
                        <td className="py-2 px-3 text-emerald-700 font-bold">600~700 mm</td>
                        <td className="py-2 px-3 text-slate-500">서랍이 다 열리지 않아 옷 수납 불가</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 보안 및 데이터 안내 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  룸테트리스의 모든 데이터와 사진은 브라우저 로컬(LocalStorage)에만 보존되며 외부 서버에 저장되지 않습니다.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 모달 하단 버튼 바 */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            토스 회원 평생 100% 무료
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
