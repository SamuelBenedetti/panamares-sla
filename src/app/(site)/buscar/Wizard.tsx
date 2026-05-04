"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getCopy, type Locale } from "@/lib/copy";

const TIPO_MAP: Record<string, string> = {
  Residencial: "residencial",
  Comercial: "comercial",
  Terreno: "otro",
  Residential: "residencial",
  Commercial: "comercial",
  Land: "otro",
};

// Bedroom option key → query value
const BEDS_KEY_MAP: Record<string, string> = {
  uno: "1",
  dos: "2",
  tres: "3",
  cuatroPlus: "4",
};

// Comercial y Terreno no tienen habitaciones — saltar paso 3
const SKIP_BEDS_TIPO_VALUES = new Set(["comercial", "otro"]);

interface BudgetRange {
  min?: string;
  max?: string;
}

const BUDGET_COMPRA_RANGES: Record<string, BudgetRange> = {
  menos150k: { max: "150000" },
  r150_350: { min: "150000", max: "350000" },
  r350_700: { min: "350000", max: "700000" },
  r700_1500: { min: "700000", max: "1500000" },
  mas1500: { min: "1500000" },
  flexible: {},
};

const BUDGET_ALQUILER_RANGES: Record<string, BudgetRange> = {
  menos800: { max: "800" },
  r800_1500: { min: "800", max: "1500" },
  r1500_3000: { min: "1500", max: "3000" },
  r3000_6000: { min: "3000", max: "6000" },
  mas6000: { min: "6000" },
  flexible: {},
};

type StepKey = "intencion" | "tipo" | "habitaciones" | "presupuesto";
type Answers = Partial<Record<StepKey, string>>; // stores option-key, not label

interface OptionItem {
  key: string;
  label: string;
}

export default function Wizard({ locale = "es" }: { locale?: Locale }) {
  const router = useRouter();
  const t = getCopy(locale).pages.buscar;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [fading, setFading] = useState(false);

  // Build steps from copy bundle dynamically — keep heading + options keyed
  // so we always know the canonical option key (intent/type), independent of
  // the displayed label.
  const STEPS = useMemo(() => {
    const intencion = {
      paso: "01",
      key: "intencion" as StepKey,
      heading: [t.steps.intencion.line1, t.steps.intencion.line2Italic],
      options: [
        { key: "comprar", label: t.steps.intencion.options.comprar },
        { key: "alquilar", label: t.steps.intencion.options.alquilar },
      ] as OptionItem[],
    };
    const tipo = {
      paso: "02",
      key: "tipo" as StepKey,
      heading: [t.steps.tipo.line1, t.steps.tipo.line2Italic],
      options: [
        { key: "residencial", label: t.steps.tipo.options.residencial },
        { key: "comercial", label: t.steps.tipo.options.comercial },
        { key: "otro", label: t.steps.tipo.options.terreno },
      ] as OptionItem[],
    };
    const habitaciones = {
      paso: "03",
      key: "habitaciones" as StepKey,
      heading: [t.steps.habitaciones.line1, t.steps.habitaciones.line2Italic],
      options: [
        { key: "uno", label: t.steps.habitaciones.options.uno },
        { key: "dos", label: t.steps.habitaciones.options.dos },
        { key: "tres", label: t.steps.habitaciones.options.tres },
        { key: "cuatroPlus", label: t.steps.habitaciones.options.cuatroPlus },
      ] as OptionItem[],
    };
    const presupuesto = {
      paso: "04",
      key: "presupuesto" as StepKey,
      heading: [t.steps.presupuesto.line1, t.steps.presupuesto.line2Italic],
      // options computed dynamically based on intencion
      options: [] as OptionItem[],
    };
    return [intencion, tipo, habitaciones, presupuesto] as const;
  }, [t]);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const presupuestoOptions: OptionItem[] = useMemo(() => {
    if (answers.intencion === "alquilar") {
      const m = t.steps.presupuesto.alquilarOptions;
      return [
        { key: "menos800", label: m.menos800 },
        { key: "r800_1500", label: m.r800_1500 },
        { key: "r1500_3000", label: m.r1500_3000 },
        { key: "r3000_6000", label: m.r3000_6000 },
        { key: "mas6000", label: m.mas6000 },
        { key: "flexible", label: m.flexible },
      ];
    }
    const m = t.steps.presupuesto.comprarOptions;
    return [
      { key: "menos150k", label: m.menos150k },
      { key: "r150_350", label: m.r150_350 },
      { key: "r350_700", label: m.r350_700 },
      { key: "r700_1500", label: m.r700_1500 },
      { key: "mas1500", label: m.mas1500 },
      { key: "flexible", label: m.flexible },
    ];
  }, [answers.intencion, t]);

  const currentOptions: OptionItem[] = current.key === "presupuesto" ? presupuestoOptions : [...current.options];

  function buildUrl(a: Answers): string {
    const isAlquiler = a.intencion === "alquilar";
    const base = isAlquiler
      ? locale === "en"
        ? "/en/properties-for-rent/"
        : "/propiedades-en-alquiler/"
      : locale === "en"
        ? "/en/properties-for-sale/"
        : "/propiedades-en-venta/";

    const params = new URLSearchParams();

    if (a.tipo) params.set("categoria", a.tipo);
    if (a.habitaciones && BEDS_KEY_MAP[a.habitaciones]) params.set("habitaciones", BEDS_KEY_MAP[a.habitaciones]);

    const range = a.presupuesto
      ? (isAlquiler ? BUDGET_ALQUILER_RANGES : BUDGET_COMPRA_RANGES)[a.presupuesto]
      : undefined;
    if (range?.min) params.set("minPrice", range.min);
    if (range?.max) params.set("maxPrice", range.max);

    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }

  function transition(fn: () => void) {
    setFading(true);
    setTimeout(() => {
      fn();
      setFading(false);
    }, 180);
  }

  function shouldSkipBedsAfter(tipoKey: string | undefined): boolean {
    return SKIP_BEDS_TIPO_VALUES.has(tipoKey ?? "");
  }

  function select(opt: OptionItem) {
    // Some legacy ES tipos: "Residencial" → "residencial"; we always store .key
    const optionKey =
      current.key === "tipo" ? (TIPO_MAP[opt.label] ?? opt.key) : opt.key;
    const next = { ...answers, [current.key]: optionKey };
    setAnswers(next);
    if (isLast) {
      router.push(buildUrl(next));
    } else {
      const nextStep = step + 1;
      const skip =
        STEPS[nextStep]?.key === "habitaciones" && shouldSkipBedsAfter(next.tipo);
      transition(() => setStep((s) => s + (skip ? 2 : 1)));
    }
  }

  function goBack() {
    if (step === 0) {
      router.push(locale === "en" ? "/en" : "/");
    } else {
      const prevStep = step - 1;
      const skip =
        STEPS[prevStep]?.key === "habitaciones" && shouldSkipBedsAfter(answers.tipo);
      transition(() => setStep((s) => s - (skip ? 2 : 1)));
    }
  }

  function skipStep() {
    if (isLast) {
      router.push(buildUrl(answers));
    } else {
      const nextStep = step + 1;
      const skip =
        STEPS[nextStep]?.key === "habitaciones" && shouldSkipBedsAfter(answers.tipo);
      transition(() => setStep((s) => s + (skip ? 2 : 1)));
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
                  {t.stepLabel} {current.paso}
                </span>
                <span className="font-body font-medium text-[11px] md:text-[12px] leading-[16px] text-[#5a6478] tracking-[5px] uppercase">
                  {t.stepSeparator}
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
                  key={option.key}
                  onClick={() => select(option)}
                  className="border border-[rgba(250,248,245,0.5)] px-[18px] md:px-[21px] py-[12px] md:py-[14px] font-body font-medium text-[15px] md:text-[14px] lg:text-[15px] xl:text-[16px] leading-[20px] text-white hover:bg-[rgba(250,248,245,0.08)] hover:border-[rgba(250,248,245,0.9)] transition-all duration-150 whitespace-nowrap cursor-pointer"
                >
                  {option.label}
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
              {t.retornar}
            </button>
            <button
              onClick={skipStep}
              className="flex items-center gap-[8px] md:gap-[10px] px-[16px] md:px-[20px] py-[10px] md:py-[12px] font-body font-medium text-[15px] md:text-[14px] xl:text-[15px] leading-[30px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
            >
              {t.omitir}
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
