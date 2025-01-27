import { 
  CircleDot, 
  Sparkles, 
  Workflow, 
  Network, 
  Binary, 
  Cpu 
} from "lucide-react";

export function BackgroundElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Top right sparkles */}
      <div className="absolute -right-8 top-20 text-primary/5">
        <Sparkles size={180} strokeWidth={0.5} />
      </div>
      
      {/* Top left network */}
      <div className="absolute -left-4 top-32 text-accent/5">
        <Network size={140} strokeWidth={0.5} />
      </div>

      {/* Bottom left circuit lines */}
      <div className="absolute -left-12 bottom-20 text-muted/10">
        <Workflow size={200} strokeWidth={0.5} />
      </div>

      {/* Bottom right binary */}
      <div className="absolute right-8 bottom-32 text-primary/5">
        <Binary size={160} strokeWidth={0.5} />
      </div>

      {/* Center right dots */}
      <div className="absolute right-1/4 top-1/2 text-accent/10">
        <CircleDot size={120} strokeWidth={0.5} />
      </div>

      {/* Center left CPU */}
      <div className="absolute left-1/3 top-2/3 text-muted/5">
        <Cpu size={140} strokeWidth={0.5} />
      </div>

      {/* Top center sparkles */}
      <div className="absolute left-1/2 top-24 text-primary/5">
        <Sparkles size={100} strokeWidth={0.5} />
      </div>

      {/* Bottom center network */}
      <div className="absolute left-2/3 bottom-16 text-accent/5">
        <Network size={120} strokeWidth={0.5} />
      </div>

      {/* Scattered small dots */}
      <div className="absolute left-1/4 top-1/3 text-accent/10">
        <CircleDot size={80} strokeWidth={0.5} />
      </div>
      <div className="absolute right-1/3 top-2/3 text-primary/5">
        <CircleDot size={60} strokeWidth={0.5} />
      </div>
    </div>
  );
}