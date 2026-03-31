"use client";

import { whatsappLink } from "@/lib/config";
import { MessageCircle, Phone } from "lucide-react";

interface Props {
  message: string;
  variant?: "floating" | "card" | "sidebar";
  label?: string;
}

export default function WhatsAppButton({
  message,
  variant = "card",
}: Props) {
  const href = whatsappLink(message);

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:bg-[#1ebe57] transition-colors md:hidden"
      >
        <MessageCircle size={28} fill="white" color="white" />
      </a>
    );
  }

  if (variant === "sidebar") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold py-3.5 transition-colors"
      >
        <MessageCircle size={20} fill="white" />
        Contactar por WhatsApp
      </a>
    );
  }

  // card variant — dark navy Contáctenos button (Figma style)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="flex-1 flex items-center justify-center gap-1.5 bg-[#0d1835] hover:bg-[#162444] text-white font-body font-medium text-[14px] transition-colors shadow-sm"
    >
      <Phone size={16} />
      Contáctenos
    </a>
  );
}
