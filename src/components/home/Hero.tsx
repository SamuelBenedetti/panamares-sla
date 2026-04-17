import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center min-h-screen bg-brand-navy overflow-hidden -mt-20 px-[30px] xl:px-[20px] 2xl:px-[120px]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://www.figma.com/api/mcp/asset/765084a7-743c-4556-b349-af695d213301')",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(29,33,43,0.6)] via-[rgba(29,33,43,0.4)] to-[rgba(29,33,43,0.7)]" />
      {/* Bottom gradient to make search bar more prominent */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[rgba(13,24,53,0.85)] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-[1600px] mx-auto text-center">

        {/* Eyebrow */}
        <p className="text-white text-[11px] font-medium uppercase tracking-[5px] font-body">
          Ciudad de Panamá · Propiedades de Lujo
        </p>

        {/* Heading */}
        <h1 className="flex flex-col items-center gap-1 font-heading font-light text-white text-[clamp(72px,8vw,96px)] leading-[1] tracking-[-0.03em]">
          <span className="not-italic">Bienes Raíces</span>
          <span className="italic">en Panama</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-white text-lg md:text-xl pb-[30px]">
          Propiedades exclusivas en{" "}
          <strong className="font-bold">las mejores zonas de la ciudad.</strong>
        </p>

        {/* Search */}
        <SearchBar />
      </div>
    </section>
  );
}
