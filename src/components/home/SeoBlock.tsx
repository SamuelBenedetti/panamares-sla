interface Props {
  text: string;
  collapsibleOnMobile?: boolean;
}

export default function SeoBlock({ text, collapsibleOnMobile = true }: Props) {
  return (
    <div className="text-brand-slate text-sm leading-relaxed">
      {/* Desktop: always visible */}
      <p className="hidden md:block">{text}</p>

      {/* Mobile: CSS-only collapsible via details/summary */}
      {collapsibleOnMobile && (
        <details className="md:hidden group">
          <summary className="list-none cursor-pointer">
            <p className="line-clamp-3 group-open:line-clamp-none">{text}</p>
            <span className="mt-1 inline-block text-brand-gold text-xs font-semibold group-open:hidden">
              Leer más
            </span>
            <span className="mt-1 hidden group-open:inline-block text-brand-gold text-xs font-semibold">
              Leer menos
            </span>
          </summary>
        </details>
      )}
    </div>
  );
}
