import './globals.css';
import localFont from 'next/font/local';
import { CartProvider } from '@/components/CartContext';
import { AuthProvider } from '@/components/AuthContext';
import { WishlistProvider } from '@/components/WishlistContext';
import { ToastProvider } from '@/components/ToastContext';
import SiteChrome from '@/components/SiteChrome';
import LoadingScreen from '@/components/LoadingScreen';

// Self-hosted (not fetched from Google Fonts at build time) so builds never
// depend on external network access. Inter is a clean, geometric sans-serif
// very close in feel to Apple's SF Pro, which isn't licensed for general web use.
const inter = localFont({
  src: '../public/fonts/inter-variable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
});

export const metadata = {
  title: '19Store — Premium Everyday Clothing',
  description: 'Shop premium hoodies, tees, jackets and more at 19Store.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo-mark-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-mark-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <LoadingScreen />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <SiteChrome>{children}</SiteChrome>
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
