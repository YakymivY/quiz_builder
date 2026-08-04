import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import { Navigation } from '@/components/layout/Navigation';
import '@/styles/globals.scss';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Quiz Builder',
  description: 'Create and browse custom quizzes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
