import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 opacity-80">
        <Image src="/logo-mark-192.png" alt="19Store" width={64} height={64} className="w-full h-full object-cover" />
      </div>
      <h1 className="font-display text-3xl font-bold mb-2">Page not found</h1>
      <p className="text-white/50 mb-8 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link href="/" className="btn-primary">
        Back to Shop
      </Link>
    </div>
  );
}
