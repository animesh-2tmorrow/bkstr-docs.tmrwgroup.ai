import { Geist, Newsreader, JetBrains_Mono } from 'next/font/google';
import { Provider } from '@/components/provider';
import './global.css';

// bkstr brand typefaces — match the main app: Geist (body/UI), Newsreader
// (display headings), JetBrains Mono (code). Exposed as CSS variables that
// global.css wires into --font-sans / --font-serif / --font-mono.
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-jb',
  display: 'swap',
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
