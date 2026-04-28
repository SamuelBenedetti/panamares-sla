"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STEPS = [
  {
    paso: "01",
    heading: ["¿Qué tipo de propiedad", "se ajusta a sus necesidades?"],
    italic: [false, true],
    options: ["Residencial", "Comercial", "Otro"],
    key: "tipo",
  },
  {
    paso: "02",
    heading: ["¿Qué estás", "buscando?"],
    italic: [false, true],
    options: ["Comprar – Uso personal", "Comprar – Inversión", "Comprar – Ambos", "Alquilar"],
    key: "intencion",
  },
  {
    paso: "03",
    heading: ["¿Cuánto espacio", "necesitas?"],
    italic: [false, true],
    options: ["1 habitación", "2 habitaciones", "3 habitaciones", "4+ habitaciones"],
    key: "habitaciones",
  },
  {
    paso: "04",
    heading: ["¿Cuál es su", "presupuesto estimado?"],
    italic: [false, true],
    options: ["- $200k", "$200k – $500k", "$500k – $1M", "$1M+", "Flexible"],
    key: "presupuesto",
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

const PRICE_MAP: Record<string, { min?: string; max?: string }> = {
  "- $200k": { max: "200000" },
  "$200k – $500k": { min: "200000", max: "500000" },
  "$500k – $1M": { min: "500000", max: "1000000" },
  "$1M+": { min: "1000000" },
};

function buildUrl(answers: Answers, originalQuery?: string): string {
  const base =
    answers.intencion === "Alquilar"
      ? "/propiedades-en-alquiler/"
      : "/propiedades-en-venta/";

  const params = new URLSearchParams();

  if (originalQuery) {
    params.set("buscar", originalQuery);
  }

  const beds = answers.habitaciones ? BEDS_MAP[answers.habitaciones] : undefined;
  if (beds) params.set("habitaciones", beds);

  const range = answers.presupuesto ? PRICE_MAP[answers.presupuesto] : undefined;
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
      transition(() => setStep((s) => s + 1));
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
      transition(() => setStep((s) => s + 1));
    }
  }

  return (
    <div className="relative h-[calc(100vh-80px)] bg-[#0d1835] overflow-hidden">

      {/* Close — volver al inicio */}
      <a
        href="/"
        className="absolute top-[20px] right-[24px] z-20 flex items-center gap-[8px] border border-white/20 px-[14px] py-[8px] text-white/50 hover:text-white hover:border-white/60 transition-all duration-150 font-body text-[13px] font-medium"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="hidden sm:inline">Volver al inicio</span>
      </a>

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
          px-[30px] xl:px-[20px] 2xl:px-[120px]
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
                    text-[60px] md:text-[68px] lg:text-[62px] xl:text-[95px] 2xl:text-[90px]
                    leading-[56px] md:leading-[64px] lg:leading-[58px] xl:leading-[90px] 2xl:leading-[108px]"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {current.heading[0]}
                </span>
                <span
                  className="font-heading font-light italic text-white
                    text-[60px] md:text-[68px] lg:text-[62px] xl:text-[95px] 2xl:text-[90px]
                    leading-[56px] md:leading-[64px] lg:leading-[58px] xl:leading-[90px] 2xl:leading-[108px]"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {current.heading[1]}
                </span>
              </h1>
            </div>

            {/* Options */}
            <div className="flex flex-wrap items-center justify-center gap-[10px] md:gap-[12px] xl:gap-[16px]">
              {current.options.map((option) => (
                <button
                  key={option}
                  onClick={() => select(option)}
                  className="border border-[rgba(250,248,245,0.5)] px-[18px] md:px-[21px] py-[12px] md:py-[14px] font-body font-medium text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] leading-[20px] text-white hover:bg-[rgba(250,248,245,0.08)] hover:border-[rgba(250,248,245,0.9)] transition-all duration-150 whitespace-nowrap cursor-pointer"
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
              className="flex items-center gap-[8px] md:gap-[10px] px-[16px] md:px-[20px] py-[10px] md:py-[12px] font-body font-medium text-[15px] md:text-[16px] xl:text-[18px] leading-[30px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Retornar
            </button>
            <button
              onClick={skip}
              className="flex items-center gap-[8px] md:gap-[10px] px-[16px] md:px-[20px] py-[10px] md:py-[12px] font-body font-medium text-[15px] md:text-[16px] xl:text-[18px] leading-[30px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
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
