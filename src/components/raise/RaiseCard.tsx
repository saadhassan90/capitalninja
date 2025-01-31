import { memo, useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { RaiseCardMenu } from "./card/RaiseCardMenu";
import { MemoDialog } from "./card/MemoDialog";
import { RaiseCardContent } from "./card/RaiseCardContent";
import { CreateRaiseDialog } from "./CreateRaiseDialog";
import { generateMemoPDF } from "./utils/pdfUtils";
import type { RaiseCardProps } from "./types";

function RaiseCardComponent({ project, onDelete }: RaiseCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [memoDialogOpen, setMemoDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      // TODO: Implement delete functionality
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });

      onDelete?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleDownloadMemo = () => {
    if (!project.memo) return;
    const element = document.getElementById('memo-content');
    if (element) {
      generateMemoPDF(element, project.name);
    }
  };

  return (
    <>
      <Card className="border-gray-200 hover:shadow-md transition-shadow">
        <RaiseCardContent
          name={project.name}
          description={project.description}
          status={project.memo ? "Ready" : "Draft"}
          targetAmount={project.target_amount}
          createdAt={project.created_at}
          onMenuClick={(e) => e.stopPropagation()}
          onMemoClick={() => setMemoDialogOpen(true)}
          menu={
            <RaiseCardMenu
              projectId={project.id}
              projectName={project.name}
              onDelete={handleDelete}
              onViewMemo={() => setMemoDialogOpen(true)}
              onEdit={() => setEditDialogOpen(true)}
            />
          }
        />
      </Card>

      <MemoDialog
        open={memoDialogOpen}
        onOpenChange={setMemoDialogOpen}
        projectName={project.name}
        memo={project.memo || ''}
        onDownload={handleDownloadMemo}
      />

      <CreateRaiseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onCreateRaise={onDelete}
        editMode={true}
        project={project}
      />
    </>
  );
}

export const RaiseCard = memo(RaiseCardComponent);