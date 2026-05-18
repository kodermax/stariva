"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        type="email"
        placeholder="Ваш email"
        className="flex-1 rounded-full border-espresso/15 bg-parchment text-espresso placeholder:text-taupe/60 focus-visible:border-terracotta"
      />
      <Button
        type="submit"
        className="label-caps-md px-6 py-3 h-auto rounded-full bg-espresso text-parchment hover:bg-terracotta transition-colors"
      >
        Подписаться
      </Button>
    </form>
  );
}
