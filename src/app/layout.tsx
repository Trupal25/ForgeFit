import "./globals.css";
import { Metal_Mania } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Metal_Mania({ 
  weight:'400',
  subsets: ['latin'] 
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
      <body >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
