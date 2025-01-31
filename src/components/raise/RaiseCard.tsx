import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RaiseCardContent } from "./card/RaiseCardContent";
import { RaiseCardMenu } from "./card/RaiseCardMenu";
import { MemoDialog } from "./card/MemoDialog";
import { EditRaiseDialog } from "./EditRaiseDialog";
import type { RaiseProject } from "./types";

interface RaiseCardProps {
  project: RaiseProject;
  onDelete?: () => void;
}

export function RaiseCard({ project, onDelete }: RaiseCardProps) {
  const [showMemo, setShowMemo] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleDelete = async () => {
    onDelete?.();
  };

  return (
    <>
      <Card className="relative">
        <RaiseCardContent project={project} />
        <RaiseCardMenu
          projectId={project.id}
          projectName={project.name}
          onDelete={handleDelete}
          onViewMemo={() => setShowMemo(true)}
          onEdit={() => setShowEditDialog(true)}
        />
      </Card>

      <MemoDialog
        open={showMemo}
        onOpenChange={setShowMemo}
        memo={project.memo || ""}
        projectName={project.name}
      />

      <EditRaiseDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        project={project}
        onSave={onDelete} // This will trigger a refresh of the raises list
      />
    </>
  );
}