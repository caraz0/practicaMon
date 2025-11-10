import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Experimento de Tachado de Letras',
  description: 'Experimento psicológico de tachado de letras',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

