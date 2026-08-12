import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg overflow-hidden">
              <Image src="/logo-mark-192.png" alt="19Store" width={36} height={36} className="w-full h-full object-cover" />
            </div>
            <span className="font-display text-lg font-bold">
              19<span className="text-brand-gold">Store</span>
            </span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Premium everyday essentials, designed for the way you actually live.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="text-white/60 hover:text-brand-gold transition-colors" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" className="text-white/60 hover:text-brand-gold transition-colors" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="#" className="text-white/60 hover:text-brand-gold transition-colors" aria-label="Twitter"><Twitter size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm tracking-wide">Shop</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/category/Hoodies" className="hover:text-white transition-colors">Hoodies</Link></li>
            <li><Link href="/category/T-Shirts" className="hover:text-white transition-colors">T-Shirts</Link></li>
            <li><Link href="/category/Jackets" className="hover:text-white transition-colors">Jackets</Link></li>
            <li><Link href="/category/Bottoms" className="hover:text-white transition-colors">Bottoms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm tracking-wide">Account</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
            <li><Link href="/account/orders" className="hover:text-white transition-colors">Order History</Link></li>
            <li><Link href="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm tracking-wide">Help</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><Link href="/admin/login" className="hover:text-white transition-colors">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} 19Store. All rights reserved.
      </div>
    </footer>
  );
}
