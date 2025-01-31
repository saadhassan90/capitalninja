import { Label } from "@/components/ui/label";
import { FileUploadSection } from "@/components/enrichment/FileUploadSection";
import { ProgressSection } from "@/components/enrichment/ProgressSection";

interface PitchDeckStepProps {
  file: File | null;
  isProcessing: boolean;
  uploadProgress: number;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
}

export function PitchDeckStep({
  file,
  isProcessing,
  uploadProgress,
  onFileChange,
  onUpload,
}: PitchDeckStepProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Upload Pitch Deck</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your pitch deck and we'll automatically create a project based on its contents.
          Supported formats: PDF, DOC, DOCX, PPT, PPTX
        </p>
        <FileUploadSection
          file={file}
          isProcessing={isProcessing}
          onFileChange={onFileChange}
          onUpload={onUpload}
        />
        <ProgressSection
          file={file}
          isProcessing={isProcessing}
          progress={uploadProgress}
        />
      </div>
    </div>
  );
}