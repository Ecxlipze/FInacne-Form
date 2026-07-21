import Link from 'next/link';

export const metadata = { title: 'Privacy Notice — Financial Information Portal' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <Link href="/" className="font-serif text-lg text-ink">
            Financial Information Portal
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-serif text-3xl text-ink">Privacy Notice</h1>
        <p className="mt-2 text-sm text-muted">Version 2026-01</p>

        <div className="mt-8 space-y-8 text-muted">
          <section>
            <h2 className="font-serif text-xl text-ink">What we collect</h2>
            <p className="mt-2">
              We collect the personal, contact, educational, employment, financial, and household
              information you provide in this application, along with any documents you upload (such as
              your CNIC, proof of income, and utility bills).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink">Why we collect it</h2>
            <p className="mt-2">
              Your information is used solely to assess and process your application for financial
              assistance and to contact you about it. We do not sell your data or use it for unrelated
              purposes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink">How we protect it</h2>
            <p className="mt-2">
              Sensitive fields — including your CNIC, IBAN, and financial details — are encrypted at
              rest. Uploaded documents are stored privately, scanned for malware, and only accessible to
              authorized reviewers. Access to your application is logged.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink">How long we keep it</h2>
            <p className="mt-2">
              Incomplete applications are automatically removed after a retention period. Submitted
              applications are retained only as long as needed to process and record the decision.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink">Your choices</h2>
            <p className="mt-2">
              You may request a copy of your data or ask us to delete it. When you submit, we record the
              version of this notice you agreed to, along with the date and time.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link href="/apply" className="btn-primary inline-flex">
            Start your application
          </Link>
        </div>
      </main>
    </div>
  );
}
