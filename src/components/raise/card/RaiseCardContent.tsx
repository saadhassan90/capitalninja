import type { RaiseProject } from "../types";

export interface RaiseCardContentProps {
  project: RaiseProject;
}

export function RaiseCardContent({ project }: RaiseCardContentProps) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold">{project.name}</h3>
      <div className="mt-2 space-y-1">
        <p className="text-sm text-muted-foreground">
          Type: {project.type}
        </p>
        <p className="text-sm text-muted-foreground">
          Category: {project.category}
        </p>
        <p className="text-sm text-muted-foreground">
          Target Amount: ${project.target_amount.toLocaleString()}
        </p>
      </div>
    </div>
  );
}