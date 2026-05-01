import Sidebar from '@/components/layout/Sidebar';
import {MOCK_APPLICATIONS} from '@/data/mockData';
import {Download, Eye, FileText, Upload, Verified} from 'lucide-react';

const SKILLS = ['C/C++', 'Python', 'Machine Learning', 'Verilog', 'RTOS', 'Git'];

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 lg:flex-row">
      <Sidebar />
      <main className="flex-1 space-y-12">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary-container p-10 text-on-primary shadow-2xl">
          <div className="absolute right-0 top-0 h-96 w-96 translate-x-1/4 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col items-center gap-8 md:flex-row">
            <div className="group relative">
              <div className="h-32 w-32 rounded-full border-4 border-on-primary/30 p-1 transition-transform group-hover:scale-105 md:h-40 md:w-40">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop"
                  alt="Avatar"
                  className="h-full w-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-2 right-2 rounded-full border-4 border-primary bg-secondary p-1.5">
                <Verified size={20} />
              </div>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h1 className="text-4xl font-headline font-black tracking-tighter md:text-6xl">Nguyễn Văn A</h1>
              <p className="text-xl font-medium opacity-90">Kỹ thuật Máy tính (Computer Engineering)</p>
              <div className="flex flex-wrap justify-center gap-4 pt-2 md:justify-start">
                <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold backdrop-blur-md">GPA: 3.8 / 4.0</span>
                <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold backdrop-blur-md">Hà Nội, VN</span>
              </div>
            </div>
            <button className="rounded-2xl bg-surface px-8 py-4 font-bold text-primary shadow-xl transition-all hover:bg-surface-container-low md:ml-auto">
              Chỉnh sửa hồ sơ
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-12 xl:grid-cols-3">
          <div className="space-y-12 xl:col-span-2">
            <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-sm">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-headline font-bold text-on-surface">Theo dõi ứng tuyển</h2>
                <button className="text-sm font-bold text-secondary hover:underline">Xem tất cả</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
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
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                              app.status === 'Accepted'
                                ? 'bg-green-100 text-green-700'
                                : app.status === 'Pending'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="space-y-12">
            <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-headline font-bold text-on-surface">Hồ sơ của tôi</h2>
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant/30 bg-surface-container-low p-6 text-center">
                <FileText className="mb-4 text-secondary" size={48} />
                <div className="mb-1 font-bold text-on-surface">NguyenVanA_CV_2023.pdf</div>
                <div className="mb-6 text-xs text-on-surface-variant">Cập nhật 2 ngày trước</div>
                <div className="flex gap-4">
                  <button aria-label="Xem CV" className="rounded-xl bg-surface-container-lowest p-3 shadow-sm transition-colors hover:text-primary">
                    <Eye size={20} />
                  </button>
                  <button aria-label="Tải CV" className="rounded-xl bg-surface-container-lowest p-3 shadow-sm transition-colors hover:text-primary">
                    <Download size={20} />
                  </button>
                </div>
              </div>
              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/30 py-4 font-bold text-secondary transition-all hover:bg-secondary/5">
                <Upload size={18} /> Tải lên CV mới
              </button>
            </section>

            <section className="rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-sm">
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
