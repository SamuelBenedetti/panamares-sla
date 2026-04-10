"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
  title?: string;
}

export default function FAQ({ items, title = "Preguntas frecuentes" }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-[16px]">
      <h2 className="font-body font-bold text-[20px] text-[#0c1834] tracking-[-0.6px] leading-7">
        {title}
      </h2>
      <div className="border border-[#dfe5ef] divide-y divide-[#dfe5ef]">
        {items.map((item, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex items-center justify-between w-full text-left gap-[16px] px-[20px] py-[16px] hover:bg-[#fafbfc] transition-colors"
              aria-expanded={open === i}
            >
              <span className="font-body font-medium text-[14px] text-[#0c1834] leading-[22px]">
                {item.question}
              </span>
              <ChevronDown
                size={15}
                className={`shrink-0 text-[#8a95a3] transition-transform duration-200 ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            {open === i && (
              <div className="px-[20px] pb-[16px]">
                <p className="font-body font-normal text-[13px] text-[#566070] leading-[22px]">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
