import {DEFAULT_STUDENT_PREFERENCE, TIME_SLOT_OPTIONS} from '@/data/mockData';
import type {LocationCoordinates, StudentPreference, TimeSlot} from '@/types/models';

const STORAGE_KEY = 'hust-career-path:student-preference';

const VALID_TIME_SLOTS = new Set<string>(TIME_SLOT_OPTIONS);

function sanitizeTimeSlots(slots: unknown): TimeSlot[] {
  if (!Array.isArray(slots)) return [];
  return slots.filter((s): s is TimeSlot => typeof s === 'string' && VALID_TIME_SLOTS.has(s));
}

function sanitizeCoordinates(value: unknown): LocationCoordinates | null {
  if (!value || typeof value !== 'object') return null;
  const coords = value as LocationCoordinates;
  if (!Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) return null;
  return {lat: coords.lat, lng: coords.lng};
}

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
    const storedCoords = sanitizeCoordinates(parsedPreference.homeCoords);
    return {
      homeAddress: parsedPreference.homeAddress || DEFAULT_STUDENT_PREFERENCE.homeAddress,
      homeCoords: storedCoords ?? DEFAULT_STUDENT_PREFERENCE.homeCoords,
      maxDistanceKm: Number.isFinite(parsedPreference.maxDistanceKm)
        ? parsedPreference.maxDistanceKm
        : DEFAULT_STUDENT_PREFERENCE.maxDistanceKm,
      classSchedule: Array.isArray(parsedPreference.classSchedule)
        ? sanitizeTimeSlots(parsedPreference.classSchedule)
        : DEFAULT_STUDENT_PREFERENCE.classSchedule,
      freeTime: Array.isArray(parsedPreference.freeTime) ? sanitizeTimeSlots(parsedPreference.freeTime) : DEFAULT_STUDENT_PREFERENCE.freeTime,
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
