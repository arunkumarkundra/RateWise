export default function Header() {
  return (
    <header className="mb-8 sm:mb-10">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent font-display text-lg font-bold text-white"
        >
          %
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">RateWise</h1>
          <p className="text-sm text-muted">Salary • Billing Rate • Gross Margin Calculator</p>
        </div>
      </div>
    </header>
  );
}
