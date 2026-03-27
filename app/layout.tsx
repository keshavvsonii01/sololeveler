import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Shadow HUD - Solo Leveling Gym",
  description: "Track your fitness journey through the ranks. E-Rank to S-Rank.",
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#131314" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}