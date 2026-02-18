import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/contexts/SessionContext'
import { ToastProvider } from '@/contexts/ToastContext'
import BottomNav from '@/components/BottomNav'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kin',
  description: 'Frazier Family Home Management',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <SessionProvider>
          <ToastProvider>
            <div
              style={{
                maxWidth: '430px',
                margin: '0 auto',
                height: '100dvh',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--bg)',
              }}
            >
              {children}
              <BottomNav />
            </div>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
