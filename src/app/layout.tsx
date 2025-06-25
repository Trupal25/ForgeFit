import "./globals.css";
import { Inter } from 'next/font/google';
import AuthProvider from "@/components/providers/AuthProvider";

// Using Inter instead of Metal_Mania which was causing connection issues
const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
});

export const metadata = {
  title: 'ForgeFit',
  description: 'Your fitness companion. Track workouts, set goals, and see progress—powered by you.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
