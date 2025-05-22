import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ケイタMAXの冒険",
  description: "ブラウザで遊べるRPGゲーム",
  manifest: '/manifest.json',
  themeColor: '#8936FF',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ケイタMAXの冒険',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/icon512_rounded.png',
    apple: '/icon512_rounded.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/my-site/manifest.json" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-900`}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-4xl">
            <Providers>{children}</Providers>
          </div>
        </div>
      </body>
    </html>
  )
}
