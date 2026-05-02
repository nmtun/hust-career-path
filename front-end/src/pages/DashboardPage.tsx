import Sidebar from '@/components/layout/Sidebar';
import {MOCK_APPLICATIONS} from '@/data/mockData';
import type {Application} from '@/types/models';
import {ArrowUpRight, Download, Eye, FileText, Sparkles, Upload, Verified} from 'lucide-react';

const SKILLS = ['C/C++', 'Python', 'Machine Learning', 'Verilog', 'RTOS', 'Git'];

function applicationStatusClass(status: Application['status']) {
  if (status === 'Accepted') return 'bg-green-100 text-green-800';
  if (status === 'Pending') return 'bg-blue-100 text-blue-800';
  if (status === 'Applied') return 'bg-amber-100 text-amber-900';
  return 'bg-surface-container-high text-on-surface-variant';
}

function applicationStatusLabel(status: Application['status']) {
  if (status === 'Accepted') return 'Đã nhận';
  if (status === 'Pending') return 'Đang xử lý';
  if (status === 'Applied') return 'Đã nộp hồ sơ';
  return status;
}

export default function DashboardPage() {
  const totalApplications = MOCK_APPLICATIONS.length;
  const acceptedCount = MOCK_APPLICATIONS.filter((app) => app.status === 'Accepted').length;
  const pendingCount = MOCK_APPLICATIONS.filter((app) => app.status === 'Pending').length;
  const responseRate = totalApplications === 0 ? 0 : Math.round(((acceptedCount + pendingCount) / totalApplications) * 100);
  const profileCompletion = 82;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:gap-10 lg:py-10">
      <Sidebar />
      <main className="flex-1 space-y-8">
        <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop"
                  alt="Ảnh đại diện sinh viên"
                  className="h-16 w-16 rounded-2xl object-cover sm:h-20 sm:w-20"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 rounded-full bg-secondary p-1 text-on-secondary">
                  <Verified size={12} />
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-headline font-extrabold tracking-tight text-on-surface sm:text-3xl">Nguyễn Văn A</h1>
                <p className="text-sm font-medium text-on-surface-variant sm:text-base">Kỹ thuật Máy tính · GPA 3.8/4.0 · Hà Nội</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-secondary">
                  <Sparkles size={14} />
                  Hồ sơ đã hoàn thiện {profileCompletion}%
                </p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
            >
              Chỉnh sửa hồ sơ
              <ArrowUpRight size={16} />
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <article className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Tổng hồ sơ</p>
            <p className="mt-2 text-2xl font-headline font-extrabold text-on-surface">{totalApplications}</p>
          </article>
          <article className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Đã nhận</p>
            <p className="mt-2 text-2xl font-headline font-extrabold text-green-700">{acceptedCount}</p>
          </article>
          <article className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Đang xử lý</p>
            <p className="mt-2 text-2xl font-headline font-extrabold text-blue-700">{pendingCount}</p>
          </article>
          <article className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-on-surface-variant">Tỉ lệ phản hồi</p>
            <p className="mt-2 text-2xl font-headline font-extrabold text-secondary">{responseRate}%</p>
          </article>
        </section>

        <div className="space-y-8">
          <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-headline font-bold text-on-surface">Theo dõi ứng tuyển</h2>
              <button type="button" className="text-sm font-bold text-secondary hover:underline">
                Xem tất cả
              </button>
            </div>
            <div className="min-w-0 overflow-x-auto rounded-xl">
              <table className="w-full min-w-[520px] text-left">
                <thead>
                  <tr className="border-b border-outline-variant/10 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
                    <th className="pb-4">Công ty & Vị trí</th>
                    <th className="pb-4">Ngày nộp</th>
                    <th className="pb-4 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {MOCK_APPLICATIONS.map((app) => (
                    <tr key={app.id} className="group cursor-pointer">
                      <td className="py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-low font-headline font-bold text-primary shadow-inner">
                            {app.companyLogoInitials}
                          </div>
                          <div>
                            <div className="font-bold text-on-surface transition-colors group-hover:text-primary">{app.jobTitle}</div>
                            <div className="text-sm font-medium text-on-surface-variant">{app.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 font-mono text-sm text-on-surface-variant">{app.applyDate}</td>
                      <td className="py-6 text-right">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${applicationStatusClass(app.status)}`}>
                          {applicationStatusLabel(app.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-headline font-bold text-on-surface">Hồ sơ của tôi</h2>
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant/30 bg-surface-container-low p-6 text-center">
                <FileText className="mb-4 text-secondary" size={48} />
                <div className="mb-1 font-bold text-on-surface">NguyenVanA_CV_2023.pdf</div>
                <div className="mb-6 text-xs text-on-surface-variant">Cập nhật 2 ngày trước</div>
                <div className="flex gap-4">
                  <button type="button" aria-label="Xem CV" className="rounded-xl bg-surface-container-lowest p-3 shadow-sm transition-colors hover:text-primary">
                    <Eye size={20} />
                  </button>
                  <button type="button" aria-label="Tải CV" className="rounded-xl bg-surface-container-lowest p-3 shadow-sm transition-colors hover:text-primary">
                    <Download size={20} />
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/30 py-4 font-bold text-secondary transition-all hover:bg-secondary/5"
              >
                <Upload size={18} /> Tải lên CV mới
              </button>
            </section>

            <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-headline font-bold text-on-surface">Kỹ năng</h2>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border border-outline-variant/5 bg-surface-container-low px-3 py-1.5 text-xs font-bold text-on-surface-variant"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
