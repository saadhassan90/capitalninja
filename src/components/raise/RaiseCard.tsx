import { memo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Eye, Edit, Trash, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';

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
      <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={handleView}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-md ${
                project.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {project.status}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={handleView}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/raise/${project.id}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {project.memo && (
                    <DropdownMenuItem onClick={(e) => {
                      e.preventDefault();
                      setMemoDialogOpen(true);
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Memo
                    </DropdownMenuItem>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-destructive"
                        onSelect={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the project "{project.name}" and remove all associated data.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete Project
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {project.description && (
            <CardDescription className="text-muted-foreground mt-2">
              {project.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Target Amount:</span>
            <span>{formatAmount(project.target_amount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Created:</span>
            <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={memoDialogOpen} onOpenChange={setMemoDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Deal Memo - {project.name}</DialogTitle>
          </DialogHeader>
          <div id="memo-content" className="prose prose-slate dark:prose-invert max-w-none mt-4 px-4">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 pb-2 border-b">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4">{children}</blockquote>
                  ),
                }}
              >
                {project.memo || ''}
              </ReactMarkdown>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setMemoDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleDownloadMemo} className="ml-2">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const RaiseCard = memo(RaiseCardComponent);