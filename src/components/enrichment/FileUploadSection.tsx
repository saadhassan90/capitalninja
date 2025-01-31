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
    <div>
      <Input
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        onChange={onFileChange}
        className="w-full"
        disabled={isProcessing}
      />
    </div>
  );
}