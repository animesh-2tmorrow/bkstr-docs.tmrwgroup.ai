'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type ReactNode } from 'react';

// Dark is the default theme (the Cursor-style target). The light/dark
// toggle Fumadocs ships stays available; light mode is themed to the
// bkstr app's cream palette in global.css.
export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog }} theme={{ defaultTheme: 'dark' }}>
      {children}
    </RootProvider>
  );
}
