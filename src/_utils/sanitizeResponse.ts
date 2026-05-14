const JOSA_MAP: Record<string, string> = {
  "아": "아",   // 철수야 → 상대방아 (받침 없으면 야→아 X, 그대로)
  "야": "아",   // 영희야 → 상대방아 (야 → 아, 받침 없는 이름)
  "은": "은",
  "는": "는",
  "이": "이",
  "가": "가",
  "을": "을",
  "를": "를",
  "과": "과",
  "와": "와",
};

// 이름 뒤에 붙을 수 있는 모든 호칭/조사 패턴
const TRAILING_PATTERN = "(야|아|은|는|이|가|을|를|과|와|님|씨|한테|에게|도|만|랑|이랑)?";

/**
 * JSON 문자열에서 실명을 익명화한다.
 * - 화자 라벨, 본문 텍스트, 호칭(~야/~아 등) 모두 처리
 * - JSON 구조 키(target_name 필드 등)는 보존
 */
export const sanitizeResponse = (
  jsonString: string,
  targetName: string | null | undefined,
  userName: string | null | undefined
): string => {
  if (!jsonString) return jsonString;

  let sanitized = jsonString;

  const replacements: Array<{ name: string; replacement: string }> = [
    { name: (targetName ?? "").trim(), replacement: "상대방" },
    { name: (userName ?? "").trim(),   replacement: "본인"   },
  ];

  for (const { name, replacement } of replacements) {
    if (!name) continue;

    // 이름 + 선택적 조사/호칭 패턴
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`${escaped}${TRAILING_PATTERN}`, "g");

    sanitized = sanitized.replace(pattern, (match, josa) => {
      if (!josa) return replacement;

      // 조사 보정: "야" → 받침 없는 이름 뒤 → "아"로 통일
      // replacement 마지막 글자 받침 여부로 판단
      const lastChar = replacement.charCodeAt(replacement.length - 1);
      const hasBatchim = (lastChar - 0xAC00) % 28 !== 0;

      const correctedJosa = correctJosa(josa, hasBatchim);
      return `${replacement}${correctedJosa}`;
    });
  }

  return sanitized;
};

/**
 * 치환어(본인/상대방) 뒤에 붙을 조사를 받침 여부에 맞게 보정
 */
const correctJosa = (josa: string, hasBatchim: boolean): string => {
  const josaMap: Record<string, [string, string]> = {
    //        [받침 없을 때, 받침 있을 때]
    "야": ["야", "아"],  // 영희야 → 상대방아 (방: 받침 있음)
    "아": ["야", "아"],
    "은": ["는", "은"],
    "는": ["는", "은"],
    "이": ["가", "이"],
    "가": ["가", "이"],
    "을": ["를", "을"],
    "를": ["를", "을"],
    "과": ["와", "과"],
    "와": ["와", "과"],
    "이랑": ["랑", "이랑"],
    "랑": ["랑", "이랑"],
  };

  const pair = josaMap[josa];
  if (!pair) return josa; // 님, 씨, 한테 등은 그대로

  return hasBatchim ? pair[1] : pair[0];
};