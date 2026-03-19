import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Macondo, Roboto, Permanent_Marker, Space_Grotesk, Pacifico, Anybody } from "next/font/google"
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

const permanentMarker = Permanent_Marker({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const pacifico = Pacifico({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
})

const anybody = Anybody({
  subsets: ["latin"],
  variable: "--font-anybody",
  display: "swap",
  axes: ["wdth"],
})

export const metadata: Metadata = {
  title: "BGHelper - Board Game Companions",
  description:
    "Digital helpers for ito, A Fake Artist Goes to New York, Just One, and more party board games. Never lose the prompt cards again!",
  keywords: [
    "board games",
    "party games",
    "ito",
    "fake artist",
    "just one",
    "wavelength",
    "game helper",
    "digital companion",
  ],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistFont.className} ${macondo.variable} ${roboto.variable} ${permanentMarker.variable} ${spaceGrotesk.variable} ${pacifico.variable} ${anybody.variable}`}
      >
        <Suspense fallback="Loading...">{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
