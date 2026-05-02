import {ArrowRight, Brain, Briefcase, Layout, MapPin, Search, TrendingUp} from 'lucide-react';
import {motion} from 'motion/react';
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const CATEGORIES = [
  {name: 'Công nghệ thông tin', count: '1,2k+ tin tuyển dụng', icon: Layout, color: 'bg-secondary'},
  {name: 'Kỹ thuật điện tử', count: '850+ tin tuyển dụng', icon: Brain, color: 'bg-primary'},
  {name: 'Kinh tế & quản lý', count: '420+ tin tuyển dụng', icon: TrendingUp, color: 'bg-tertiary'},
];

export default function HomePage() {
  const navigate = useNavigate();
  const carouselItems = [...CATEGORIES, ...CATEGORIES];
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [locationKeyword, setLocationKeyword] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.set('q', searchKeyword.trim());
    if (locationKeyword.trim()) params.set('loc', locationKeyword.trim());
    const query = params.toString();
    navigate(`/jobs${query ? `?${query}` : ''}`);
  };

  return (
    <div className="space-y-16 pb-16 sm:space-y-20 sm:pb-20 lg:space-y-24 lg:pb-24">
      <section className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 pt-8 sm:px-6 sm:pt-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-12 lg:pt-12">
        <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} className="space-y-6 lg:col-span-7 lg:space-y-8">
          <h1 className="text-4xl font-headline font-extrabold leading-[0.95] tracking-tighter text-on-surface sm:text-5xl lg:text-6xl xl:text-7xl">
            Kiến Tạo Sự Nghiệp <br />
            <span className="italic text-primary">Đẳng Cấp</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
            Nền tảng tuyển dụng độc quyền dành cho sinh viên Đại học Bách Khoa Hà Nội. Khám phá các cơ hội nghề nghiệp được tuyển chọn kỹ lưỡng, kết nối trực tiếp với nhà tuyển dụng hàng đầu và xây dựng con đường sự nghiệp mơ ước của bạn ngay hôm nay.
          </p>

          <form onSubmit={handleSearch} className="flex w-full max-w-3xl flex-col gap-2 rounded-2xl bg-surface-container-highest p-2 shadow-xl shadow-surface-container-highest/50 sm:gap-3 md:flex-row md:items-center md:gap-2">
            <div className="flex flex-1 items-center rounded-xl border border-outline-variant/10 bg-surface-container-lowest px-4 py-3 transition-all focus-within:ring-2 focus-within:ring-primary/20">
              <Search size={20} className="mr-3 text-on-surface-variant" />
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full border-none bg-transparent font-medium text-on-surface placeholder:text-on-surface-variant focus:ring-0"
                placeholder="Vị trí, kỹ năng, công ty..."
                type="text"
              />
            </div>
            <div className="flex flex-1 items-center rounded-xl border border-outline-variant/10 bg-surface-container-lowest px-4 py-3 transition-all focus-within:ring-2 focus-within:ring-primary/20">
              <MapPin size={20} className="mr-3 text-on-surface-variant" />
              <input
                value={locationKeyword}
                onChange={(e) => setLocationKeyword(e.target.value)}
                className="w-full border-none bg-transparent font-medium text-on-surface placeholder:text-on-surface-variant focus:ring-0"
                placeholder="Địa điểm..."
                type="text"
              />
            </div>
            <button type="submit" className="w-full rounded-xl bg-primary px-8 py-3 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90 sm:w-auto md:px-6 lg:px-8">
              Tìm Kiếm
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{opacity: 0, scale: 0.9}}
          animate={{opacity: 1, scale: 1}}
          className="relative mx-auto hidden w-full max-w-md md:block lg:col-span-5 lg:max-w-none"
        >
          <div className="relative aspect-[4/5] rotate-2 overflow-hidden rounded-[2.5rem] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=1000&fit=crop"
              alt="Sinh viên làm việc nhóm"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="absolute -bottom-5 left-0 flex -rotate-3 items-center gap-4 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-5 shadow-2xl sm:-left-6 sm:-bottom-6 sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-on-secondary">
              <Briefcase size={24} />
            </div>
            <div>
              <div className="text-xl font-bold">1.2k+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Việc làm mới</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-headline font-bold tracking-tight text-on-surface">Danh Mục Nổi Bật</h2>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-3 sm:p-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent sm:w-24" />

          <div className={`featured-carousel-track flex w-max gap-4 sm:gap-5 ${isCarouselPaused ? 'is-paused' : ''}`}>
            {carouselItems.map((cat, i) => (
              <Link
                key={`${cat.name}-${i}`}
                to="/jobs"
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
                className="group block w-[280px] shrink-0 rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm transition-all hover:-translate-y-1 sm:w-[320px] sm:p-7 lg:w-[360px]"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color} text-on-secondary shadow-lg shadow-secondary/10 transition-transform group-hover:scale-110`}
                >
                  <cat.icon size={28} />
                </div>
                <h3 className="mb-2 text-xl font-headline font-bold text-on-surface">{cat.name}</h3>
                <p className="mb-4 text-sm font-medium text-on-surface-variant">{cat.count}</p>
                <span className="flex items-center gap-1 text-sm font-bold text-secondary transition-all group-hover:gap-2">
                  Khám phá <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
