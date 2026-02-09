import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Macondo, Roboto } from "next/font/google"
import { Suspense } from "react"

// Initialize fonts - Geist is a variable font, no need to specify weights
const geistFont = GeistSans

const macondo = Macondo({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-macondo",
  display: "swap",
})

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BGHelper - Board Game Companions",
  description:
    "Digital helpers for ito, A Fake Artist Goes to New York, and more party board games. Never lose the prompt cards again!",
  keywords: ["board games", "party games", "ito", "fake artist", "wavelength", "game helper", "digital companion"],
  authors: [{ name: "Serdar" }],
  openGraph: {
    title: "BGHelper - Board Game Companions",
    description: "Digital helpers for your favorite party board games",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistFont.className} ${macondo.variable} ${roboto.variable}`}>
        <Suspense fallback="Loading...">{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
