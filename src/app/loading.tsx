import { Pizza, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center px-4 py-16">
      <div className="relative flex flex-col items-center">
        {/* Animated glowing backdrop */}
        <div className="absolute size-28 rounded-full bg-primary/10 dark:bg-primary/20 blur-xl animate-pulse" />

        {/* Brand Icon with Gentle Floating / Pulse */}
        <div className="relative size-16 rounded-2xl bg-card border border-border shadow-md flex items-center justify-center mb-4">
          <Pizza className="size-8 text-primary animate-bounce" />
          <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-primary text-white flex items-center justify-center">
            <Loader2 className="size-3 animate-spin" />
          </div>
        </div>

        {/* Text */}
        <h3 className="font-heading text-base font-bold text-foreground">
          Baking something fresh...
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          PizzaHub is loading your experience
        </p>
      </div>
    </div>
  );
}
