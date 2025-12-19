export interface DiffResult {
  added: Record<string, any>;
  removed: Record<string, any>;
  updated: Record<string, { from: any; to: any }>;
  hasChanges: boolean;
}

export const calculateDiff = (before: any, after: any): DiffResult => {
  const result: DiffResult = {
    added: {},
    removed: {},
    updated: {},
    hasChanges: false
  };

  const beforeObj = before || {};
  const afterObj = after || {};

  const allKeys = new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]);

  allKeys.forEach(key => {
    const valBefore = beforeObj[key];
    const valAfter = afterObj[key];

    if (valBefore === undefined && valAfter !== undefined) {
      result.added[key] = valAfter;
      result.hasChanges = true;
    } else if (valBefore !== undefined && valAfter === undefined) {
      result.removed[key] = valBefore;
      result.hasChanges = true;
    } else if (JSON.stringify(valBefore) !== JSON.stringify(valAfter)) {
      result.updated[key] = { from: valBefore, to: valAfter };
      result.hasChanges = true;
    }
  });

  return result;
};

export const formatDiffForAI = (diff: DiffResult): string => {
  let summary = "ALTERAÇÕES TÉCNICAS:\n";
  if (Object.keys(diff.added).length) summary += `- ADICIONADO: ${JSON.stringify(diff.added)}\n`;
  if (Object.keys(diff.removed).length) summary += `- REMOVIDO: ${JSON.stringify(diff.removed)}\n`;
  if (Object.keys(diff.updated).length) summary += `- MODIFICADO: ${JSON.stringify(diff.updated)}\n`;
  return summary;
};