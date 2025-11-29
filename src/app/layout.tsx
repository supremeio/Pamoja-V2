import type { Metadata } from 'next'
import { Figtree, DM_Sans } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/v2/Toast'

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-figtree',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pamoja Resume Coach',
  description: 'AI-powered resume coaching',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${dmSans.variable}`}>
      <body
        className="antialiased bg-[#151619] text-foreground min-h-screen"
        style={{ fontFamily: 'Figtree, sans-serif' }}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
