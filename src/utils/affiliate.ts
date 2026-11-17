/**
 * 제휴 마케팅 (쿠팡 파트너스 / 오늘의집) 링크 및 수익화 헬퍼
 */

export const AFFILIATE_CONFIG = {
  coupangTrackingId: 'AF5768110', // 사용자 쿠팡 파트너스 고유 ID
  subId: 'roomtetris',
  disclaimerText: '이 추천은 쿠팡 파트너스 활동의 일환으로, 구매 시 서비스 운영자에게 소정의 수수료가 제공될 수 있습니다.',
};

/**
 * 치수/규격 맞춤형 쿠팡 최저가 검색 URL 생성
 * 쿠팡 파트너스 공식 게이트웨이를 경유하여 24시간 수익 추적 쿠키를 심은 후
 * 해당 가구/정리템의 규격 검색 결과 페이지로 안전하게 랜딩시킵니다.
 */
export function getCoupangSearchUrl(keyword: string): string {
  const encodedKeyword = encodeURIComponent(keyword);
  const targetLanding = `https://www.coupang.com/np/search?component=&q=${encodedKeyword}&channel=user`;

  // 쿠팡 파트너스 공식 트래킹 게이트웨이 주소
  return `https://link.coupang.com/gateway.ec?landing=${encodeURIComponent(targetLanding)}&trackingCode=${AFFILIATE_CONFIG.coupangTrackingId}&subId=${AFFILIATE_CONFIG.subId}`;
}

/**
 * 오늘의집 규격 검색 URL 생성
 */
export function getOhouSearchUrl(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  return `https://ohou.se/productions/feed?query=${encoded}`;
}
