import Sidebar from '@/components/layout/Sidebar';
import {MOCK_JOBS} from '@/data/mockData';
import {getSavedJobIds, toggleSavedJob} from '@/utils/savedJobs';
import {ArrowRight, Bookmark, Building2, CheckCircle, CircleAlert, Clock, FileText, Flame, Globe, MapPin, ShieldCheck, Star, User} from 'lucide-react';
import {Link, useParams} from 'react-router-dom';
import {useState} from 'react';

function isDeadlineExpired(deadline: string): boolean {
  const parts = deadline.split('/');
  if (parts.length !== 3) return false;
  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day) < new Date(new Date().setHours(0, 0, 0, 0));
}

export default function JobDetailPage() {
  const {id} = useParams();
  const job = MOCK_JOBS.find((item) => item.id === id);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => getSavedJobIds());

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="mb-4 text-3xl font-headline font-extrabold text-on-surface">Không tìm thấy công việc</h1>
        <p className="mb-8 text-on-surface-variant">Vị trí bạn chọn không tồn tại hoặc đã được gỡ khỏi hệ thống.</p>
        <Link to="/jobs" className="inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-opacity hover:opacity-90">
          Quay lại danh sách việc làm
        </Link>
      </div>
    );
  }

  const companyPath = `/company/${encodeURIComponent(job.companyInfo.name)}`;

  const averageRating = job.reviews.length === 0 ? 0 : job.reviews.reduce((sum, review) => sum + review.rating, 0) / job.reviews.length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 lg:flex-row">
      <Sidebar />
      <main className="flex-1 space-y-8">
        <header className="relative overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-sm md:p-10">
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low shadow-sm">
                <img src={job.companyLogo} alt={job.company} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">{job.title}</h1>
                <Link to={companyPath} className="mt-1 inline-block text-base font-bold text-secondary hover:underline">
                  {job.company}
                </Link>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold">
                  {job.companyInfo.isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-secondary">
                      <ShieldCheck size={14} /> Doanh nghiệp đã xác thực
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-orange-700">
                      <CircleAlert size={14} /> Doanh nghiệp chưa xác thực
                    </span>
                  )}
                  {job.isHot && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-orange-600">
                      <Flame size={14} /> Hot
                    </span>
                  )}
                  {isDeadlineExpired(job.applicationDeadline) ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1 text-on-surface-variant">
                      <Clock size={14} /> Đã hết hạn ({job.applicationDeadline})
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-container-high px-3 py-1 text-on-surface-variant">Hạn nộp: {job.applicationDeadline}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3 sm:w-auto">
              <button
                type="button"
                onClick={() => setSavedJobIds(toggleSavedJob(job.id))}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-bold transition-colors sm:flex-none ${savedJobIds.includes(job.id) ? 'border-primary/40 bg-primary/10 text-primary' : 'border-outline-variant/30 bg-surface hover:bg-surface-container-low'}`}
              >
                <Bookmark size={16} className={savedJobIds.includes(job.id) ? 'fill-primary' : ''} />
                {savedJobIds.includes(job.id) ? 'Đã lưu' : 'Lưu việc làm'}
              </button>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90 sm:flex-none"
              >
                Ứng tuyển ngay <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </header>

        {!job.companyInfo.isVerified && (
          <section className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-sm font-semibold text-orange-800">
            Tin tuyển dụng này chưa được xác thực bởi hệ thống. Bạn nên ưu tiên các tin đã xác thực trước khi ứng tuyển.
          </section>
        )}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-2">
            <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-2xl font-headline font-bold text-on-surface">
                <FileText className="text-primary" /> Thông tin tuyển dụng
              </h2>
              <p className="mb-5 leading-relaxed text-on-surface-variant">{job.description}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-surface-container-low p-4 text-sm">
                  <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Địa điểm</p>
                  <p className="mt-2 font-bold text-on-surface">{job.location}</p>
                </div>
                <div className="rounded-xl bg-surface-container-low p-4 text-sm">
                  <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Mức lương</p>
                  <p className="mt-2 font-bold text-on-surface">{job.salary}</p>
                </div>
                <div className="rounded-xl bg-surface-container-low p-4 text-sm">
                  <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Khoảng cách ước tính</p>
                  <p className="mt-2 font-bold text-on-surface">{job.distanceKm} km</p>
                </div>
                <div className="rounded-xl bg-surface-container-low p-4 text-sm">
                  <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Khung giờ làm việc</p>
                  <p className="mt-2 font-bold text-on-surface">{job.workSlots.join(', ')}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-headline font-bold">Yêu cầu</h3>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    {job.requirements.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle size={16} className="mt-0.5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-headline font-bold">Công việc sẽ thực hiện</h3>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    {job.responsibilities.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle size={16} className="mt-0.5 shrink-0 text-secondary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-5 text-2xl font-headline font-bold text-on-surface">Quyền lợi và quy trình tuyển dụng</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-headline font-bold">Quyền lợi</h3>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    {job.benefits.map((item) => (
                      <li key={item} className="rounded-lg bg-surface-container-low px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-headline font-bold">Các bước tuyển dụng</h3>
                  <ol className="space-y-2 text-sm text-on-surface-variant">
                    {job.hiringSteps.map((step, index) => (
                      <li key={step} className="rounded-lg border border-outline-variant/15 bg-surface px-3 py-2 font-medium">
                        Bước {index + 1}: {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-sm">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-headline font-bold text-on-surface">Phản hồi từ người dùng</h2>
                <p className="inline-flex items-center gap-1 text-sm font-bold text-secondary">
                  <Star size={15} className="fill-secondary/20" />
                  {averageRating.toFixed(1)} / 5 ({job.reviews.length} đánh giá)
                </p>
              </div>

              <div className="space-y-4">
                {job.reviews.map((review) => (
                  <article key={review.id} className="rounded-2xl border border-outline-variant/10 bg-surface p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
                      <p className="font-bold text-on-surface">{review.userName}</p>
                      <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-on-surface-variant">
                        {review.major}
                      </span>
                      <span className="text-xs font-semibold text-on-surface-variant">{review.createdAt}</span>
                    </div>
                    <p className="mb-2 text-sm font-semibold text-secondary">Đánh giá: {review.rating}/5</p>
                    <p className="text-sm leading-relaxed text-on-surface-variant">{review.comment}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-low p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-headline font-bold text-on-surface">Thông tin doanh nghiệp</h3>

              <div className="mb-4 flex items-center gap-3">
                <div className="h-14 w-14 overflow-hidden rounded-xl border border-outline-variant/10 bg-surface">
                  <img src={job.companyInfo.logo} alt={job.companyInfo.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="font-bold text-on-surface">{job.companyInfo.name}</p>
                  {job.companyInfo.isVerified ? (
                    <p className="text-xs font-bold text-secondary">Đã xác thực ngày {job.companyInfo.verifiedAt}</p>
                  ) : (
                    <p className="text-xs font-bold text-orange-700">Đang chờ xác thực</p>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-sm font-medium text-on-surface-variant">
                <p className="inline-flex items-center gap-2">
                  <Building2 size={16} /> {job.companyInfo.industry}
                </p>
                <p className="inline-flex items-center gap-2">
                  <User size={16} /> {job.companyInfo.companySize}
                </p>
                <p className="inline-flex items-center gap-2">
                  <MapPin size={16} /> {job.companyInfo.address}
                </p>
                <p className="inline-flex items-center gap-2 break-all">
                  <Globe size={16} /> {job.companyInfo.website}
                </p>
                <p className="rounded-xl bg-surface px-3 py-2 text-xs font-semibold">Đơn vị xác thực: {job.companyInfo.verifiedBy}</p>
                <Link to={companyPath} className="inline-flex text-xs font-bold text-secondary hover:underline">
                  Xem trang doanh nghiệp và các vị trí đang tuyển
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
