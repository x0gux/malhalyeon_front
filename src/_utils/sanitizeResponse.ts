const JOSA_MAP: Record<string, string> = {
  "아": "아",  
  "야": "아", 
  "은": "은",
  "는": "는",
  "이": "이",
  "가": "가",
  "을": "을",
  "를": "를",
  "과": "과",
  "와": "와",
};

const TRAILING_PATTERN = "(야|아|은|는|이|가|을|를|과|와|님|씨|한테|에게|도|만|랑|이랑)?";

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

    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`${escaped}${TRAILING_PATTERN}`, "g");

    sanitized = sanitized.replace(pattern, (match, josa) => {
      if (!josa) return replacement;

      const lastChar = replacement.charCodeAt(replacement.length - 1);
      const hasBatchim = (lastChar - 0xAC00) % 28 !== 0;

      const correctedJosa = correctJosa(josa, hasBatchim);
      return `${replacement}${correctedJosa}`;
    });
  }

  return sanitized;
};

const correctJosa = (josa: string, hasBatchim: boolean): string => {
  const josaMap: Record<string, [string, string]> = {

    "야": ["야", "아"],
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
  if (!pair) return josa; 

  return hasBatchim ? pair[1] : pair[0];
};