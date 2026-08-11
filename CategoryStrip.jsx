import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    name: "Outerwear",
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Denim",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Knitwear",
    image:
      "https://images.unsplash.com/photo-1622445275576-721325763afe?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "T-Shirts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
  },
];

export default function CategoryStrip() {
  return (
    <section className="container-store py-16 md:py-24">
      <div className="flex items-end justify-between mb-8">
        <h2 className="font-display text-3xl md:text-4xl">Shop by category</h2>
        <Link href="/products" className="hidden sm:inline text-[13px] tracking-widest2 uppercase border-b border-ink pb-0.5 hover:text-gold hover:border-gold transition-colors">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((c) => (
          <Link key={c.name} href={`/products?category=${encodeURIComponent(c.name)}`} className="group relative aspect-[3/4] overflow-hidden bg-bone block">
            <Image
              src={c.image}
              alt={c.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
            <span className="absolute bottom-4 left-4 text-paper font-display text-xl">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
