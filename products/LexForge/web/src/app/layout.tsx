import React from 'react';
import { Metadata } from 'next';
import { ThemeProvider } from '@lexforge/ui';
import { Playfair_Display, Inter } from 'next/font/google';
import '@lexforge/design-tokens/variables.css';
import '../styles/globals.css';
import { Global3DScene } from '../shared/3d/Global3DScene';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://lexforge.ai'),
  title: {
    default: 'LexForge | Algorithmic Branding Engine',
    template: '%s | LexForge',
  },
  description: 'LexForge combines human linguistic science with artificial intelligence to generate brand names that are memorable, meaningful, pronounceable, and globally brandable.',
  openGraph: {
    title: 'LexForge | Algorithmic Branding Engine',
    description: 'LexForge combines human linguistic science with artificial intelligence to generate brand names that are memorable, meaningful, pronounceable, and globally brandable.',
    url: 'https://lexforge.ai',
    siteName: 'LexForge',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LexForge | Algorithmic Branding Engine',
    description: 'LexForge combines human linguistic science with artificial intelligence to generate brand names that are memorable, meaningful, pronounceable, and globally brandable.',
    creator: '@LexForge',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <ThemeProvider>
          <Global3DScene />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
