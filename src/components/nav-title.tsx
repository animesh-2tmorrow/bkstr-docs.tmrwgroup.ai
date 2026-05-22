'use client';

import type { ComponentProps } from 'react';
import { appName } from '@/lib/shared';

// The docs-site top-left title. Rendered as a plain, same-tab <a> so the
// link back to the main bkstr app does NOT open a new tab — Fumadocs'
// built-in <Link> would force target="_blank" on the external URL.
//
// Wired in via nav.title (typed FC<ComponentProps<'a'>>). It must be a
// client component so the reference survives the server→client boundary
// when baseOptions() is spread into the client-side DocsLayout. Fumadocs
// invokes it with { href: nav.url, className }.
export function NavTitle(props: ComponentProps<'a'>) {
  return <a {...props}>{appName}</a>;
}
