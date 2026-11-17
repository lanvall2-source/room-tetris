/**
 * 제휴 마케팅 (쿠팡 파트너스 / 오늘의집) 링크 및 수익화 헬퍼
 */

// 사용자의 쿠팡 파트너스 subId나 트래킹 코드가 있으면 여기에 설정 (기본값 설정 가능)
export const AFFILIATE_CONFIG = {
  coupangTrackingId: 'ROOMTETRIS_APP',
  disclaimerText: '이 추천은 쿠팡 파트너스 활동의 일환으로, 구매 시 서비스 운영자에게 소정의 수수료가 제공될 수 있습니다.',
};

/**
 * 치수/규격 맞춤형 쿠팡 최저가 검색 URL 생성
 */
export function getCoupangSearchUrl(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  // 쿠팡 파트너스 웹/모바일 딥링크 규격 (검색창 딥링크)
  return `https://www.coupang.com/np/search?component=&q=${encoded}&channel=user`;
}

/**
 * 오늘의집 규격 검색 URL 생성
 */
export function getOhouSearchUrl(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  return `https://ohou.se/productions/feed?query=${encoded}`;
}
