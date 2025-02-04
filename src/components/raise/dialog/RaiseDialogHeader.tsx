import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface RaiseDialogHeaderProps {
  step: number;
  totalSteps: number;
}

export function RaiseDialogHeader({ step, totalSteps }: RaiseDialogHeaderProps) {
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <DialogHeader className="p-6 pb-2">
      <DialogTitle>Create New Raise</DialogTitle>
      <p className="text-sm text-muted-foreground mt-2">
        Set up your fundraising project in just a few steps
      </p>
      <div className="mt-4">
        <Progress value={progress} className="w-full" />
        <div className="text-sm text-muted-foreground mt-2">
          Step {step} of {totalSteps}
        </div>
      </div>
    </DialogHeader>
  );
}