import { FuelCalculator } from "@/components/FuelCalculator";

export default function Home() {
  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,_#163c2b_0%,_#07110d_42%,_#050807_100%)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <header className="space-y-3 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300/80">
            Economia no posto
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Gasolina ou etanol?
          </h1>
          <p className="text-sm leading-relaxed text-emerald-50/70 sm:text-base">
            Informe o valor do litro de cada combustível. Usamos a regra dos 70%:
            se o etanol custar até 70% do preço da gasolina, ele rende mais.
          </p>
        </header>

        <FuelCalculator />
      </div>
    </main>
  );
}
