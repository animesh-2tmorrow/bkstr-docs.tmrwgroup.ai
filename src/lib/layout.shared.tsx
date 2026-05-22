import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { NavTitle } from '@/components/nav-title';
import { gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // Top-left title links back to the main bkstr app, in the same tab.
      // NavTitle is a client render component (FC<ComponentProps<'a'>>) —
      // it bypasses Fumadocs' <Link>, which would otherwise force
      // target="_blank" on this external URL.
      url: 'https://bkstr.tmrwgroup.ai/',
      title: NavTitle,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
