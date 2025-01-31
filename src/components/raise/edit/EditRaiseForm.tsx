import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileUploadSection } from "@/components/enrichment/FileUploadSection";
import { ProgressSection } from "@/components/enrichment/ProgressSection";
import type { RaiseProject } from "../types";

interface EditRaiseFormProps {
  project: RaiseProject;
  isProcessing: boolean;
  uploadProgress: number;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFormDataChange: (data: Partial<EditFormData>) => void;
  formData: EditFormData;
}

export interface EditFormData {
  type: "equity" | "debt";
  category: "fund_direct_deal" | "startup";
  name: string;
  targetAmount: string;
  file: File | null;
}

export function EditRaiseForm({ 
  project, 
  isProcessing, 
  uploadProgress, 
  onFileChange, 
  onFormDataChange,
  formData 
}: EditRaiseFormProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Raise Type</Label>
        <RadioGroup
          value={formData.type}
          onValueChange={(value) => onFormDataChange({ type: value as "equity" | "debt" })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="equity" id="equity" />
            <Label htmlFor="equity">Equity</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="debt" id="debt" />
            <Label htmlFor="debt">Debt</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <RadioGroup
          value={formData.category}
          onValueChange={(value) => onFormDataChange({ category: value as "fund_direct_deal" | "startup" })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fund_direct_deal" id="fund_direct_deal" />
            <Label htmlFor="fund_direct_deal">Fund/Direct Deal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="startup" id="startup" />
            <Label htmlFor="startup">Startup</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="raiseName">Raise Name</Label>
        <Input
          id="raiseName"
          value={formData.name}
          onChange={(e) => onFormDataChange({ name: e.target.value })}
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
          onChange={(e) => onFormDataChange({ targetAmount: e.target.value })}
          placeholder="Enter target amount"
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2">
        <Label>Update Pitch Deck</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a new pitch deck to replace the current one.
          Supported formats: PDF, DOC, DOCX, PPT, PPTX
        </p>
        <FileUploadSection
          file={formData.file}
          isProcessing={isProcessing}
          onFileChange={onFileChange}
        />
        <ProgressSection
          file={formData.file}
          isProcessing={isProcessing}
          progress={uploadProgress}
        />
      </div>
    </div>
  );
}