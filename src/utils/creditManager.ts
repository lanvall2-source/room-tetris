/**
 * 크레딧 및 1일 1회 무료 분석 제한 관리 모듈
 */

const STORAGE_LAST_FREE_DATE = 'roomtetris_free_scan_date_v1';
const STORAGE_PAID_CREDITS = 'roomtetris_paid_credits_v1';
const STORAGE_BONUS_CREDITS = 'roomtetris_bonus_credits_v1';
const STORAGE_LAST_SHARE_DATE = 'roomtetris_share_date_v1';

export interface CreditStatus {
  hasFreeToday: boolean;
  paidCredits: number;
  bonusCredits: number;
  totalUsable: number;
  isUnlimitedKey: boolean;
  canShareForBonus: boolean;
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getCreditStatus(hasOwnApiKey = false): CreditStatus {
  if (hasOwnApiKey) {
    return {
      hasFreeToday: true,
      paidCredits: 999,
      bonusCredits: 999,
      totalUsable: 999,
      isUnlimitedKey: true,
      canShareForBonus: false,
    };
  }

  const today = getTodayString();
  const lastFreeDate = localStorage.getItem(STORAGE_LAST_FREE_DATE);
  const hasFreeToday = lastFreeDate !== today;

  const paidCredits = parseInt(localStorage.getItem(STORAGE_PAID_CREDITS) || '0', 10);
  const bonusCredits = parseInt(localStorage.getItem(STORAGE_BONUS_CREDITS) || '0', 10);

  const lastShareDate = localStorage.getItem(STORAGE_LAST_SHARE_DATE);
  const canShareForBonus = lastShareDate !== today;

  const totalUsable = (hasFreeToday ? 1 : 0) + paidCredits + bonusCredits;

  return {
    hasFreeToday,
    paidCredits,
    bonusCredits,
    totalUsable,
    isUnlimitedKey: false,
    canShareForBonus,
  };
}

/**
 * 분석 1회 차감 (우선순위: 오늘의 무료권 -> 공유 보너스 -> 유료 크레딧)
 */
export function consumeScanCredit(hasOwnApiKey = false): boolean {
  if (hasOwnApiKey) return true;

  const status = getCreditStatus(false);
  if (status.totalUsable <= 0) {
    return false;
  }

  const today = getTodayString();

  if (status.hasFreeToday) {
    localStorage.setItem(STORAGE_LAST_FREE_DATE, today);
    return true;
  }

  if (status.bonusCredits > 0) {
    localStorage.setItem(STORAGE_BONUS_CREDITS, String(status.bonusCredits - 1));
    return true;
  }

  if (status.paidCredits > 0) {
    localStorage.setItem(STORAGE_PAID_CREDITS, String(status.paidCredits - 1));
    return true;
  }

  return false;
}

/**
 * 유료 크레딧 충전
 */
export function addPaidCredits(amount: number): number {
  const current = parseInt(localStorage.getItem(STORAGE_PAID_CREDITS) || '0', 10);
  const updated = current + amount;
  localStorage.setItem(STORAGE_PAID_CREDITS, String(updated));
  return updated;
}

/**
 * 카카오톡/링크 공유 시 1일 1회 보너스 크레딧 1회 지급
 */
export function claimShareBonus(): { success: boolean; message: string } {
  const today = getTodayString();
  const lastShareDate = localStorage.getItem(STORAGE_LAST_SHARE_DATE);

  if (lastShareDate === today) {
    return { success: false, message: '오늘은 이미 공유 보너스를 받으셨습니다. 내일 다시 참여해주세요!' };
  }

  localStorage.setItem(STORAGE_LAST_SHARE_DATE, today);
  const currentBonus = parseInt(localStorage.getItem(STORAGE_BONUS_CREDITS) || '0', 10);
  localStorage.setItem(STORAGE_BONUS_CREDITS, String(currentBonus + 1));

  return { success: true, message: '🎉 공유 보너스로 무료 분석권 1회가 지급되었습니다!' };
}
