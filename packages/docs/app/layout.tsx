import type { Metadata } from 'next';
import Link from 'next/link';
import '@csl/tokens/css';
import '@csl/ui/styles.css';
import './globals.css';
import { ThemeSelector } from '../components/theme-selector';
export const metadata: Metadata = {
  title: { default: 'Component Systems Lab', template: '%s · Component Systems Lab' },
  description:
    'A small, carefully specified React component system. Explore the contracts, test the interactions, and try the reference checkout.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Component Systems Lab home">
            <span className="brand-mark" aria-hidden="true">
              csl.
            </span>
            <span>
              Component
              <br />
              Systems Lab
            </span>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/components/button/">Components</Link>
            <Link href="/lab/">Interaction lab</Link>
            <Link href="/tokens/">Tokens</Link>
            <Link href="/checkout/">
              Reference checkout <span aria-hidden="true">↗</span>
            </Link>
          </nav>
          <ThemeSelector />
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="site-footer">
          <span>Built with care. Tested with intent.</span>
          <Link href="/limitations/">Evidence & limitations</Link>
          <span>React · TypeScript · Eight component families</span>
        </footer>
      </body>
    </html>
  );
}
