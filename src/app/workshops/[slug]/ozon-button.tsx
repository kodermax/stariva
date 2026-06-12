"use client";

import { OzonIcon } from "@/components/stariva/icons";
import { trackOzonClick } from "@/lib/analytics";

interface OzonButtonProps {
  url: string;
  workshopTitle: string;
  price?: number;
}

export function OzonButton({ url, workshopTitle, price }: OzonButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackOzonClick("workshop", workshopTitle, url)}
      className="flex flex-col items-center justify-center w-full bg-[#005BFF] hover:bg-[#0047CC] text-white py-4 px-6 rounded-2xl transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,91,255,0.35)] mb-3"
    >
      <span className="flex items-center gap-2.5 label-caps text-[13px]">
        <OzonIcon className="w-5 h-5" />
        Купить на Ozon
      </span>
      <span className="text-white/70 text-[10px] mt-0.5 label-caps">
        Безопасная оплата · Доставка по России
      </span>
    </a>
  );
}
