import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RaiseFormProvider } from "./RaiseFormContext";
import { RaiseDialogContent } from "./dialog/RaiseDialogContent";

interface RaiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RaiseDialog(props: RaiseDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0">
        <RaiseFormProvider>
          <RaiseDialogContent onOpenChange={props.onOpenChange} />
        </RaiseFormProvider>
      </DialogContent>
    </Dialog>
  );
}