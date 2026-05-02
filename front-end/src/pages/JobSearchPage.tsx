import Sidebar from '@/components/layout/Sidebar';
import WeekScheduleGrid from '@/components/WeekScheduleGrid';
import {MOCK_JOBS} from '@/data/mockData';
import type {Job, StudentPreference, TimeSlot} from '@/types/models';
import {getStoredStudentPreference, saveStudentPreference} from '@/utils/userPreference';
import {getSavedJobIds, toggleSavedJob} from '@/utils/savedJobs';
import {Bookmark, Briefcase, CheckCircle, Clock, DollarSign, Flame, MapPin, Search, SlidersHorizontal, Star} from 'lucide-react';
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
  const usingFreeTime = preference.freeTime.length > 0;

  const scheduleScore = usingFreeTime
    ? job.workSlots.filter((slot) => preference.freeTime.includes(slot)).length * 10
    : -job.workSlots.filter((slot) => preference.classSchedule.includes(slot)).length * 10;

  const score = 70 + scheduleScore + (job.companyInfo.isVerified ? 8 : -12);

  return Math.max(0, Math.min(100, Math.round(score)));
}


export default function JobSearchPage() {
  const [searchParams] = useSearchParams();
  const [preference, setPreference] = useState<StudentPreference>(() => getStoredStudentPreference());
  const [keyword, setKeyword] = useState(() => searchParams.get('q') ?? '');
  const [onlyVerified, setOnlyVerified] = useState(true);

  useEffect(() => {
    setKeyword(searchParams.get('q') ?? '');
  }, [searchParams]);
  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [currentPage, setCurrentPage] = useState(1);
  const [saveMessage, setSaveMessage] = useState('');
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => getSavedJobIds());
  const [activeScheduleTab, setActiveScheduleTab] = useState<'classSchedule' | 'freeTime'>('classSchedule');

  const matchedJobs = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    const filtered = MOCK_JOBS.filter((job) => {
      const matchedKeyword =
        normalizedKeyword.length === 0 ||
        [job.title, job.company, ...job.skills].join(' ').toLowerCase().includes(normalizedKeyword);

      const matchedDistance = job.distanceKm <= preference.maxDistanceKm;
      const matchedFreeTime = preference.freeTime.length === 0 || job.workSlots.some((slot) => preference.freeTime.includes(slot));
      const matchedVerification = !onlyVerified || job.companyInfo.isVerified;

      return matchedKeyword && matchedDistance && matchedFreeTime && matchedVerification;
    }).map((job) => ({
      job,
      score: calculateMatchScore(job, preference),
    }));

    return filtered.sort((a, b) => {
      if (sortBy === 'distance') {
        return a.job.distanceKm - b.job.distanceKm;
      }

      if (sortBy === 'latest') {
        return parseDaysFromPostedDate(a.job.postedDate) - parseDaysFromPostedDate(b.job.postedDate);
      }

      return b.score - a.score;
    });
  }, [keyword, onlyVerified, preference, sortBy]);

  const totalPages = Math.ceil(matchedJobs.length / JOBS_PER_PAGE);

  const pagedJobs = useMemo(
    () => matchedJobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE),
    [matchedJobs, currentPage],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, onlyVerified, preference, sortBy]);

  const verifiedCount = MOCK_JOBS.filter((job) => job.companyInfo.isVerified).length;

  const togglePreferenceSlot = (slotType: 'classSchedule' | 'freeTime', slot: TimeSlot) => {
    setPreference((currentPreference) => {
      const currentSlots = currentPreference[slotType];
      const updatedSlots = currentSlots.includes(slot)
        ? currentSlots.filter((item) => item !== slot)
        : [...currentSlots, slot];

      return {
        ...currentPreference,
        [slotType]: updatedSlots,
      };
    });
  };

  const handleSavePreference = () => {
    saveStudentPreference(preference);
    setSaveMessage('Da luu thong tin lich hoc, lich ranh va dia chi cua ban vao he thong.');
  };

  useEffect(() => {
    if (!saveMessage) return;
    const timer = setTimeout(() => setSaveMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [saveMessage]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 lg:flex-row">
      <Sidebar />
      <main className="flex-1 space-y-8">
        <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">Bo loc viec lam phu hop cho sinh vien</h1>
              <p className="mt-2 text-sm font-medium text-on-surface-variant">
                Loc cong viec theo lich hoc, thoi gian ranh, khoang cach di chuyen va uu tien doanh nghiep da xac thuc.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSavePreference}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90"
            >
              <SlidersHorizontal size={16} className="mr-2" />
              Luu thong tin ca nhan
            </button>
          </div>

          {saveMessage && <p className="mb-6 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">{saveMessage}</p>}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Dia chi cua ban</span>
              <input
                value={preference.homeAddress}
                onChange={(event) => setPreference((current) => ({...current, homeAddress: event.target.value}))}
                className="w-full rounded-xl border border-outline-variant/20 bg-surface px-4 py-3 text-sm font-medium outline-none transition-all focus:border-primary/40"
                placeholder="Vi du: KTX B5 - Dai hoc Bach Khoa Ha Noi"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Khoang cach di chuyen toi da (km)</span>
              <div className="rounded-xl border border-outline-variant/20 bg-surface px-4 py-3">
                <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                  <span className="text-on-surface">Muc da chon</span>
                  <span className="text-secondary">{preference.maxDistanceKm} km</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={30}
                  value={preference.maxDistanceKm}
                  onChange={(event) => setPreference((current) => ({...current, maxDistanceKm: Number(event.target.value)}))}
                  className="w-full"
                />
              </div>
            </label>
          </div>

          <div className="mt-6 space-y-4">
            <div className="inline-flex rounded-2xl border border-outline-variant/20 bg-surface-container-low p-1">
              <button
                type="button"
                onClick={() => setActiveScheduleTab('classSchedule')}
                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all ${
                  activeScheduleTab === 'classSchedule'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Lịch học
              </button>
              <button
                type="button"
                onClick={() => setActiveScheduleTab('freeTime')}
                className={`rounded-xl px-5 py-2 text-sm font-bold transition-all ${
                  activeScheduleTab === 'freeTime'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Thời gian rảnh
              </button>
            </div>

            {activeScheduleTab === 'classSchedule' ? (
              <WeekScheduleGrid
                title="Lịch học của bạn"
                selectedSlots={preference.classSchedule}
                onToggle={(slot) => togglePreferenceSlot('classSchedule', slot)}
                tone="secondary"
              />
            ) : (
              <WeekScheduleGrid
                title="Thời gian rảnh"
                selectedSlots={preference.freeTime}
                onToggle={(slot) => togglePreferenceSlot('freeTime', slot)}
                tone="primary"
              />
            )}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Doanh nghiep da xac thuc</p>
            <p className="mt-2 text-2xl font-headline font-extrabold text-on-surface">{verifiedCount}</p>
          </div>
          <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Cong viec phu hop</p>
            <p className="mt-2 text-2xl font-headline font-extrabold text-on-surface">{matchedJobs.length}</p>
            {totalPages > 1 && (
              <p className="mt-0.5 text-xs font-semibold text-on-surface-variant">
                Trang {currentPage}/{totalPages}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Dia chi hien tai</p>
            <p className="mt-2 text-sm font-bold text-on-surface">{preference.homeAddress}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-lg">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                className="w-full rounded-xl border border-outline-variant/20 bg-surface py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all focus:border-primary/40"
                placeholder="Tim theo vi tri, cong ty, ky nang..."
              />
            </div>

            <div className="flex gap-3">
              <label className="inline-flex items-center gap-2 rounded-xl border border-outline-variant/20 bg-surface px-3 text-xs font-bold uppercase tracking-wide text-on-surface-variant">
                <input type="checkbox" checked={onlyVerified} onChange={(event) => setOnlyVerified(event.target.checked)} />
                Chi lay doanh nghiep da xac thuc
              </label>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                aria-label="Sắp xếp theo"
                className="rounded-xl border border-outline-variant/20 bg-surface px-4 py-2 text-sm font-semibold"
              >
                <option value="match">Sap xep: Do phu hop</option>
                <option value="distance">Sap xep: Gan nhat</option>
                <option value="latest">Sap xep: Moi nhat</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4">
            {matchedJobs.length === 0 && (
              <div className="rounded-2xl border border-outline-variant/20 bg-surface p-8 text-center text-sm font-semibold text-on-surface-variant">
                Khong co cong viec nao trung voi bo loc hien tai. Thu mo rong khoang cach hoac bo sung khung gio ranh.
              </div>
            )}

            {pagedJobs.map(({job, score}) => {
              const averageRating = job.reviews.length === 0 ? 0 : job.reviews.reduce((sum, review) => sum + review.rating, 0) / job.reviews.length;

              return (
                <Link key={job.id} to={`/job/${job.id}`} className="group block">
                  <article className="relative rounded-2xl border border-outline-variant/10 bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
                    <button
                      aria-label="Lưu việc làm"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSavedJobIds(toggleSavedJob(job.id)); }}
                      className={`absolute right-5 top-5 rounded-full p-2 transition-colors hover:bg-surface-container-low ${savedJobIds.includes(job.id) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                      <Bookmark size={18} className={savedJobIds.includes(job.id) ? 'fill-primary' : ''} />
                    </button>

                    <div className="flex flex-col gap-4 md:flex-row md:items-start">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low">
                        <img src={job.companyLogo} alt={job.company} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      </div>

                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-headline font-bold text-on-surface transition-colors group-hover:text-primary">{job.title}</h2>
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary">{score}% Match</span>
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
                              <CheckCircle size={12} /> Da xac thuc
                            </span>
                          ) : (
                            <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-on-surface-variant">
                              Chua xac thuc
                            </span>
                          )}
                        </div>

                        <div className="mb-3 flex flex-wrap gap-4 text-xs font-semibold text-on-surface-variant">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={14} className="text-primary" />
                            {job.location} • {job.distanceKm} km
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Briefcase size={14} className="text-primary" />
                            {job.type}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <DollarSign size={14} className="text-secondary" />
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
                          <Star size={14} className="fill-secondary/20" />
                          {averageRating.toFixed(1)} / 5 • {job.reviews.length} phan hoi tu sinh vien
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl border border-outline-variant/20 bg-surface px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
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
                      : 'border border-outline-variant/20 bg-surface text-on-surface-variant hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-outline-variant/20 bg-surface px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
