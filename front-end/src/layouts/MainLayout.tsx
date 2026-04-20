import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import {Outlet} from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
