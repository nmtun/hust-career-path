import {Bell, Search, User} from 'lucide-react';
import {motion} from 'motion/react';
import {Link, useLocation} from 'react-router-dom';

const NAV_ITEMS = [
  {name: 'Explore', path: '/'},
  {name: 'Jobs', path: '/jobs'},
  {name: 'Applications', path: '/dashboard'},
  {name: 'Resources', path: '#'},
];

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

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

      <div className="flex items-center justify-self-end gap-4">
        <button className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary">
          <Search size={20} />
        </button>
        <button className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary">
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
