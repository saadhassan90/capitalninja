import { memo, useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';
import { RaiseCardMenu } from "./card/RaiseCardMenu";
import { MemoDialog } from "./card/MemoDialog";
import { RaiseCardContent } from "./card/RaiseCardContent";

interface RaiseProject {
  id: string;
  name: string;
  description: string;
  target_amount: number;
  created_at: string;
  status: string;
  memo?: string;
}

interface RaiseCardProps {
  project: RaiseProject;
  onDelete?: () => void;
}

function RaiseCardComponent({ project, onDelete }: RaiseCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [memoDialogOpen, setMemoDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      // TODO: Implement delete functionality
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });

      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleView = () => {
    navigate(`/raise/${project.id}`);
  };

  const handleDownloadMemo = () => {
    const element = document.getElementById('memo-content');
    if (element) {
      const opt = {
        margin: [0.75, 0.75],
        filename: `${project.name}-memo.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Clone the element to modify it for PDF generation
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Add PDF-specific styling
      clonedElement.style.fontFamily = 'Arial, sans-serif';
      clonedElement.style.color = '#1a1a1a';
      clonedElement.style.padding = '20px';
      
      // Style headers
      const headers = clonedElement.querySelectorAll('h1, h2, h3, h4');
      headers.forEach(header => {
        (header as HTMLElement).style.borderBottom = '1px solid #e5e7eb';
        (header as HTMLElement).style.paddingBottom = '8px';
        (header as HTMLElement).style.marginBottom = '16px';
        (header as HTMLElement).style.color = '#111827';
      });

      // Style paragraphs
      const paragraphs = clonedElement.querySelectorAll('p');
      paragraphs.forEach(p => {
        (p as HTMLElement).style.marginBottom = '12px';
        (p as HTMLElement).style.lineHeight = '1.6';
      });

      // Style lists
      const lists = clonedElement.querySelectorAll('ul, ol');
      lists.forEach(list => {
        (list as HTMLElement).style.marginBottom = '16px';
        (list as HTMLElement).style.paddingLeft = '24px';
      });

      html2pdf().set(opt).from(clonedElement).save();
    }
  };

  return (
    <>
      <Card 
        className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer" 
        onClick={handleView}
      >
        <RaiseCardContent
          name={project.name}
          description={project.description}
          status={project.status}
          targetAmount={project.target_amount}
          createdAt={project.created_at}
          onMenuClick={(e) => e.stopPropagation()}
          menu={
            <RaiseCardMenu
              projectId={project.id}
              projectName={project.name}
              hasMemo={!!project.memo}
              onDelete={handleDelete}
              onViewMemo={() => setMemoDialogOpen(true)}
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
    </>
  );
}

export const RaiseCard = memo(RaiseCardComponent);