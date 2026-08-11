import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="container-store py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm text-bone/60 leading-relaxed max-w-xs">
            Considered basics and directional pieces, cut for everyday wear. Since day one.
          </p>
        </div>

        <FooterCol
          title="Shop"
          links={[
            { href: "/products", label: "All products" },
            { href: "/products?category=Outerwear", label: "Outerwear" },
            { href: "/products?category=Denim", label: "Denim" },
            { href: "/products?category=Knitwear", label: "Knitwear" },
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            { href: "/account", label: "My account" },
            { href: "/account/orders", label: "Order history" },
            { href: "/wishlist", label: "Wishlist" },
            { href: "/cart", label: "Cart" },
          ]}
        />
        <FooterCol
          title="19Store"
          links={[
            { href: "/admin/login", label: "Admin panel" },
            { href: "/products", label: "New arrivals" },
          ]}
        />
      </div>
      <div className="border-t border-white/10">
        <div className="container-store py-5 flex flex-col sm:flex-row gap-2 items-center justify-between text-[11px] tracking-widest2 uppercase text-bone/40">
          <span>© {new Date().getFullYear()} 19Store. All rights reserved.</span>
          <span>Crafted with care</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] tracking-widest2 uppercase text-gold mb-4">{title}</h4>
      <ul className="space-y-2.5 text-sm text-bone/70">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="hover:text-paper transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
