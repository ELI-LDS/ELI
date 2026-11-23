/** 범위 밖 값은 제한하고, 유효하지 않은 숫자는 진행률을 모르는 상태로 처리해요. */
export function normalizeProgress(progress: number | undefined) {
  return progress !== undefined && Number.isFinite(progress)
    ? Math.min(100, Math.max(0, progress)) : undefined;
}
