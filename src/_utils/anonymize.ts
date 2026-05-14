import { RankingItem } from '@/_lib/database';

export const anonymizeText = (text: string | null | undefined, userName: string, targetName: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  let result = text;


  result = result.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "익명메일");
  result = result.replace(/@[a-zA-Z0-9._]+/g, "익명ID");

  const filterName = (name: string, replacement: string) => {
    if (!name || name === "익명" || name === "익명의 사용자" || name === "익명사용자") return;
    
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedName, 'gi');
    result = result.replace(regex, replacement);

    if (name.length >= 3 && name.length <= 4 && /^[가-힣]+$/.test(name)) {
      const firstName = name.substring(1);
      if (firstName.length >= 1) {
        result = result.split(firstName).join(replacement);
      }
    }
  };

  filterName(userName, "사용자");
  filterName(targetName, "상대방");

  result = result.split("본인").join("사용자");
  return result;
};

export const getAnonymizedItem = (item: RankingItem): RankingItem => {
  const u = item.userName || '';
  const t = item.targetName || '';
  
  return {
    ...item,
    userType: anonymizeText(item.userType, u, t),
    analysisItems: (item.analysisItems ?? []).map(ai => ({
      ...ai,
      behavior: anonymizeText(ai.behavior, u, t),
      description: anonymizeText(ai.description, u, t),
      evidence: anonymizeText(ai.evidence, u, t),
    })),
    compatibilityIssues: (item.compatibilityIssues ?? []).map(ci => ({
      ...ci,
      issue: anonymizeText(ci.issue, u, t),
      detail: anonymizeText(ci.detail, u, t),
    })),
    finalVerdict: {
      ...item.finalVerdict,
      status: anonymizeText(item.finalVerdict?.status, u, t),
      comment: anonymizeText(item.finalVerdict?.comment, u, t),
    }
  };
};
