import { Button } from "@/components/ui/button";

interface EditRaiseDialogFooterProps {
  isProcessing: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export function EditRaiseDialogFooter({
  isProcessing,
  onCancel,
  onSave,
}: EditRaiseDialogFooterProps) {
  return (
    <div className="flex justify-end p-6 border-t">
      <Button
        variant="outline"
        onClick={onCancel}
        className="mr-2"
      >
        Cancel
      </Button>
      <Button
        onClick={onSave}
        disabled={isProcessing}
      >
        {isProcessing ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}