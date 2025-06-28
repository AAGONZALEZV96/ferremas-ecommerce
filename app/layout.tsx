import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ferremas-ecommerce',
  description: 'ferremas-ecommerce - Tu tienda de ferretería en línea',
  generator: 'ferremas-ecommerce',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
