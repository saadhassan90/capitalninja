import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUploadSection } from "@/components/enrichment/FileUploadSection";
import { ProgressSection } from "@/components/enrichment/ProgressSection";

interface PitchDeckStepProps {
  file: File | null;
  isProcessing: boolean;
  uploadProgress: number;
  raiseName: string;
  targetAmount: string;
  raisedAmount: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onRaiseNameChange: (value: string) => void;
  onTargetAmountChange: (value: string) => void;
  onRaisedAmountChange: (value: string) => void;
}

export function PitchDeckStep({
  file,
  isProcessing,
  uploadProgress,
  raiseName,
  targetAmount,
  raisedAmount,
  onFileChange,
  onUpload,
  onRaiseNameChange,
  onTargetAmountChange,
  onRaisedAmountChange,
}: PitchDeckStepProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="raiseName">Raise Name</Label>
          <Input
            id="raiseName"
            value={raiseName}
            onChange={(e) => onRaiseNameChange(e.target.value)}
            placeholder="Enter raise name"
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAmount">Target Amount ($)</Label>
          <Input
            id="targetAmount"
            type="number"
            value={targetAmount}
            onChange={(e) => onTargetAmountChange(e.target.value)}
            placeholder="Enter target amount"
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="raisedAmount">Raised so far ($)</Label>
          <Input
            id="raisedAmount"
            type="number"
            value={raisedAmount}
            onChange={(e) => onRaisedAmountChange(e.target.value)}
            placeholder="Enter amount raised"
            disabled={isProcessing}
          />
        </div>

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
    </div>
  );
}