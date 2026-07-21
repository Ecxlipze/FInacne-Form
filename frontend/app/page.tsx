import Link from 'next/link';

const SECTIONS = [
  'Personal', 'Contact', 'Education', 'Employment', 'Income', 'Expenses',
  'Assets', 'Liabilities', 'Banking', 'Family', 'Goals', 'Documents', 'Declaration',
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <span className="font-serif text-lg text-ink">Financial Information Portal</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        <section className="grid gap-10 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-verify">Financial assistance application</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">
              Apply for financial assistance in one secure session.
            </h1>
            <p className="mt-4 text-lg text-muted">
              This form collects the personal, financial, and household information needed to assess
              your application. It takes about 15–20 minutes, and everything you enter is encrypted and
              saved automatically after each section — so you can pause and pick up right where you left off.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/apply" className="btn-primary">
                Start application
              </Link>
              <a href="#what-you-need" className="btn-ghost">
                What you’ll need
              </a>
            </div>
            <p className="mt-4 text-sm text-muted">
              Your details are used only to review this application and are handled in line with our
              privacy notice.
            </p>
          </div>

          {/* Signature: the application shown as an official numbered index. */}
          <div className="rounded-card border border-line bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm font-medium text-ink">The sections you’ll complete</p>
            <ol className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {SECTIONS.map((s, i) => (
                <li key={s} className="flex items-center gap-2.5 text-muted">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-[11px] text-ink">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="what-you-need" className="grid gap-8 border-t border-line py-14 md:grid-cols-3">
          <div>
            <h2 className="font-serif text-xl text-ink">Before you begin</h2>
            <p className="mt-2 text-muted">
              Keep your CNIC, proof of income, and bank details to hand. Documents can be uploaded as
              PDF, JPEG, or PNG, up to 10&nbsp;MB each.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-ink">Your privacy</h2>
            <p className="mt-2 text-muted">
              Sensitive details are encrypted at rest. We record your consent and retain your data only
              as long as needed.{' '}
              <Link href="/privacy" className="text-verify underline">
                Read the privacy notice
              </Link>
              .
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-ink">Take your time</h2>
            <p className="mt-2 text-muted">
              Progress is saved after every section. Leave whenever you need and pick up later with a
              secure link.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-8">
        <div className="mx-auto max-w-5xl px-4 text-sm text-muted">
          © {new Date().getFullYear()} Financial Information Portal
        </div>
      </footer>
    </div>
  );
}
