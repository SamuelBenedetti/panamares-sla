"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/config";
import { getCopy, type Locale } from "@/lib/copy";

export default function ContactForm({ locale = "es" }: { locale?: Locale }) {
  const t = getCopy(locale).components.contactForm;
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
          message: [form.motivo ? `${t.labelMotivo}: ${form.motivo}` : null, form.mensaje || null]
            .filter(Boolean).join(" — ") || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white border border-[#dfe5ef] p-[40px] flex flex-col gap-[12px]">
        <p className="font-heading font-normal text-[32px] text-[#0c1834] tracking-[-0.9px] leading-none">
          {t.successHeading}
        </p>
        <p className="font-body font-light text-[16px] text-[#5a6478] leading-relaxed">
          {t.successBody}
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-[8px] bg-[#00b424] px-[20px] py-[10px] font-body font-medium text-[14px] text-white w-fit"
        >
          {t.successButtonWhatsapp}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[8px]">
        <label className="font-body font-semibold text-[12px] text-[#5a6478] tracking-[1.2px] uppercase leading-4">
          {t.labelNombre}
        </label>
        <input
          required
          type="text"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          placeholder={t.placeholderNombre}
          className="bg-white border border-[#dfe5ef] px-[17px] py-[14px] font-body text-[14px] text-[#0c1935] placeholder:text-[rgba(115,123,140,0.5)] outline-none focus:border-[#0c1834] transition-colors w-full"
        />
      </div>

      <div className="flex flex-col gap-[8px]">
        <label className="font-body font-semibold text-[12px] text-[#5a6478] tracking-[1.2px] uppercase leading-4">
          {t.labelCorreo}
        </label>
        <input
          required
          type="email"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          placeholder={t.placeholderCorreo}
          className="bg-white border border-[#dfe5ef] px-[17px] py-[14px] font-body text-[14px] text-[#0c1935] placeholder:text-[rgba(115,123,140,0.5)] outline-none focus:border-[#0c1834] transition-colors w-full"
        />
      </div>

      <div className="flex flex-col gap-[8px]">
        <label className="font-body font-semibold text-[12px] text-[#5a6478] tracking-[1.2px] uppercase leading-4">
          {t.labelTelefono}
        </label>
        <input
          type="tel"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          placeholder={t.placeholderTelefono}
          className="bg-white border border-[#dfe5ef] px-[17px] py-[14px] font-body text-[14px] text-[#0c1935] placeholder:text-[rgba(115,123,140,0.5)] outline-none focus:border-[#0c1834] transition-colors w-full"
        />
      </div>

      <div className="flex flex-col gap-[8px]">
        <label htmlFor="motivo" className="font-body font-semibold text-[12px] text-[#5a6478] tracking-[1.2px] uppercase leading-4">
          {t.labelMotivo}
        </label>
          <div className="relative">
            <select
              id="motivo"
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              className="appearance-none bg-white border border-[#dfe5ef] px-[17px] py-[13px] font-body text-[14px] text-[#0c1935] outline-none focus:border-[#0c1834] transition-colors w-full cursor-pointer"
            >
              <option value="">{t.motivoPlaceholder}</option>
              <option value="compra">{t.motivos.compra}</option>
              <option value="alquiler">{t.motivos.alquiler}</option>
              <option value="inversion">{t.motivos.inversion}</option>
              <option value="visita">{t.motivos.visita}</option>
              <option value="otro">{t.motivos.otro}</option>
            </select>
            <svg
              className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none"
              width="14" height="8" viewBox="0 0 14 8" fill="none"
            >
              <path d="M1 1L7 7L13 1" stroke="#737b8c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        <label className="font-body font-semibold text-[12px] text-[#5a6478] tracking-[1.2px] uppercase leading-4">
          {t.labelMensaje}
        </label>
        <textarea
          rows={5}
          value={form.mensaje}
          onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          placeholder={t.placeholderMensaje}
          className="bg-white border border-[#dfe5ef] px-[17px] py-[13px] font-body text-[14px] text-[#0c1935] placeholder:text-[rgba(115,123,140,0.5)] outline-none focus:border-[#0c1834] transition-colors w-full resize-none leading-5"
        />
      </div>

      <div className="flex flex-col gap-[10px] pt-[8px]">
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-[#0d1835] w-full xl:w-fit inline-flex items-center justify-center xl:justify-start gap-[8px] px-[32px] py-[14px] font-body font-medium text-[14px] text-white tracking-[1.4px] uppercase hover:opacity-80 transition-opacity whitespace-nowrap disabled:opacity-50"
        >
          {status === "loading" ? t.buttonSending : t.buttonSend}
          <Send size={14} />
        </button>
        {status === "error" && (
          <p className="font-body text-[13px] text-red-500">
            {t.errorMessage}
          </p>
        )}
      </div>
    </form>
  );
}
