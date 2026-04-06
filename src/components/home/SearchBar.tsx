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
    if (q) {
      router.push(`/buscar?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/buscar");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center border border-white h-[60px] w-full backdrop-blur-md bg-white/10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suite ejecutiva con vista a la bahía..."
          className="flex-1 h-full bg-transparent px-[21px] text-white placeholder:text-white/50 focus:outline-none font-body text-base"
        />
        <button
          type="submit"
          className="flex items-center justify-center w-[60px] h-[60px] shrink-0 hover:bg-white/10 transition-colors"
          aria-label="Buscar"
        >
          <Search size={20} className="text-white" />
        </button>
      </div>
    </form>
  );
}
