import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RaiseCardContent } from "./card/RaiseCardContent";
import { RaiseCardMenu } from "./card/RaiseCardMenu";
import { MemoDialog } from "./card/MemoDialog";
import { EditRaiseDialog } from "./EditRaiseDialog";
import { toast } from "sonner";
import type { RaiseProject } from "./types";
import html2pdf from "html2pdf.js";

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

  const handleDownloadMemo = () => {
    const element = document.getElementById('memo-content');
    if (!element) {
      toast.error("Could not generate PDF");
      return;
    }

    const opt = {
      margin: 1,
      filename: `${project.name}-memo.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save()
      .then(() => toast.success("PDF downloaded successfully"))
      .catch(() => toast.error("Failed to download PDF"));
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
        onDownload={handleDownloadMemo}
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