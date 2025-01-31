import { formatDistanceToNow } from "date-fns";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RaiseCardContentProps {
  name: string;
  description?: string;
  status: string;
  targetAmount: number;
  createdAt: string;
  onMenuClick: (e: React.MouseEvent) => void;
  menu: React.ReactNode;
}

export function RaiseCardContent({
  name,
  description,
  status,
  targetAmount,
  createdAt,
  onMenuClick,
  menu
}: RaiseCardContentProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-md ${
              status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}>
              {status}
            </span>
            <div onClick={onMenuClick}>
              {menu}
            </div>
          </div>
        </div>
        {description && (
          <CardDescription className="text-muted-foreground mt-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Target Amount:</span>
          <span>{formatAmount(targetAmount)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Created:</span>
          <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
        </div>
      </CardContent>
    </>
  );
}