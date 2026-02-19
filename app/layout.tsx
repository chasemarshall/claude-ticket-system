import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Outfit } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/contexts/SessionContext'
import { ToastProvider } from '@/contexts/ToastContext'
import BottomNav from '@/components/BottomNav'

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
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
    <html lang="en" className={`${mono.variable} ${outfit.variable}`}>
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
