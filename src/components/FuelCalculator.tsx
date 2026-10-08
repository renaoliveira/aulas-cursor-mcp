"use client";

import { FormEvent, useMemo, useState } from "react";

type Recommendation = "etanol" | "gasolina" | "empate";

type Result = {
  ratio: number;
  recommendation: Recommendation;
};

function parsePrice(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;

  return parsed;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatPercent(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function FuelCalculator() {
  const [gasoline, setGasoline] = useState("");
  const [ethanol, setEthanol] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const gasolinePrice = parsePrice(gasoline);
  const ethanolPrice = parsePrice(ethanol);

  const result = useMemo<Result | null>(() => {
    if (gasolinePrice === null || ethanolPrice === null) return null;

    const ratio = ethanolPrice / gasolinePrice;
    const rounded = Math.round(ratio * 1000) / 1000;

    let recommendation: Recommendation = "gasolina";
    if (rounded < 0.7) recommendation = "etanol";
    if (rounded === 0.7) recommendation = "empate";

    return { ratio, recommendation };
  }, [ethanolPrice, gasolinePrice]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  const gasolineError = submitted && gasolinePrice === null;
  const ethanolError = submitted && ethanolPrice === null;

  return (
    <section className="rounded-3xl border border-emerald-400/15 bg-emerald-950/40 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-7">
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-emerald-100">
              Preço do litro da gasolina
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-emerald-200/60">
                R$
              </span>
              <input
                inputMode="decimal"
                autoComplete="off"
                placeholder="6,19"
                value={gasoline}
                onChange={(event) => {
                  setGasoline(event.target.value);
                  setSubmitted(false);
                }}
                aria-invalid={gasolineError}
                className="h-14 w-full rounded-2xl border border-emerald-400/20 bg-black/30 pl-12 pr-4 text-lg text-white outline-none ring-emerald-300/40 placeholder:text-emerald-100/30 focus:border-emerald-300/50 focus:ring-2"
              />
            </div>
            {gasolineError ? (
              <p className="text-sm text-amber-300">
                Informe um valor válido maior que zero.
              </p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-emerald-100">
              Preço do litro do etanol
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-emerald-200/60">
                R$
              </span>
              <input
                inputMode="decimal"
                autoComplete="off"
                placeholder="4,09"
                value={ethanol}
                onChange={(event) => {
                  setEthanol(event.target.value);
                  setSubmitted(false);
                }}
                aria-invalid={ethanolError}
                className="h-14 w-full rounded-2xl border border-emerald-400/20 bg-black/30 pl-12 pr-4 text-lg text-white outline-none ring-emerald-300/40 placeholder:text-emerald-100/30 focus:border-emerald-300/50 focus:ring-2"
              />
            </div>
            {ethanolError ? (
              <p className="text-sm text-amber-300">
                Informe um valor válido maior que zero.
              </p>
            ) : null}
          </label>
        </div>

        <button
          type="submit"
          className="h-14 w-full rounded-2xl bg-emerald-400 text-base font-semibold text-emerald-950 transition hover:bg-emerald-300 active:scale-[0.99]"
        >
          Comparar combustíveis
        </button>
      </form>

      {submitted && result ? (
        <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-5">
          <p className="text-sm text-emerald-100/70">
            O etanol está custando{" "}
            <strong className="text-white">{formatPercent(result.ratio)}</strong>{" "}
            do preço da gasolina.
          </p>

          {result.recommendation === "etanol" ? (
            <p className="text-xl font-semibold text-emerald-300 sm:text-2xl">
              Abasteça com etanol. É a opção mais econômica.
            </p>
          ) : null}

          {result.recommendation === "gasolina" ? (
            <p className="text-xl font-semibold text-amber-200 sm:text-2xl">
              Abasteça com gasolina. É a opção mais econômica.
            </p>
          ) : null}

          {result.recommendation === "empate" ? (
            <p className="text-xl font-semibold text-sky-200 sm:text-2xl">
              Empate: os dois rendem o mesmo pelo preço.
            </p>
          ) : null}

          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl bg-white/5 p-3">
              <dt className="text-emerald-100/60">Gasolina</dt>
              <dd className="mt-1 font-medium text-white">
                {formatCurrency(gasolinePrice ?? 0)} / L
              </dd>
            </div>
            <div className="rounded-xl bg-white/5 p-3">
              <dt className="text-emerald-100/60">Etanol</dt>
              <dd className="mt-1 font-medium text-white">
                {formatCurrency(ethanolPrice ?? 0)} / L
              </dd>
            </div>
          </dl>
        </div>
      ) : null}
    </section>
  );
}
