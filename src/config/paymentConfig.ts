/**
 * 토스페이먼츠(Toss Payments) 결제 설정
 * 
 * - 현재 키: 토스페이먼츠 공식 테스트 클라이언트 키 (가상 카드, 카카오페이, 토스페이 결제창 테스트 가능)
 * - 상용 전환: 토스페이먼츠(developers.tosspayments.com) 가입 후 발급받은 'live_ck_...'로 교체하면
 *   실제 대표님 통장으로 1,900원 / 3,900원이 정산 입금됩니다.
 */
export const PAYMENT_CONFIG = {
  // 토스페이먼츠 테스트 클라이언트 키 (공식 문서 기본 테스트 키)
  tossClientKey: 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq',
  isLiveMode: false,
};
