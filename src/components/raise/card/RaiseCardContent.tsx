import { formatCurrency } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RaiseProject } from "../types";

interface RaiseCardContentProps {
  project: RaiseProject;
}

export function RaiseCardContent({ project }: RaiseCardContentProps) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{project.name}</h3>
          {project.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {project.status && (
          <Badge variant={project.status === 'Draft' ? 'secondary' : 'default'}>
            {project.status}
          </Badge>
        )}
        {project.target_amount && (
          <div className="text-sm text-muted-foreground">
            Target: {formatCurrency(project.target_amount)}
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          Created: {new Date(project.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}