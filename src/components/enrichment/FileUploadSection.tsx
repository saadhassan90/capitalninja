import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp } from "lucide-react";

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
  onProcess 
}: FileUploadSectionProps) {
  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        onChange={onFileChange}
        className="w-full"
        disabled={isProcessing}
      />
      {file && memoStatus !== 'complete' && (
        <Button
          onClick={onProcess}
          disabled={isProcessing || !file}
          className="w-full"
        >
          <FileUp className="mr-2 h-4 w-4" />
          {memoStatus === 'failed' ? 'Try Again' : 'Process Pitch Deck'}
        </Button>
      )}
    </div>
  );
}