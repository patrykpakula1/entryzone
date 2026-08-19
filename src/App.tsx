/**
 * Placeholder — sprawdza tylko, czy Tailwind, tokeny kolorów i Lora działają.
 * Do podmiany przy kroku 1 z START.md (scena bazowa hero).
 */
export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6">
      <img src="/logo.svg" alt="" width={96} height={96} />

      <h1 className="text-3xl tracking-[0.25em] sm:text-5xl">Entryzone</h1>

      <p className="max-w-md text-center text-sm text-text/60">
        Scaffold gotowy. Tokeny i Lora podpięte.
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {(
          [
            ['gold', 'bg-gold'],
            ['gold-lite', 'bg-gold-lite'],
            ['copper', 'bg-copper'],
            ['surface', 'bg-surface'],
            ['border', 'bg-border'],
            ['text', 'bg-text'],
          ] as const
        ).map(([name, bg]) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <div className={`size-12 rounded-sm border border-border ${bg}`} />
            <span className="text-[10px] tracking-widest text-text/50 uppercase">
              {name}
            </span>
          </div>
        ))}
      </div>
    </main>
  )
}
