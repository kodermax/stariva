"use client";

import { Button } from "@/components/ui/button";
import { trackOzonClick } from "@/lib/analytics";

interface OzonButtonProps {
  url: string;
  workshopTitle: string;
}

export function OzonButton({ url, workshopTitle }: OzonButtonProps) {
  return (
    <Button
      asChild
      className="flex items-center justify-center gap-3 w-full bg-[#005BFF] hover:bg-[#0047CC] text-white py-4 h-auto rounded-full transition-colors label-caps mb-3"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackOzonClick("workshop", workshopTitle, url)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        </svg>
        Купить на Ozon
      </a>
    </Button>
  );
}
