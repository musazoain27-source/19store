'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ListOrdered, LogOut, ExternalLink } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ListOrdered },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return children;

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-[85vh] grid md:grid-cols-[240px_1fr] bg-black/[0.02]">
      <aside className="border-r border-black/10 bg-white p-5 flex md:flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg overflow-hidden">
              <Image src="/logo-mark-192.png" alt="19Store" width={36} height={36} className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold hidden md:block">
              19<span className="text-brand-gold">Store</span> <span className="text-xs font-normal text-black/40">Admin</span>
            </span>
          </Link>
          <nav className="flex md:flex-col gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'bg-brand text-white' : 'text-black/60 hover:bg-black/5'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden md:block">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex md:flex-col gap-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-black/60 hover:bg-black/5">
            <ExternalLink size={18} />
            <span className="hidden md:block">View Store</span>
          </Link>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
            <LogOut size={18} />
            <span className="hidden md:block">Log Out</span>
          </button>
        </div>
      </aside>
      <main className="p-5 md:p-8">{children}</main>
    </div>
  );
}
