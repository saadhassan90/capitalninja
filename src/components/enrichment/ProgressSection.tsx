import { Progress } from "@/components/ui/progress";

interface ProgressSectionProps {
  file: File | null;
  isProcessing: boolean;
  progress: number;
  memoStatus: 'idle' | 'extracting' | 'analyzing' | 'creating' | 'complete' | 'failed';
}

export function ProgressSection({
  file,
  isProcessing,
  progress,
  memoStatus,
}: ProgressSectionProps) {
  if (!file || !isProcessing) return null;

  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-muted-foreground">
        Processing... {progress}%
      </p>
    </div>
  );
}