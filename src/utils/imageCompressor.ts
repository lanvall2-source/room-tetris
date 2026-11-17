/**
 * 클라이언트 측 이미지 초경량 압축 유틸리티
 * 10~20MB 스마트폰 원본 사진을 100~200KB 수준으로 압축하여
 * Gemini Vision API 비용을 90% 이상 절감하고 브라우저 메모리 폭탄 방지
 */

export interface CompressionResult {
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  compressionRatio: number;
}

export async function compressImage(
  file: File,
  maxWidth = 1080,
  maxHeight = 1080,
  quality = 0.82
): Promise<CompressionResult> {
  const originalSizeKb = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // 종횡비 유지하면서 최대 규격 축소
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context 생성 실패'));
          return;
        }

        // 선명도 유지를 위한 보간 설정
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // WebP 지원 확인 후 WebP 또는 JPEG로 압축
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // 압축 용량 계산 (base64 바이트 수)
        const head = dataUrl.indexOf(',') + 1;
        const compressedBytes = Math.round((dataUrl.length - head) * 0.75);
        const compressedSizeKb = Math.round(compressedBytes / 1024);
        const compressionRatio = Math.max(0, Math.round(((originalSizeKb - compressedSizeKb) / originalSizeKb) * 100));

        resolve({
          dataUrl,
          originalSizeKb,
          compressedSizeKb,
          compressionRatio,
        });
      };

      img.onerror = () => reject(new Error('이미지 로드 중 오류가 발생했습니다.'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsDataURL(file);
  });
}
