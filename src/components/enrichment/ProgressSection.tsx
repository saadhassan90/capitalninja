import { Progress } from "@/components/ui/progress";

interface ProgressSectionProps {
  file: File | null;
  isProcessing: boolean;
  progress: number;
}

export function ProgressSection({ file, isProcessing, progress }: ProgressSectionProps) {
  if (!file && !isProcessing) return null;

  return (
    <div className="space-y-2">
      {file && (
        <p className="text-sm text-muted-foreground">
          Selected file: {file.name}
        </p>
      )}
      {isProcessing && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Processing your file... This may take a few minutes.
          </p>
        </div>
      )}
    </div>
  );
}