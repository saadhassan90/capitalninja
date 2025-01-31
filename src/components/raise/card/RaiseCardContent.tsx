import { formatCurrency } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RaiseCardContentProps {
  name: string;
  description?: string;
  status?: string;
  targetAmount?: number;
  createdAt: string;
  onMenuClick: (e: React.MouseEvent) => void;
  menu: React.ReactNode;
  onMemoClick?: () => void;
}

export function RaiseCardContent({
  name,
  description,
  status,
  targetAmount,
  createdAt,
  onMenuClick,
  menu,
  onMemoClick,
}: RaiseCardContentProps) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={onMemoClick}
          >
            <FileText className="h-4 w-4" />
            Deal Memo
          </Button>
          <div onClick={onMenuClick}>
            {menu}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {status && (
          <Badge variant={status === 'Draft' ? 'secondary' : 'default'}>
            {status}
          </Badge>
        )}
        {targetAmount && (
          <div className="text-sm text-muted-foreground">
            Target: {formatCurrency(targetAmount)}
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          Created: {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}