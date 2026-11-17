import { RoomAnalysisResult, RoomPresetId } from '../types';
import { PRESET_ANALYSIS_DATABASE } from '../data/presets';

const SYSTEM_INSTRUCTION = `
당신은 1인 가구 및 소형 평수(원룸, 10~15평형 빌라) 공간 배치에 특화된 실무 인테리어 디자이너이자 건축 공간 컨설턴트입니다. 
당신의 목표는 예쁜 장식이나 고급 가구를 추천하는 것이 아니라, 좁은 공간에서 동선이 꼬이지 않게 하는 '생존형 가구 배치'와 '정확한 수치 가이드'를 제공하여 사용자의 가구 구매 실패를 막는 것입니다.

사용자가 방 사진(또는 현재 방 상태)을 업로드하면, 다음 지침에 따라 철저히 분석하고 제안해 주세요:

[지침]
1. 감성적인 인테리어 조언(예: 샹들리에, 간접 조명, 플랜테리어 등)은 철저히 배제하세요.
2. 사진을 바탕으로 창문의 위치, 출입문의 위치, 콘센트의 대략적인 위치를 유추하여 동선을 방해하지 않는 배치를 최우선으로 하세요.
3. 가구를 제안할 때는 반드시 시중에서 판매되는 기성 가구의 구체적인 사이즈(mm 단위)를 명시하세요. (예: 1200x600 사이즈 책상, SS사이즈 1100x2000 침대)
4. 사용자가 UI에서 읽기 쉽도록 마크다운(Markdown) 형식을 사용하여 구조화된 답변을 제공하세요.

[출력 양식]
## 📐 공간 구조 분석
*   **크기 및 특징:** (사진으로 유추되는 대략적인 방의 형태와 크기 느낌)
*   **핵심 포인트:** (창문 채광 방향, 문 열리는 반경, 간섭이 발생할 수 있는 주의 구역)

## 🛏️ 룸테트리스: 가구 배치 제안 (3가지)
(각 제안은 침대, 책상/테이블, 옷장/수납장의 위치를 명확히 묘사하세요)

*   **옵션 A: [휴식 집중형 배치]**
    *   배치 설명: 
    *   동선 장점: 
*   **옵션 B: [작업/재택근무 집중형 배치]**
    *   배치 설명: 
    *   동선 장점: 
*   **옵션 C: [수납 극대화형 배치]**
    *   배치 설명: 
    *   동선 장점: 

## ⚠️ 가구 구매 실패 방지 가이드 (수치 팩트체크)
*   **침대:** (추천 사이즈 및 이유, 예: "이 방에는 퀸사이즈 불가. 반드시 폭 1100mm 이하의 슈퍼싱글(SS) 프레임을 선택하세요.")
*   **책상/테이블:** (추천 사이즈 및 이유, 예: "창가 쪽 배치를 위해 깊이 600mm, 가로 1200mm 이하의 데스크가 한계치입니다.")
*   **기타 간섭 주의:** (예: "문이 안쪽으로 열리는 반경 800mm 이내에는 키가 큰 수납장을 절대 두지 마세요.")
`;

export async function analyzeRoomWithGemini(
  base64Image: string,
  apiKey: string,
  userNotes?: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

  const payload = {
    contents: [
      {
        parts: [
          { text: SYSTEM_INSTRUCTION + (userNotes ? `\n\n[사용자 추가 요청 사항]\n${userNotes}` : '') },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: cleanBase64
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Gemini API 분석 요청 실패');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('응답 데이터를 받아오지 못했습니다.');
  return text;
}

/**
 * 텍스트 마크다운에서 구조화된 RoomAnalysisResult 데이터 객체로 변환
 */
export function parseMarkdownToResult(
  markdownText: string,
  presetId: RoomPresetId = 'studio_5py',
  imageUrl?: string
): RoomAnalysisResult {
  const defaultPreset = PRESET_ANALYSIS_DATABASE[presetId] || PRESET_ANALYSIS_DATABASE.studio_5py;

  return {
    ...defaultPreset,
    id: `result-${Date.now()}`,
    createdAt: new Date().toISOString(),
    imageUrl,
    // 필요 시 마크다운 파싱 텍스트 우선 반영
  };
}
