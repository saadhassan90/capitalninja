import { useState } from "react";
import { RaiseCardContent } from "./card/RaiseCardContent";
import { RaiseCardMenu } from "./card/RaiseCardMenu";
import { Card } from "@/components/ui/card";
import { EditRaiseDialog } from "./EditRaiseDialog";
import { MemoDialog } from "./card/MemoDialog";
import type { RaiseProject } from "./types";

interface RaiseTableProps {
  raises: RaiseProject[];
  onUpdate?: () => void;
}

export function RaiseTable({ raises, onUpdate }: RaiseTableProps) {
  const [selectedRaise, setSelectedRaise] = useState<RaiseProject | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMemoDialog, setShowMemoDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'view'>('view');

  const handleView = (raise: RaiseProject) => {
    setSelectedRaise(raise);
    setViewMode('view');
    setShowEditDialog(true);
  };

  const handleEdit = (raise: RaiseProject) => {
    setSelectedRaise(raise);
    setViewMode('edit');
    setShowEditDialog(true);
  };

  const handleMemoClick = (raise: RaiseProject) => {
    setSelectedRaise(raise);
    setShowMemoDialog(true);
  };

  return (
    <div className="grid gap-4">
      {raises.map((raise) => (
        <Card key={raise.id}>
          <RaiseCardContent
            name={raise.name}
            description={raise.description}
            status={raise.status}
            targetAmount={raise.target_amount}
            createdAt={raise.created_at}
            onMenuClick={(e) => e.stopPropagation()}
            menu={
              <RaiseCardMenu
                raise={raise}
                onView={() => handleView(raise)}
                onEdit={() => handleEdit(raise)}
                onUpdate={onUpdate}
              />
            }
            onMemoClick={() => handleMemoClick(raise)}
          />
        </Card>
      ))}

      {selectedRaise && (
        <>
          <EditRaiseDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            project={selectedRaise}
            onUpdate={onUpdate}
            readOnly={viewMode === 'view'}
          />
          <MemoDialog
            open={showMemoDialog}
            onOpenChange={setShowMemoDialog}
            raise={selectedRaise}
          />
        </>
      )}
    </div>
  );
}