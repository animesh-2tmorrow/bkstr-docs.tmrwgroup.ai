import Link from 'next/link';

// Root landing for docs.bkstr.tmrwgroup.ai. A minimal branded splash that
// routes into the docs; the documentation home itself is /docs.
export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-fd-muted-foreground">
        Documentation
      </p>
      <h1 className="mt-4 text-4xl font-normal text-fd-foreground sm:text-5xl">
        bkstr docs
      </h1>
      <p className="mt-5 max-w-xl leading-relaxed text-fd-muted-foreground">
        Guides and reference for bkstr — a marketplace of books and skills your
        AI agent can read, install, and query. Buying and installing, the CLI
        and HTTP API, the hosted MCP server, and publishing your own content.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/docs"
          className="rounded-md bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
        >
          Read the docs
        </Link>
        <Link
          href="/docs/subscriber/getting-started"
          className="rounded-md border border-fd-border px-5 py-2.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
        >
          Getting started
        </Link>
      </div>
    </main>
  );
}
