"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    motivo: "",
    mensaje: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.nombre,
          email: form.correo,
          phone: form.telefono || undefined,
          message: [form.motivo ? `Motivo: ${form.motivo}` : null, form.mensaje || null]
            .filter(Boolean).join(" — ") || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const WHATSAPP_URL =
    "https://wa.me/50760000000?text=Hola%2C%20me%20interesa%20una%20propiedad%20en%20Panamares";
  const WHATSAPP_EQUIPO_URL =
    "https://wa.me/50760000000?text=Hola%2C%20soy%20agente%20inmobiliario%20y%20me%20gustar%C3%ADa%20unirme%20al%20equipo%20de%20Panamares.";

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[#0c1834] px-[30px] xl:px-[260px] pt-[120px] xl:pt-[160px] pb-[60px] xl:pb-[80px]">
        <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row xl:items-end xl:justify-between gap-[40px] xl:gap-[80px]">
          {/* Left: heading */}
          <div className="flex flex-col gap-[20px] max-w-[600px]">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              Estamos para ayudarte
            </p>
            <h1 className="flex flex-col text-white">
              <span className="font-heading font-normal text-[clamp(38px,5vw,64px)] leading-none tracking-[-1.8px]">
                Contacta con
              </span>
              <span className="font-heading font-medium italic text-[clamp(44px,6vw,72px)] leading-none tracking-[-2.1px]">
                Panamares
              </span>
            </h1>
            <p className="font-body font-light text-[16px] xl:text-[18px] text-white/70 leading-relaxed max-w-[480px]">
              Nuestro equipo responde en minutos. Cuéntanos qué buscas y te orientamos sin compromiso.
            </p>
          </div>

          {/* Right: WhatsApp CTA — hero action */}
          <div className="flex flex-col gap-[16px] shrink-0">
            <p className="font-body font-medium text-[11px] text-white/40 tracking-[4px] uppercase">
              Respuesta inmediata
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[12px] bg-[#25d366] hover:bg-[#1ebe57] px-[32px] py-[18px] font-body font-medium text-[16px] text-white tracking-[0.5px] transition-colors whitespace-nowrap"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.9.52 3.68 1.43 5.21L2 22l4.89-1.41A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8.5 9c0-.5.5-2 2-2 .5 0 1 .5 1.5 1.5.3.7.1 1.3-.3 1.8-.4.5-.7.9-.5 1.4.3.8 1.3 2 2.1 2.5.5.3 1 .1 1.5-.2.5-.3 1-.5 1.5-.2.8.5 1.2 1 1.2 1.5 0 1-1 2-2 2-2 0-7.5-4.5-7.5-8.3z" fill="white"/>
              </svg>
              Escribir por WhatsApp
            </a>
            <p className="font-body text-[12px] text-white/40">
              También puedes llenar el formulario abajo
            </p>
          </div>
        </div>
      </section>

      {/* ── Form + Sidebar ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[260px] py-[60px] xl:py-[100px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-[40px] xl:gap-[64px]">

            {/* Left: Form */}
            <div className="flex flex-col gap-[32px]">
              {status === "success" ? (
                <div className="bg-white border border-[#dfe5ef] p-[40px] flex flex-col gap-[12px]">
                  <p className="font-heading font-normal text-[32px] text-[#0c1834] tracking-[-0.9px] leading-none">
                    ¡Mensaje enviado!
                  </p>
                  <p className="font-body font-light text-[16px] text-[#737b8c] leading-relaxed">
                    Nos pondremos en contacto contigo a la brevedad.
                  </p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-[8px] bg-[#25d366] px-[20px] py-[10px] font-body font-medium text-[14px] text-white w-fit"
                  >
                    Abrir WhatsApp
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-body font-semibold text-[12px] text-[#737b8c] tracking-[1.2px] uppercase leading-4">
                        Nombre completo *
                      </label>
                      <input
                        required
                        type="text"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        placeholder="Ej. María González"
                        className="bg-white border border-[#dfe5ef] px-[17px] py-[14px] font-body text-[14px] text-[#0c1935] placeholder:text-[rgba(115,123,140,0.5)] outline-none focus:border-[#0c1834] transition-colors w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-body font-semibold text-[12px] text-[#737b8c] tracking-[1.2px] uppercase leading-4">
                        Correo electrónico *
                      </label>
                      <input
                        required
                        type="email"
                        value={form.correo}
                        onChange={(e) => setForm({ ...form, correo: e.target.value })}
                        placeholder="correo@ejemplo.com"
                        className="bg-white border border-[#dfe5ef] px-[17px] py-[14px] font-body text-[14px] text-[#0c1935] placeholder:text-[rgba(115,123,140,0.5)] outline-none focus:border-[#0c1834] transition-colors w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-body font-semibold text-[12px] text-[#737b8c] tracking-[1.2px] uppercase leading-4">
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                        placeholder="+507 6000-0000"
                        className="bg-white border border-[#dfe5ef] px-[17px] py-[14px] font-body text-[14px] text-[#0c1935] placeholder:text-[rgba(115,123,140,0.5)] outline-none focus:border-[#0c1834] transition-colors w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <label className="font-body font-semibold text-[12px] text-[#737b8c] tracking-[1.2px] uppercase leading-4">
                        Motivo de contacto
                      </label>
                      <div className="relative">
                        <select
                          value={form.motivo}
                          onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                          className="appearance-none bg-white border border-[#dfe5ef] px-[17px] py-[13px] font-body text-[14px] text-[#0c1935] outline-none focus:border-[#0c1834] transition-colors w-full cursor-pointer"
                        >
                          <option value="">Seleccionar…</option>
                          <option value="compra">Compra de propiedad</option>
                          <option value="alquiler">Alquiler de propiedad</option>
                          <option value="inversion">Inversión</option>
                          <option value="visita">Agendar visita</option>
                          <option value="otro">Otro</option>
                        </select>
                        <svg
                          className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none"
                          width="14" height="8" viewBox="0 0 14 8" fill="none"
                        >
                          <path d="M1 1L7 7L13 1" stroke="#737b8c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <label className="font-body font-semibold text-[12px] text-[#737b8c] tracking-[1.2px] uppercase leading-4">
                      Mensaje
                    </label>
                    <textarea
                      rows={5}
                      value={form.mensaje}
                      onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                      placeholder="Cuéntanos qué estás buscando, presupuesto aproximado, zona de interés…"
                      className="bg-white border border-[#dfe5ef] px-[17px] py-[13px] font-body text-[14px] text-[#0c1935] placeholder:text-[rgba(115,123,140,0.5)] outline-none focus:border-[#0c1834] transition-colors w-full resize-none leading-5"
                    />
                  </div>

                  <div className="flex flex-col gap-[10px] pt-[8px]">
                    <div className="flex flex-row items-center gap-[16px]">
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="bg-[#0d1835] inline-flex items-center gap-[8px] px-[32px] py-[14px] font-body font-medium text-[14px] text-white tracking-[1.4px] uppercase hover:opacity-80 transition-opacity whitespace-nowrap shrink-0 disabled:opacity-50"
                      >
                        {status === "loading" ? "Enviando..." : "Enviar mensaje"}
                        <Send size={14} />
                      </button>
                      <p className="font-body font-normal text-[12px] text-[#737b8c]">
                        También puedes escribirnos directamente por WhatsApp
                      </p>
                    </div>
                    {status === "error" && (
                      <p className="font-body text-[13px] text-red-500">
                        Error al enviar. Intenta de nuevo o escríbenos por WhatsApp.
                      </p>
                    )}
                  </div>
                </form>
              )}

              {/* WhatsApp banner */}
              <div className="bg-[rgba(37,211,102,0.05)] border border-[rgba(37,211,102,0.3)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px] p-[21px]">
                <div className="flex flex-col gap-[2px]">
                  <p className="font-body font-semibold text-[14px] text-[#0c1935] leading-5">
                    ¿Prefieres respuesta inmediata?
                  </p>
                  <p className="font-body font-normal text-[12px] text-[#737b8c] leading-4">
                    Escríbenos por WhatsApp y te atendemos en minutos.
                  </p>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25d366] inline-flex items-center gap-[8px] px-[20px] py-[10px] font-body font-medium text-[14px] text-white shrink-0 hover:opacity-90 transition-opacity"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.9.52 3.68 1.43 5.21L2 22l4.89-1.41A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M8.5 9c0-.5.5-2 2-2 .5 0 1 .5 1.5 1.5.3.7.1 1.3-.3 1.8-.4.5-.7.9-.5 1.4.3.8 1.3 2 2.1 2.5.5.3 1 .1 1.5-.2.5-.3 1-.5 1.5-.2.8.5 1.2 1 1.2 1.5 0 1-1 2-2 2-2 0-7.5-4.5-7.5-8.3z" fill="white" />
                  </svg>
                  Abrir WhatsApp
                </a>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="flex flex-col gap-[32px]">

              {/* Contact items */}
              <div className="flex flex-col gap-[24px]">
                {(
                  [
                    {
                      icon: <MapPin size={17} className="text-white" />,
                      label: "Dirección",
                      content: (
                        <>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">Torre Oceánica, Piso 18</p>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">Punta Pacífica, Ciudad de Panamá</p>
                        </>
                      ),
                    },
                    {
                      icon: <Phone size={17} className="text-white" />,
                      label: "Teléfono",
                      content: (
                        <>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">+507 6000-0000</p>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">+507 300-0000</p>
                        </>
                      ),
                    },
                    {
                      icon: <Mail size={17} className="text-white" />,
                      label: "Correo",
                      content: (
                        <>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">info@panamares.com</p>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">ventas@panamares.com</p>
                        </>
                      ),
                    },
                    {
                      icon: <Clock size={17} className="text-white" />,
                      label: "Horario",
                      content: (
                        <>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">
                            Lun – Vie: <span className="font-semibold">8:00 – 18:00</span>
                          </p>
                          <p className="font-body font-normal text-[16px] text-[#0c1935] leading-normal">
                            Sábados: <span className="font-semibold">9:00 – 13:00</span>
                          </p>
                        </>
                      ),
                    },
                  ] as { icon: React.ReactNode; label: string; content: React.ReactNode }[]
                ).map(({ icon, label, content }) => (
                  <div key={label} className="flex gap-[16px] items-start min-h-[60px]">
                    <div className="bg-[#0d1835] w-[40px] h-[40px] flex items-center justify-center shrink-0 mt-[2px]">
                      {icon}
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <p className="font-body font-semibold text-[12px] text-[#737b8c] tracking-[1.2px] uppercase leading-4">
                        {label}
                      </p>
                      {content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-[#dfe5ef]" />

              {/* Map placeholder */}
              <div className="flex flex-col gap-[12px]">
                <p className="font-body font-semibold text-[12px] text-[#737b8c] tracking-[5px] uppercase leading-4">
                  Nuestra ubicación
                </p>
                <div className="bg-white border border-[#dfe5ef] h-[208px] flex flex-col items-center justify-center gap-[12px] relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(#737b8c 1px, transparent 1px), linear-gradient(90deg, #737b8c 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                  <MapPin size={27} className="text-[#0c1935] relative z-10" />
                  <div className="text-center relative z-10">
                    <p className="font-body font-medium text-[14px] text-[#0c1935] leading-5">Punta Pacífica</p>
                    <p className="font-body font-normal text-[12px] text-[#737b8c] leading-4">Ciudad de Panamá, Panamá</p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Punta+Pacifica+Panama+City"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body font-medium text-[12px] text-[#0c1935] tracking-[0.3px] uppercase leading-4 relative z-10 hover:opacity-60 transition-opacity"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </div>

              <div className="h-px bg-[#dfe5ef]" />

              {/* Conócenos mejor */}
              <div className="bg-white px-[20px] pt-[20px] pb-[23px] flex flex-col gap-[7px]">
                <p className="font-body font-normal text-[12px] text-[#737b8c] tracking-[5px] uppercase leading-4">
                  Conócenos mejor
                </p>
                <p className="font-body font-light text-[14px] text-[#0c1935] leading-[22.75px]">
                  Más de 15 años conectando a familias e inversionistas con las mejores propiedades de Panamá.
                </p>
                <Link
                  href="/sobre-nosotros/"
                  className="inline-flex items-center gap-[6px] pt-[14px] font-body font-semibold text-[12px] text-[#d4a435] tracking-[1.2px] uppercase leading-4 hover:opacity-70 transition-opacity"
                >
                  Sobre Panamares →
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Únete al equipo ── */}
      <section className="bg-[#121e3e] px-[30px] xl:px-[260px] py-[60px] xl:py-[80px]">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center xl:items-start xl:flex-row xl:justify-between gap-[32px] xl:gap-[40px]">
          <div className="flex flex-col gap-[15px] items-center xl:items-start text-center xl:text-left">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              ¿Eres agente independiente?
            </p>
            <p className="font-heading font-normal text-[clamp(34px,4vw,60px)] text-white tracking-[-1.8px] leading-none">
              Únete al equipo Panamares
            </p>
          </div>
          <a
            href={WHATSAPP_EQUIPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[8px] border border-white/50 px-[33px] py-[15px] font-body font-medium text-[16px] text-white tracking-[1.4px] uppercase hover:bg-white/10 transition-colors whitespace-nowrap w-fit"
          >
            Escríbenos
            <Send size={14} />
          </a>
        </div>
      </section>
    </>
  );
}
