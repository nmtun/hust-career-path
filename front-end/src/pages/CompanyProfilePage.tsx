import Sidebar from '@/components/layout/Sidebar';
import {MOCK_JOBS} from '@/data/mockData';
import {ArrowRight, Building2, CalendarClock, CheckCircle, CircleAlert, Globe, MapPin, ShieldCheck, Star, User} from 'lucide-react';
import {Link, useParams} from 'react-router-dom';

function formatCompanyParam(value?: string) {
  if (!value) {
    return '';
  }

  try {
    return decodeURIComponent(value).toLowerCase();
  } catch {
    return value.toLowerCase();
  }
}

export default function CompanyProfilePage() {
  const {companyName} = useParams();
  const normalizedCompanyName = formatCompanyParam(companyName);

  const companyJobs = MOCK_JOBS.filter((job) => {
    return [job.company, job.companyInfo.name].some((name) => name.toLowerCase() === normalizedCompanyName);
  });

  if (companyJobs.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-3xl font-headline font-extrabold text-on-surface">Khong tim thay doanh nghiep</h1>
        <p className="mt-3 text-sm font-medium text-on-surface-variant">Duong dan doanh nghiep khong hop le hoac du lieu chua duoc cap nhat.</p>
        <Link to="/jobs" className="mt-8 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary">
          Quay lai danh sach viec lam
        </Link>
      </div>
    );
  }

  const company = companyJobs[0].companyInfo;
  const averageRating =
    companyJobs.reduce((sum, job) => sum + (job.reviews.length === 0 ? 0 : job.reviews.reduce((acc, review) => acc + review.rating, 0) / job.reviews.length), 0) /
    companyJobs.length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10 lg:flex-row">
      <Sidebar />
      <main className="flex-1 space-y-8">
        <header className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-5">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low">
                <img src={company.logo} alt={company.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">{company.name}</h1>
                <p className="mt-2 text-sm font-semibold text-on-surface-variant">Trang thong tin doanh nghiep va cac job dang tuyen</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {company.isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-secondary">
                      <ShieldCheck size={14} /> Da xac thuc
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-700">
                      <CircleAlert size={14} /> Chua xac thuc
                    </span>
                  )}
                  <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs font-black uppercase tracking-wider text-on-surface-variant">
                    Dang tuyen {companyJobs.length} vi tri
                  </span>
                </div>
              </div>
            </div>

            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-outline-variant/20 bg-surface px-5 py-3 text-sm font-bold text-on-surface transition-all hover:border-primary/40 hover:text-primary"
            >
              <Globe size={16} className="mr-2" />
              Website doanh nghiep
            </a>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Linh vuc</p>
            <p className="mt-2 text-sm font-bold text-on-surface">{company.industry}</p>
          </article>
          <article className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Quy mo</p>
            <p className="mt-2 text-sm font-bold text-on-surface">{company.companySize}</p>
          </article>
          <article className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Danh gia trung binh</p>
            <p className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-secondary">
              <Star size={14} className="fill-secondary/20" /> {averageRating.toFixed(1)} / 5
            </p>
          </article>
          <article className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Don vi xac thuc</p>
            <p className="mt-2 text-sm font-bold text-on-surface">{company.verifiedBy}</p>
          </article>
        </section>

        <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-headline font-bold text-on-surface">Thong tin doanh nghiep</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <p className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-3 text-sm font-medium text-on-surface-variant">
              <Building2 size={16} className="text-primary" /> {company.industry}
            </p>
            <p className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-3 text-sm font-medium text-on-surface-variant">
              <User size={16} className="text-primary" /> {company.companySize}
            </p>
            <p className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-3 text-sm font-medium text-on-surface-variant md:col-span-2">
              <MapPin size={16} className="text-primary" /> {company.address}
            </p>
            <p className="inline-flex items-center gap-2 rounded-xl bg-surface px-4 py-3 text-sm font-medium text-on-surface-variant md:col-span-2">
              <CalendarClock size={16} className="text-primary" />
              Trang thai xac thuc: {company.isVerified ? `Da xac thuc ngay ${company.verifiedAt}` : 'Dang cho xac thuc'}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold text-on-surface">Cac job dang tuyen</h2>
            <p className="inline-flex items-center gap-1 text-sm font-semibold text-on-surface-variant">
              <CheckCircle size={14} className="text-secondary" /> {companyJobs.length} vi tri dang mo
            </p>
          </div>

          <div className="grid gap-4">
            {companyJobs.map((job) => (
              <article key={job.id} className="rounded-2xl border border-outline-variant/10 bg-surface p-5 transition-all hover:border-primary/30">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-xl font-headline font-bold text-on-surface">{job.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-on-surface-variant">{job.type} • {job.location}</p>
                    <p className="mt-1 text-sm font-bold text-secondary">{job.salary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span key={`${job.id}-${skill}`} className="rounded-lg bg-surface-container-low px-2 py-1 text-[11px] font-semibold text-on-surface-variant">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/job/${job.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90"
                  >
                    Xem chi tiet <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
