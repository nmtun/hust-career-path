export default function Footer() {
  return (
    <footer className="mt-auto border-t border-outline-variant/10 bg-surface-container-low px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        <div>
          <span className="text-xl font-headline font-black text-primary">HUST Career Path</span>
          <p className="mt-2 text-xs uppercase tracking-widest text-on-surface-variant">© 2024 HUST Career Path · Nền tảng việc làm được chọn lọc</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          {['Quyền riêng tư', 'Điều khoản', 'Hỗ trợ', 'Nhà tuyển dụng'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant underline decoration-transparent underline-offset-4 transition-all hover:text-primary hover:decoration-primary"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
