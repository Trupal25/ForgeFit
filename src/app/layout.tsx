import "./globals.css";

import { Metal_Mania } from 'next/font/google'

const inter = Metal_Mania({ 
  weight:'400',
  subsets: ['latin'] })

export const metadata = {
  title: 'My App',
  description: '...',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
    <body>{children}</body>
  </html>
  );
}
