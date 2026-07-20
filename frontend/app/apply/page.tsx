import Wizard from '@/components/wizard/Wizard';

export default function ApplyPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <span className="font-serif text-lg text-ink">Financial Information Portal</span>
        </div>
      </header>
      <Wizard />
    </div>
  );
}
