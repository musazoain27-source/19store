"use client";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(product.id);
  const totalStock = product.sizes?.reduce((s, x) => s + x.stock, 0) ?? 0;
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="group relative">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-bone">
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.tags?.includes("new") && (
              <span className="bg-ink text-paper text-[10px] tracking-widest2 uppercase px-2.5 py-1">
                New
              </span>
            )}
            {onSale && (
              <span className="bg-rust text-paper text-[10px] tracking-widest2 uppercase px-2.5 py-1">
                Sale
              </span>
            )}
            {totalStock === 0 && (
              <span className="bg-paper text-ink text-[10px] tracking-widest2 uppercase px-2.5 py-1 border border-line">
                Sold out
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={saved}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-paper/90 backdrop-blur flex items-center justify-center hover:bg-paper transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={saved ? "#A23E2E" : "none"}
          stroke={saved ? "#A23E2E" : "#111013"}
          strokeWidth="1.8"
        >
          <path d="M12 20s-7.2-4.4-9.6-9C.8 7.4 3 4 6.6 4c2 0 3.6 1.1 5.4 3 1.8-1.9 3.4-3 5.4-3 3.6 0 5.8 3.4 4.2 7-2.4 4.6-9.6 9-9.6 9Z" strokeLinejoin="round" />
        </svg>
      </button>

      <Link href={`/products/${product.id}`} className="block mt-3">
        <p className="font-mono text-[10px] tracking-widest2 uppercase text-clay">{product.category}</p>
        <h3 className="font-display text-[15px] mt-1 leading-snug">{product.title}</h3>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
          {onSale && (
            <span className="text-sm text-clay/70 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
