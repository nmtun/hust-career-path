import MapPicker from '@/components/MapPicker';
import WeekScheduleGrid from '@/components/WeekScheduleGrid';
import {DAYS_OF_WEEK, MOCK_JOBS, TIME_SLOT_OPTIONS, TIMES_OF_DAY} from '@/data/mockData';
import type {DayOfWeek, Job, LocationCoordinates, StudentPreference, TimeOfDay, TimeSlot} from '@/types/models';
import {getStoredStudentPreference, saveStudentPreference} from '@/utils/userPreference';
import {getSavedJobIds, toggleSavedJob} from '@/utils/savedJobs';
import {Bookmark, Briefcase, CheckCircle, Clock, DollarSign, Flame, MapPin, Search, SlidersHorizontal, Star, X} from 'lucide-react';
import {Link, useSearchParams} from 'react-router-dom';
import {useEffect, useMemo, useState} from 'react';

type SortOption = 'match' | 'distance' | 'latest';

const JOBS_PER_PAGE = 8;

function parseDaysFromPostedDate(postedDate: string) {
  const matchedValue = postedDate.match(/\d+/);
  return matchedValue ? Number(matchedValue[0]) : 999;
}

function isDeadlineExpired(deadline: string): boolean {
  const parts = deadline.split('/');
  if (parts.length !== 3) return false;
  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day) < new Date(new Date().setHours(0, 0, 0, 0));
}

function calculateMatchScore(job: Job, preference: StudentPreference) {
  const scheduleScore = -job.workSlots.filter((slot) => preference.classSchedule.includes(slot)).length * 10;

  const score = 70 + scheduleScore + (job.companyInfo.isVerified ? 8 : -12);

  return Math.max(0, Math.min(100, Math.round(score)));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(from: LocationCoordinates, to: LocationCoordinates) {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);
  const startLat = toRadians(from.lat);
  const endLat = toRadians(to.lat);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2) * Math.cos(startLat) * Math.cos(endLat);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

async function geocodeAddress(query: string, signal?: AbortSignal): Promise<LocationCoordinates | null> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('q', query);
  url.searchParams.set('countrycodes', 'vn');

  const response = await fetch(url.toString(), {
    signal,
    headers: {
      'Accept-Language': 'vi',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to geocode address');
  }

  const results = (await response.json()) as Array<{lat: string; lon: string}>;
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const first = results[0];
  return {
    lat: Number(first.lat),
    lng: Number(first.lon),
  };
}

function isRemoteJob(job: Job) {
  const normalizedLocation = job.location.toLowerCase();
  return normalizedLocation.includes('online') || normalizedLocation.includes('remote') || normalizedLocation.includes('từ xa');
}

function getJobDistanceKm(job: Job, preference: StudentPreference) {
  if (isRemoteJob(job)) return 0;
  if (job.locationCoords) {
    return calculateDistanceKm(preference.homeCoords, job.locationCoords);
  }
  return job.distanceKm;
}


export default function JobSearchPage() {
  const [searchParams] = useSearchParams();
  const [preference, setPreference] = useState<StudentPreference>(() => getStoredStudentPreference());
  const [keyword, setKeyword] = useState(() => searchParams.get('q') ?? '');
  const [onlyVerified, setOnlyVerified] = useState(true);
  const [appliedPreference, setAppliedPreference] = useState<StudentPreference>(() => getStoredStudentPreference());
  const [appliedKeyword, setAppliedKeyword] = useState(() => searchParams.get('q') ?? '');
  const [appliedOnlyVerified, setAppliedOnlyVerified] = useState(true);

  useEffect(() => {
    const nextKeyword = searchParams.get('q') ?? '';
    setKeyword(nextKeyword);
    setAppliedKeyword(nextKeyword);
  }, [searchParams]);
  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [appliedSortBy, setAppliedSortBy] = useState<SortOption>('match');
  const [currentPage, setCurrentPage] = useState(1);
  const [saveMessage, setSaveMessage] = useState('');
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => getSavedJobIds());
  const [isWeekScheduleGridVisible, setIsWeekScheduleGridVisible] = useState(false);
  const [isMapPickerVisible, setIsMapPickerVisible] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState('');

  const matchedJobs = useMemo(() => {
    const normalizedKeyword = appliedKeyword.trim().toLowerCase();
    const hasScheduleConflict = (job: Job) =>
      job.workSlots.some((slot) => appliedPreference.classSchedule.includes(slot));

    const filtered = MOCK_JOBS.flatMap((job) => {
      const distanceKm = getJobDistanceKm(job, appliedPreference);
      const matchedKeyword =
        normalizedKeyword.length === 0 ||
        [job.title, job.company, ...job.skills].join(' ').toLowerCase().includes(normalizedKeyword);

      const matchedDistance = distanceKm <= appliedPreference.maxDistanceKm;
      const matchedVerification = !appliedOnlyVerified || job.companyInfo.isVerified;
      const matchedSchedule = !hasScheduleConflict(job);

      if (!matchedKeyword || !matchedDistance || !matchedVerification || !matchedSchedule) {
        return [];
      }

      return [
        {
          job,
          score: calculateMatchScore(job, appliedPreference),
          distanceKm,
        },
      ];
    });

    return filtered.sort((a, b) => {
      if (appliedSortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      }

      if (appliedSortBy === 'latest') {
        return parseDaysFromPostedDate(a.job.postedDate) - parseDaysFromPostedDate(b.job.postedDate);
      }

      return b.score - a.score;
    });
  }, [appliedKeyword, appliedOnlyVerified, appliedPreference, appliedSortBy]);

  const totalPages = Math.ceil(matchedJobs.length / JOBS_PER_PAGE);

  const pagedJobs = useMemo(
    () => matchedJobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE),
    [matchedJobs, currentPage],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedKeyword, appliedOnlyVerified, appliedPreference, appliedSortBy]);

  const togglePreferenceSlot = (slot: TimeSlot) => {
    setPreference((currentPreference) => {
      const currentSlots = currentPreference.classSchedule;
      const updatedSlots = currentSlots.includes(slot)
        ? currentSlots.filter((item) => item !== slot)
        : [...currentSlots, slot];

      return {
        ...currentPreference,
        classSchedule: updatedSlots,
      };
    });
  };

  const mergeSlots = (slots: TimeSlot[]) => {
    setPreference((currentPreference) => {
      const currentSlots = currentPreference.classSchedule;
      const allOn = slots.length > 0 && slots.every((s) => currentSlots.includes(s));
      const updatedSlots = allOn ? currentSlots.filter((s) => !slots.includes(s)) : [...new Set([...currentSlots, ...slots])];
      return {...currentPreference, classSchedule: updatedSlots};
    });
  };

  const toggleEntireRow = (time: TimeOfDay) => {
    const slots = DAYS_OF_WEEK.map(({key}) => `${time} ${key}` as TimeSlot);
    mergeSlots(slots);
  };

  const toggleEntireColumn = (day: DayOfWeek) => {
    const slots = TIMES_OF_DAY.map(({key}) => `${key} ${day}` as TimeSlot);
    mergeSlots(slots);
  };

  const toggleEntireGrid = () => {
    mergeSlots([...TIME_SLOT_OPTIONS]);
  };

  const handleHomeCoordsChange = (coords: LocationCoordinates) => {
    setPreference((currentPreference) => ({...currentPreference, homeCoords: coords}));
  };

  const handleSavePreference = () => {
    saveStudentPreference(preference);
    setSaveMessage('Đã lưu lịch học và địa chỉ của bạn.');
  };

  const applyFilters = () => {
    setAppliedKeyword(keyword);
    setAppliedOnlyVerified(onlyVerified);
    setAppliedSortBy(sortBy);
    setAppliedPreference(preference);
  };

  const handleApplyFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyFilters();
  };

  useEffect(() => {
    if (!saveMessage) return;
    const timer = setTimeout(() => setSaveMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [saveMessage]);

  useEffect(() => {
    const query = preference.homeAddress.trim();
    if (query.length < 5) {
      setGeocodeError('');
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsGeocoding(true);
      setGeocodeError('');

      try {
        const coords = await geocodeAddress(query, controller.signal);
        if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) {
          setGeocodeError('Không tìm thấy địa chỉ phù hợp.');
          return;
        }
        setPreference((currentPreference) => ({...currentPreference, homeCoords: coords}));
      } catch (error) {
        if (!controller.signal.aborted) {
          setGeocodeError('Không thể tra cứu địa chỉ.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsGeocoding(false);
        }
      }
    }, 700);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [preference.homeAddress]);

  return (
    <div className="bg-surface-container-lowest px-4 py-8 sm:px-6 lg:py-10">
      <main className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface sm:text-4xl">Việc làm</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-on-surface-variant">
            Tìm kiếm cơ hội phù hợp với lịch học, địa điểm và tiêu chí doanh nghiệp của bạn.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <aside className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm lg:sticky lg:top-28">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-sm font-headline font-extrabold text-on-surface">
                <SlidersHorizontal size={16} className="text-primary" />
                Bộ lọc phù hợp
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-black text-primary">{matchedJobs.length}</span>
            </div>

            {saveMessage && <p className="mb-4 rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">{saveMessage}</p>}

            <div className="space-y-4">
              <label className="block space-y-2 pt-5">
                <span className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Địa chỉ hiện tại</span>
                <input
                  value={preference.homeAddress}
                  onChange={(event) => setPreference((current) => ({...current, homeAddress: event.target.value}))}
                  className="min-h-[44px] w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-sm font-medium outline-none transition-all focus:border-primary/40"
                  placeholder="KTX B5 - ĐHBK Hà Nội"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-on-surface-variant">
                  <span>
                    {preference.homeCoords.lat.toFixed(5)}, {preference.homeCoords.lng.toFixed(5)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMapPickerVisible(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-outline-variant/20 px-3 py-1 text-[11px] font-bold text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    <MapPin size={12} /> Chọn trên bản đồ
                  </button>
                </div>
              </label>

              <label className="space-y-2">
                <span className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wider text-on-surface-variant">
                  Khoảng cách
                  <span className="rounded-full bg-secondary/10 px-2 py-1 text-secondary">{preference.maxDistanceKm} km</span>
                </span>
                <input
                  type="range"
                  min={2}
                  max={30}
                  value={preference.maxDistanceKm}
                  style={{'--distance-progress': `${((preference.maxDistanceKm - 2) / 28) * 100}%`} as React.CSSProperties}
                  onChange={(event) =>
                    setPreference((current) => ({
                      ...current,
                      maxDistanceKm: Number(event.target.value),
                    }))
                  }
                  className="distance-range w-full"
                />
              </label>

              <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-outline-variant/20 px-3 py-3 text-sm font-bold text-on-surface">
                <span>Doanh nghiệp đã xác thực</span>
                <input type="checkbox" checked={onlyVerified} onChange={(event) => setOnlyVerified(event.target.checked)} className="rounded border-outline-variant" />
              </label>

            </div>

            <div className="mt-5 border-t border-outline-variant/10 pt-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-headline font-extrabold text-on-surface">Lịch học</h2>
                  <p className="mt-1 text-xs font-medium text-on-surface-variant">{preference.classSchedule.length} khung giờ đã chọn</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWeekScheduleGridVisible((prev) => !prev)}
                  className="rounded-lg border border-outline-variant/20 px-3 py-2 text-xs font-bold text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary"
                >
                  Sửa
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={handleSavePreference}
                className="flex min-h-[40px] w-full items-center justify-center rounded-xl border border-outline-variant/20 px-4 py-2 text-sm font-bold text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary"
              >
                Lưu thông tin
              </button>
              <button
                type="button"
                onClick={applyFilters}
                className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </aside>

          <section className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm sm:p-5 md:p-6">
            <div className="mb-5 space-y-4 border-b border-outline-variant/10 pb-5">
              <div>
                <h2 className="whitespace-nowrap text-xl font-headline font-extrabold text-on-surface">Danh sách công việc</h2>
                <p className="mt-1 whitespace-nowrap text-sm font-medium text-on-surface-variant">{matchedJobs.length} công việc phù hợp</p>
              </div>

              <form onSubmit={handleApplyFilters} className="flex w-full flex-col gap-3 md:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest py-2 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-primary/40"
                    placeholder="Vị trí, công ty, kỹ năng..."
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  aria-label="Sắp xếp theo"
                  className="min-h-[44px] rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-sm font-semibold md:w-36"
                >
                  <option value="match">Độ phù hợp</option>
                  <option value="distance">Gần nhất</option>
                  <option value="latest">Mới nhất</option>
                </select>
                <button
                  type="submit"
                  className="min-h-[44px] rounded-xl bg-primary px-5 py-2 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
                >
                  Tìm kiếm
                </button>
              </form>
            </div>

          <div className="grid gap-4">
            {matchedJobs.length === 0 && (
              <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 text-center text-sm font-semibold text-on-surface-variant">
                Không có công việc nào khớp bộ lọc hiện tại. Thử mở rộng khoảng cách, nới lỏng địa điểm hoặc điều chỉnh lịch học.
              </div>
            )}

            {pagedJobs.map(({job, score, distanceKm}) => {
              const averageRating = job.reviews.length === 0 ? 0 : job.reviews.reduce((sum, review) => sum + review.rating, 0) / job.reviews.length;

              return (
                <article
                  key={job.id}
                  className="group relative rounded-2xl border border-outline-variant/10 bg-surface-container-lowest shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
                >
                  <Link
                    to={`/job/${job.id}`}
                    className="absolute inset-0 z-0 rounded-2xl outline-none ring-inset focus-visible:ring-2 focus-visible:ring-primary/50"
                    aria-label={`Xem chi tiết: ${job.title} tại ${job.company}`}
                  />
                  <button
                    type="button"
                    aria-label="Lưu việc làm"
                    onClick={() => setSavedJobIds(toggleSavedJob(job.id))}
                    className={`absolute right-5 top-5 z-20 rounded-full p-2 transition-colors hover:bg-surface-container-low ${savedJobIds.includes(job.id) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    <Bookmark size={18} className={savedJobIds.includes(job.id) ? 'fill-primary' : ''} />
                  </button>

                  <div className="pointer-events-none relative z-10 flex flex-col gap-4 p-5 md:flex-row md:items-start">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low">
                      <img src={job.companyLogo} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-headline font-bold text-on-surface transition-colors group-hover:text-primary">{job.title}</h2>
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary">{score}% phù hợp</span>
                        {job.isHot && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-orange-600">
                            <Flame size={10} /> Hot
                          </span>
                        )}
                        {isDeadlineExpired(job.applicationDeadline) && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2 py-1 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                            <Clock size={10} /> Đã hết hạn
                          </span>
                        )}
                      </div>

                      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                        <p className="font-semibold text-on-surface-variant">{job.company}</p>
                        {job.companyInfo.isVerified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-secondary">
                            <CheckCircle size={12} /> Đã xác thực
                          </span>
                        ) : (
                          <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-on-surface-variant">
                            Chưa xác thực
                          </span>
                        )}
                      </div>

                      <div className="mb-3 flex flex-wrap gap-4 text-xs font-semibold text-on-surface-variant">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} className="shrink-0 text-primary" />
                          {job.location} · {distanceKm.toFixed(1)} km
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase size={14} className="shrink-0 text-primary" />
                          {job.type}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <DollarSign size={14} className="shrink-0 text-secondary" />
                          {job.salary}
                        </span>
                      </div>

                      <div className="mb-3 flex flex-wrap gap-2">
                        {job.workSlots.slice(0, 4).map((slot) => (
                          <span key={`${job.id}-${slot}`} className="rounded-lg border border-outline-variant/10 bg-surface-container-low px-2 py-1 text-[11px] font-semibold text-on-surface-variant">
                            {slot}
                          </span>
                        ))}
                      </div>

                      <p className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary">
                        <Star size={14} className="shrink-0 fill-secondary/20" />
                        {averageRating.toFixed(1)} / 5 · {job.reviews.length} phản hồi từ sinh viên
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước
              </button>
              {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-xl text-sm font-bold transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-on-primary shadow-sm shadow-primary/30'
                      : 'border border-outline-variant/20 bg-surface-container-lowest text-on-surface-variant hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          )}
          </section>
        </div>

        {isWeekScheduleGridVisible && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-outline-variant/10 px-5 py-4">
                <div>
                  <h2 className="text-lg font-headline font-extrabold text-on-surface">Chọn lịch học</h2>
                  <p className="mt-1 text-sm font-medium text-on-surface-variant">{preference.classSchedule.length} khung giờ đã chọn</p>
                </div>
                <button
                  type="button"
                  aria-label="Đóng chọn lịch học"
                  onClick={() => setIsWeekScheduleGridVisible(false)}
                  className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-4">
                <WeekScheduleGrid
                  title="Lịch học của bạn"
                  selectedSlots={preference.classSchedule}
                  onToggle={togglePreferenceSlot}
                  onToggleEntireRow={toggleEntireRow}
                  onToggleEntireColumn={toggleEntireColumn}
                  onToggleEntireGrid={toggleEntireGrid}
                  tone="secondary"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/10 px-5 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsWeekScheduleGridVisible(false)}
                  className="min-h-[42px] rounded-xl border border-outline-variant/20 px-4 py-2 text-sm font-bold text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyFilters();
                    setIsWeekScheduleGridVisible(false);
                  }}
                  className="min-h-[42px] rounded-xl bg-primary px-5 py-2 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
                >
                  Áp dụng lịch học
                </button>
              </div>
            </div>
          </div>
        )}

        {isMapPickerVisible && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 px-4 py-6 backdrop-blur-sm">
            <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-outline-variant/10 px-5 py-4">
                <div>
                  <h2 className="text-lg font-headline font-extrabold text-on-surface">Chọn vị trí trên bản đồ</h2>
                  <p className="mt-1 text-sm font-medium text-on-surface-variant">
                    Chạm vào bản đồ để cập nhật tọa độ dùng cho tính khoảng cách.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Đóng chọn vị trí"
                  onClick={() => setIsMapPickerVisible(false)}
                  className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto px-5 py-4">
                <label className="mb-4 block space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Địa chỉ</span>
                  <input
                    value={preference.homeAddress}
                    onChange={(event) => setPreference((current) => ({...current, homeAddress: event.target.value}))}
                    className="min-h-[44px] w-full rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-sm font-medium outline-none transition-all focus:border-primary/40"
                    placeholder="Nhập địa chỉ để lưu lại"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-on-surface-variant" aria-live="polite">
                    <span>
                      {isGeocoding
                        ? 'Đang tìm vị trí từ địa chỉ...'
                        : geocodeError || 'Nhập địa chỉ để tự động cập nhật tọa độ.'}
                    </span>
                  </div>
                </label>
                <MapPicker
                  value={preference.homeCoords}
                  onChange={handleHomeCoordsChange}
                  className="h-[360px] w-full rounded-2xl"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-on-surface-variant">
                  <span>
                    {preference.homeCoords.lat.toFixed(5)}, {preference.homeCoords.lng.toFixed(5)}
                  </span>
                  <span>Khoảng cách sẽ được tính từ vị trí này.</span>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/10 px-5 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsMapPickerVisible(false)}
                  className="min-h-[42px] rounded-xl border border-outline-variant/20 px-4 py-2 text-sm font-bold text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyFilters();
                    setIsMapPickerVisible(false);
                  }}
                  className="min-h-[42px] rounded-xl bg-primary px-5 py-2 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
                >
                  Áp dụng vị trí
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
