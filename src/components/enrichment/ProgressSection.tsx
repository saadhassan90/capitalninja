import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface ProgressSectionProps {
  file: File | null;
  isProcessing: boolean;
  progress: number;
  memoStatus: 'idle' | 'extracting' | 'analyzing' | 'creating' | 'complete' | 'failed';
}

export function ProgressSection({ file, isProcessing, progress, memoStatus }: ProgressSectionProps) {
  if (!file && !isProcessing) return null;

  const getStatusMessage = () => {
    switch (memoStatus) {
      case 'extracting':
        return 'Extracting data from pitch deck...';
      case 'analyzing':
        return 'Analyzing pitch deck content...';
      case 'creating':
        return 'Creating deal memo...';
      case 'complete':
        return 'Deal memo created successfully!';
      case 'failed':
        return 'Failed to create memo. Please try again.';
      default:
        return 'Ready to process';
    }
  };

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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {memoStatus !== 'complete' && memoStatus !== 'failed' && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <p>{getStatusMessage()}</p>
          </div>
        </div>
      )}
    </div>
  );
}