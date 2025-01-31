import { useState } from "react";
import { PdfLightbox } from "../PdfLightbox";

interface MemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    pitch_deck_url?: string;
    memo?: string;
  };
}

export function MemoDialog({ open, onOpenChange, project }: MemoDialogProps) {
  return (
    <PdfLightbox
      open={open}
      onOpenChange={onOpenChange}
      pdfUrl={project.pitch_deck_url}
    />
  );
}