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
    heading: ["¿Buscas", "comprar o alquilar?"],
    italic: [false, true],
    options: ["Comprar", "Alquilar"],
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
  } else if (answers.tipo === "Comercial") {
    params.set("buscar", "comercial");
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
    if (step > 0) transition(() => setStep((s) => s - 1));
  }

  function skip() {
    if (isLast) {
      router.push(buildUrl(answers, originalQuery));
    } else {
      transition(() => setStep((s) => s + 1));
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0d1835] flex items-center justify-center -mt-20 overflow-hidden">
      {/* Palm tree decorative */}
      <div
        className="absolute inset-x-0 pointer-events-none select-none"
        style={{ top: "301px", height: "699px" }}
      >
        <img
          src="/palm-left.svg"
          alt=""
          className="absolute left-0 bottom-0 h-full opacity-[0.12] object-contain object-bottom-left"
        />
        <img
          src="/palm-right.svg"
          alt=""
          className="absolute right-0 bottom-0 h-full opacity-[0.12] object-contain object-bottom-right"
        />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center gap-[56px] xl:gap-[70px] px-[30px] xl:px-[260px] text-center w-full max-w-[1920px] mx-auto transition-opacity duration-[180ms] ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Step indicator */}
        <div className="flex items-center gap-[10px]">
          <span className="font-body font-medium text-[12px] text-white tracking-[5px] uppercase">
            paso {current.paso}
          </span>
          <span className="font-body font-medium text-[12px] text-[#737b8c] tracking-[5px] uppercase">
            /04
          </span>
        </div>

        {/* Heading */}
        <h1 className="flex flex-col items-center leading-none">
          {current.heading.map((line, i) => (
            <span
              key={i}
              className={`font-heading font-light text-white tracking-[-0.03em] ${
                current.italic[i] ? "italic" : "not-italic"
              }`}
              style={{ fontSize: "clamp(48px, 7.5vw, 130px)", lineHeight: "0.95" }}
            >
              {line}
            </span>
          ))}
        </h1>

        {/* Options */}
        <div className="flex flex-wrap items-center justify-center gap-[16px] xl:gap-[20px]">
          {current.options.map((option) => (
            <button
              key={option}
              onClick={() => select(option)}
              className="border border-[rgba(250,248,245,0.5)] px-[21px] py-[15px] font-body font-medium text-[18px] xl:text-[20px] text-white hover:bg-[rgba(250,248,245,0.08)] hover:border-[rgba(250,248,245,0.9)] transition-all duration-150 whitespace-nowrap"
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-[10px]">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-2 px-[20px] py-[12px] font-body font-medium text-[18px] xl:text-[20px] text-white/30 hover:text-white/60 transition-colors disabled:pointer-events-none disabled:opacity-0"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M13 4L7 10L13 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Retornar
          </button>
          <button
            onClick={skip}
            className="flex items-center gap-2 px-[20px] py-[12px] font-body font-medium text-[18px] xl:text-[20px] text-white/30 hover:text-white/60 transition-colors"
          >
            Omitir
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7 4L13 10L7 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
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
