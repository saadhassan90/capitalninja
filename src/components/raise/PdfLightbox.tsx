import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PdfLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string;
}

export function PdfLightbox({ open, onOpenChange, pdfUrl }: PdfLightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          title="PDF Viewer"
        />
      </DialogContent>
    </Dialog>
  );
}