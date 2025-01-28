import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function NotificationToggle({
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{title}</Label>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}