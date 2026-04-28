import type { Faq } from "@/lib/faqs";

interface Props {
  faqs: Faq[];
}

/**
 * Static FAQ block — fully visible (no accordion toggle) so Google can crawl
 * all answer text without JavaScript execution.
 * Used on Tier 2 (category) and Tier 3 (geo-type) pages.
 */
export default function FaqSection({ faqs }: Props) {
  if (!faqs.length) return null;

  return (
    <section className="bg-white border-t border-[#dfe5ef] px-[30px] xl:px-[60px] 2xl:px-[160px] py-[60px] xl:py-[80px]">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-[40px] xl:mb-[48px]">
          <p className="font-body font-medium text-[12px] text-[#5a6478] tracking-[5px] uppercase leading-4 mb-[10px]">
            FAQ
          </p>
          <h2 className="font-heading font-normal text-[36px] xl:text-[38px] text-[#0c1834] tracking-[-1px] xl:tracking-[-1.3px] leading-none">
            Preguntas frecuentes
          </h2>
        </div>

        {/* Grid: 2 cols on xl, 1 col on mobile */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-[64px] gap-y-[32px] xl:gap-y-[40px]">
          {faqs.map((faq, i) => (
            <div key={i} className="flex flex-col gap-[10px]">
              <p className="font-body font-semibold text-[16px] xl:text-[18px] text-[#0c1834] leading-snug">
                {faq.question}
              </p>
              <p className="font-body font-normal text-[15px] xl:text-[16px] text-[#5a6478] leading-[1.7]">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
