import { useState } from "react";
import { PdfLightbox } from "../PdfLightbox";

interface MemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  memo: string;
  onDownload: () => void;
}

export function MemoDialog({ open, onOpenChange, projectName, memo, onDownload }: MemoDialogProps) {
  return (
    <PdfLightbox
      open={open}
      onOpenChange={onOpenChange}
      pdfUrl={memo}
    />
  );
}