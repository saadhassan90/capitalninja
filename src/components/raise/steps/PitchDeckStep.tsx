import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUploadSection } from "@/components/enrichment/FileUploadSection";
import { ProgressSection } from "@/components/enrichment/ProgressSection";
import { useRaiseForm } from "../RaiseFormContext";

export function PitchDeckStep() {
  const { 
    formData, 
    isProcessing, 
    uploadProgress, 
    updateFormData 
  } = useRaiseForm();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      updateFormData({ file: event.target.files[0] });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="raiseName">Raise Name</Label>
          <Input
            id="raiseName"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter raise name"
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAmount">Target Amount ($)</Label>
          <Input
            id="targetAmount"
            type="number"
            value={formData.targetAmount}
            onChange={(e) => updateFormData({ targetAmount: e.target.value })}
            placeholder="Enter target amount"
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="raisedAmount">Raised so far ($)</Label>
          <Input
            id="raisedAmount"
            type="number"
            value={formData.raisedAmount}
            onChange={(e) => updateFormData({ raisedAmount: e.target.value })}
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
            file={formData.file}
            isProcessing={isProcessing}
            onFileChange={handleFileChange}
          />
          <ProgressSection
            file={formData.file}
            isProcessing={isProcessing}
            progress={uploadProgress}
          />
        </div>
      </div>
    </div>
  );
}