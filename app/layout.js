import './globals.css';
import { CartProvider } from '@/components/CartContext';
import { AuthProvider } from '@/components/AuthContext';
import { WishlistProvider } from '@/components/WishlistContext';
import SiteChrome from '@/components/SiteChrome';
import LoadingScreen from '@/components/LoadingScreen';

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
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <LoadingScreen />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <SiteChrome>{children}</SiteChrome>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
