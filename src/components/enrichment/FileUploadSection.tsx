import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileUploadSectionProps {
  file: File | null;
  isProcessing: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
}

export function FileUploadSection({ 
  file, 
  isProcessing, 
  onFileChange, 
  onUpload 
}: FileUploadSectionProps) {
  return (
    <div className="flex items-center gap-4">
      <Input
        type="file"
        accept=".csv"
        onChange={onFileChange}
        className="flex-1"
        disabled={isProcessing}
      />
      <Button 
        onClick={onUpload}
        disabled={!file || isProcessing}
      >
        {isProcessing ? "Processing..." : "Upload & Process"}
      </Button>
    </div>
  );
}