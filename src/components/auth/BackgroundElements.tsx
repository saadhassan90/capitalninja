import { CircleDot, Sparkles, Workflow } from "lucide-react";

export function BackgroundElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Top right sparkles */}
      <div className="absolute -right-8 top-20 text-primary/5">
        <Sparkles size={180} strokeWidth={0.5} />
      </div>

      {/* Bottom left circuit lines */}
      <div className="absolute -left-12 bottom-20 text-muted/10">
        <Workflow size={200} strokeWidth={0.5} />
      </div>

      {/* Scattered dots */}
      <div className="absolute left-1/4 top-1/3 text-accent/10">
        <CircleDot size={120} strokeWidth={0.5} />
      </div>
    </div>
  );
}