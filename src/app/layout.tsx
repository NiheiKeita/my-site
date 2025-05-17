import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from './providers'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ドラゴンクエスト風RPG",
  description: "ドラゴンクエスト風のRPGゲーム",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
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
