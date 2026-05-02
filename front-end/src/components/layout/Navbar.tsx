import {Bell, Search, User, X} from 'lucide-react';
import {motion, AnimatePresence} from 'motion/react';
import {useEffect, useRef, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';

const NAV_ITEMS = [
  {name: 'Trang chủ', path: '/'},
  {name: 'Việc làm', path: '/jobs'},
  {name: 'Ứng tuyển', path: '/dashboard'},
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate(`/jobs${searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery.trim())}` : ''}`);
  };

  return (
    <header className="sticky top-0 z-50 grid w-full grid-cols-[1fr_auto_1fr] items-center border-b border-outline-variant/10 bg-surface/80 px-6 py-5 shadow-sm backdrop-blur-xl md:px-12">
      <Link to="/" className="justify-self-start text-xl font-extrabold tracking-tighter text-primary transition-opacity hover:opacity-80">
        HUST Career Path
      </Link>

      <nav className="hidden justify-self-center gap-6 md:flex">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`relative py-1 text-sm font-headline font-semibold tracking-tight transition-all ${
              isActive(item.path) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {item.name}
            {isActive(item.path) && (
              <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-self-end gap-2">
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              key="search-bar"
              initial={{width: 0, opacity: 0}}
              animate={{width: 220, opacity: 1}}
              exit={{width: 0, opacity: 0}}
              transition={{duration: 0.2}}
              onSubmit={handleSearchSubmit}
              className="overflow-hidden"
            >
              <input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm vị trí, kỹ năng..."
                className="h-9 w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 text-sm font-medium outline-none focus:border-primary/40"
              />
            </motion.form>
          )}
        </AnimatePresence>

        <button
          aria-label={searchOpen ? 'Đóng tìm kiếm' : 'Tìm kiếm'}
          onClick={() => setSearchOpen((prev) => !prev)}
          className={`rounded-full p-2 transition-colors hover:bg-surface-container-high hover:text-primary ${searchOpen ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          {searchOpen ? <X size={20} /> : <Search size={20} />}
        </button>
        <button aria-label="Thông báo" className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-surface bg-primary" />
        </button>
        <Link
          to="/dashboard"
          className="rounded-full border border-outline-variant/20 p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
        >
          <User size={24} />
        </Link>
      </div>
    </header>
  );
}
