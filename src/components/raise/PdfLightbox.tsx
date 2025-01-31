import { Sheet, SheetContent } from "@/components/ui/sheet";

interface PdfLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl?: string;
}

export function PdfLightbox({ open, onOpenChange, pdfUrl }: PdfLightboxProps) {
  if (!pdfUrl) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[800px] p-0">
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          style={{ height: "calc(100vh - 2rem)" }}
        />
      </SheetContent>
    </Sheet>
  );
}