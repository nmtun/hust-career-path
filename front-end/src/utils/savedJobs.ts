const STORAGE_KEY = 'hust-career-path:saved-jobs';

function isStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getSavedJobIds(): string[] {
  if (!isStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleSavedJob(jobId: string): string[] {
  const current = getSavedJobIds();
  const updated = current.includes(jobId)
    ? current.filter((id) => id !== jobId)
    : [...current, jobId];
  if (isStorageAvailable()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}
