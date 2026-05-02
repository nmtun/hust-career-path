import {Briefcase, Calendar, Home, Upload} from 'lucide-react';
import {Link, useLocation} from 'react-router-dom';

const SIDEBAR_ITEMS = [
  {name: 'Trang chủ', icon: Home, path: '/'},
  {name: 'Việc làm', icon: Briefcase, path: '/jobs'},
  {name: 'Hồ sơ sinh viên', icon: Calendar, path: '/dashboard'},
];

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="flex w-full shrink-0 flex-col gap-8 lg:w-64">
      <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
        <div className="mb-8">
          <div className="mb-1 text-lg font-headline font-bold text-primary">Cổng sinh viên</div>
          <div className="text-xs font-medium text-on-surface-variant">ĐHBK Hà Nội · Khóa 2024</div>
        </div>

        <nav className="flex flex-col gap-1">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-all ${
                isActive(item.path)
                  ? 'bg-surface-container-high text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:pl-4'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90"
          >
            <Upload size={16} />
            Đăng tải CV
          </button>
        </div>
      </div>
    </aside>
  );
}
