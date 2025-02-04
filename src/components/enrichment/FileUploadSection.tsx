import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface FileUploadSectionProps {
  file: File | null;
  isProcessing: boolean;
  memoStatus: 'idle' | 'extracting' | 'analyzing' | 'creating' | 'complete' | 'failed';
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProcess: () => void;
}

export function FileUploadSection({
  file,
  isProcessing,
  memoStatus,
  onFileChange,
  onProcess,
}: FileUploadSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept=".csv"
          onChange={onFileChange}
          disabled={isProcessing}
          className="flex-1"
        />
        <Button
          onClick={onProcess}
          disabled={!file || isProcessing}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </div>
      {file && (
        <p className="text-sm text-muted-foreground">
          Selected file: {file.name}
        </p>
      )}
    </div>
  );
}