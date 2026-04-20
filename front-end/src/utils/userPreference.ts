import {DEFAULT_STUDENT_PREFERENCE} from '@/data/mockData';
import type {StudentPreference} from '@/types/models';

const STORAGE_KEY = 'hust-career-path:student-preference';

function isStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getStoredStudentPreference(): StudentPreference {
  if (!isStorageAvailable()) {
    return DEFAULT_STUDENT_PREFERENCE;
  }

  const rawPreference = window.localStorage.getItem(STORAGE_KEY);
  if (!rawPreference) {
    return DEFAULT_STUDENT_PREFERENCE;
  }

  try {
    const parsedPreference = JSON.parse(rawPreference) as StudentPreference;
    return {
      homeAddress: parsedPreference.homeAddress || DEFAULT_STUDENT_PREFERENCE.homeAddress,
      maxDistanceKm: Number.isFinite(parsedPreference.maxDistanceKm)
        ? parsedPreference.maxDistanceKm
        : DEFAULT_STUDENT_PREFERENCE.maxDistanceKm,
      classSchedule: Array.isArray(parsedPreference.classSchedule)
        ? parsedPreference.classSchedule
        : DEFAULT_STUDENT_PREFERENCE.classSchedule,
      freeTime: Array.isArray(parsedPreference.freeTime) ? parsedPreference.freeTime : DEFAULT_STUDENT_PREFERENCE.freeTime,
    };
  } catch {
    return DEFAULT_STUDENT_PREFERENCE;
  }
}

export function saveStudentPreference(preference: StudentPreference) {
  if (!isStorageAvailable()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
}
