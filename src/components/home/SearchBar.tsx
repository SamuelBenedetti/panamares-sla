"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/buscar?q=${encodeURIComponent(q)}` : "/buscar");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center justify-between border border-white px-[21px] py-[12px] w-full backdrop-blur-md bg-white/10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suite ejecutiva con vista a la bahía..."
          className="flex-1 bg-transparent text-white placeholder:text-[rgba(255,255,255,0.5)] font-body font-semibold text-[15px] focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="ml-[16px] flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <Search size={20} className="text-white" />
        </button>
      </div>
    </form>
  );
}
