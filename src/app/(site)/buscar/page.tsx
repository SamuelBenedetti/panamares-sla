"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STEPS = [
  {
    paso: "01",
    heading: ["¿Qué estás", "buscando?"],
    key: "intencion",
    options: ["Comprar", "Alquilar"],
  },
  {
    paso: "02",
    heading: ["¿Qué tipo de", "propiedad?"],
    key: "tipo",
    options: ["Residencial", "Comercial", "Terreno"],
  },
  {
    paso: "03",
    heading: ["¿Cuántas", "habitaciones?"],
    key: "habitaciones",
    options: ["1 habitación", "2 habitaciones", "3 habitaciones", "4+ habitaciones"],
  },
  {
    paso: "04",
    heading: ["¿Cuál es su", "presupuesto?"],
    key: "presupuesto",
    options: [] as string[], // dynamic based on intencion
  },
] as const;

type StepKey = (typeof STEPS)[number]["key"];
type Answers = Partial<Record<StepKey, string>>;

const BEDS_MAP: Record<string, string> = {
  "1 habitación": "1",
  "2 habitaciones": "2",
  "3 habitaciones": "3",
  "4+ habitaciones": "4",
};

const PRICE_MAP_COMPRA: Record<string, { min?: string; max?: string }> = {
  "Menos de $150k":    { max: "150000" },
  "$150k – $350k":     { min: "150000", max: "350000" },
  "$350k – $700k":     { min: "350000", max: "700000" },
  "$700k – $1.5M":     { min: "700000", max: "1500000" },
  "Más de $1.5M":      { min: "1500000" },
  "Flexible":          {},
};

const PRICE_MAP_ALQUILER: Record<string, { min?: string; max?: string }> = {
  "Menos de $800/mes":       { max: "800" },
  "$800 – $1,500/mes":       { min: "800",  max: "1500" },
  "$1,500 – $3,000/mes":     { min: "1500", max: "3000" },
  "$3,000 – $6,000/mes":     { min: "3000", max: "6000" },
  "Más de $6,000/mes":       { min: "6000" },
  "Flexible":                {},
};

const TIPO_MAP: Record<string, string> = {
  "Residencial": "residencial",
  "Comercial":   "comercial",
  "Terreno":     "otro",
};

// Comercial y Terreno no tienen habitaciones — saltar paso 3
const SKIP_BEDS = new Set(["Comercial", "Terreno"]);

function buildUrl(answers: Answers, originalQuery?: string): string {
  const isAlquiler = answers.intencion === "Alquilar";
  const base = isAlquiler ? "/propiedades-en-alquiler/" : "/propiedades-en-venta/";

  const params = new URLSearchParams();

  if (originalQuery) params.set("buscar", originalQuery);

  const categoria = answers.tipo ? TIPO_MAP[answers.tipo] : undefined;
  if (categoria) params.set("categoria", categoria);

  const beds = answers.habitaciones ? BEDS_MAP[answers.habitaciones] : undefined;
  if (beds) params.set("habitaciones", beds);

  const priceMap = isAlquiler ? PRICE_MAP_ALQUILER : PRICE_MAP_COMPRA;
  const range = answers.presupuesto ? priceMap[answers.presupuesto] : undefined;
  if (range?.min) params.set("minPrice", range.min);
  if (range?.max) params.set("maxPrice", range.max);

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function BuscarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const originalQuery = searchParams.get("q") ?? undefined;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [fading, setFading] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const currentOptions: readonly string[] =
    current.key === "presupuesto"
      ? Object.keys(answers.intencion === "Alquilar" ? PRICE_MAP_ALQUILER : PRICE_MAP_COMPRA)
      : current.options;

  function transition(fn: () => void) {
    setFading(true);
    setTimeout(() => {
      fn();
      setFading(false);
    }, 180);
  }

  function select(option: string) {
    const next = { ...answers, [current.key]: option };
    setAnswers(next);
    if (isLast) {
      router.push(buildUrl(next, originalQuery));
    } else {
      // Skip habitaciones step if tipo is Comercial or Otro
      const nextStep = step + 1;
      const shouldSkipBeds =
        STEPS[nextStep]?.key === "habitaciones" && SKIP_BEDS.has(next.tipo ?? "");
      transition(() => setStep((s) => s + (shouldSkipBeds ? 2 : 1)));
    }
  }

  function goBack() {
    if (step === 0) {
      router.push("/");
    } else {
      transition(() => setStep((s) => s - 1));
    }
  }

  function skip() {
    if (isLast) {
      router.push(buildUrl(answers, originalQuery));
    } else {
      const nextStep = step + 1;
      const shouldSkipBeds =
        STEPS[nextStep]?.key === "habitaciones" && SKIP_BEDS.has(answers.tipo ?? "");
      transition(() => setStep((s) => s + (shouldSkipBeds ? 2 : 1)));
    }
  }

  return (
    <div className="relative h-[calc(100vh-80px)] bg-[#0d1835] overflow-hidden">

      {/* Palm decorative */}
      <div
        className="hidden xl:block absolute bottom-0 -left-[30px] pointer-events-none select-none w-[420px] h-[70%]"
        style={{
          backgroundImage: "url('/palm-left.svg')",
          backgroundSize: "contain",
          backgroundPosition: "bottom left",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        className="absolute bottom-0 -right-[80px] pointer-events-none select-none w-[280px] xl:w-[480px] h-[60%] xl:h-[70%] scale-x-[-1]"
        style={{
          backgroundImage: "url('/palm-left.svg')",
          backgroundSize: "contain",
          backgroundPosition: "bottom right",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div
        className={`relative z-10 h-full w-full flex flex-col items-center justify-center
          px-[30px] xl:px-[60px] 2xl:px-[160px]
          transition-opacity duration-[180ms]
          ${fading ? "opacity-0" : "opacity-100"}`}
      >
        <div className="w-full max-w-[1400px] flex flex-col items-center gap-[48px] md:gap-[56px] lg:gap-[64px]">

          <div className="w-full flex flex-col items-center gap-[40px] md:gap-[48px] lg:gap-[52px]">

            <div className="w-full flex flex-col items-center gap-[20px] md:gap-[26px] text-center">

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-[10px]">
                <span className="font-body font-medium text-[11px] md:text-[12px] leading-[16px] text-white tracking-[5px] uppercase">
                  paso {current.paso}
                </span>
                <span className="font-body font-medium text-[11px] md:text-[12px] leading-[16px] text-[#5a6478] tracking-[5px] uppercase">
                  /04
                </span>
              </div>

              {/* H1 */}
              <h1 className="w-full flex flex-col items-center gap-[6px] md:gap-[8px]">
                <span
                  className="font-heading font-light not-italic text-white
                    text-[52px] md:text-[58px] lg:text-[54px] xl:text-[80px] 2xl:text-[76px]
                    leading-[48px] md:leading-[54px] lg:leading-[50px] xl:leading-[76px] 2xl:leading-[92px]"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {current.heading[0]}
                </span>
                <span
                  className="font-heading font-light italic text-white
                    text-[52px] md:text-[58px] lg:text-[54px] xl:text-[80px] 2xl:text-[76px]
                    leading-[48px] md:leading-[54px] lg:leading-[50px] xl:leading-[76px] 2xl:leading-[92px]"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {current.heading[1]}
                </span>
              </h1>
            </div>

            {/* Options */}
            <div className="flex flex-wrap items-center justify-center gap-[10px] md:gap-[12px] xl:gap-[16px]">
              {currentOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => select(option)}
                  className="border border-[rgba(250,248,245,0.5)] px-[18px] md:px-[21px] py-[12px] md:py-[14px] font-body font-medium text-[15px] md:text-[14px] lg:text-[15px] xl:text-[16px] leading-[20px] text-white hover:bg-[rgba(250,248,245,0.08)] hover:border-[rgba(250,248,245,0.9)] transition-all duration-150 whitespace-nowrap cursor-pointer"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-center gap-[10px]">
            <button
              onClick={goBack}
              className="flex items-center gap-[8px] md:gap-[10px] px-[16px] md:px-[20px] py-[10px] md:py-[12px] font-body font-medium text-[15px] md:text-[14px] xl:text-[15px] leading-[30px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Retornar
            </button>
            <button
              onClick={skip}
              className="flex items-center gap-[8px] md:gap-[10px] px-[16px] md:px-[20px] py-[10px] md:py-[12px] font-body font-medium text-[15px] md:text-[14px] xl:text-[15px] leading-[30px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
            >
              Omitir
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense>
      <BuscarContent />
    </Suspense>
  );
}
