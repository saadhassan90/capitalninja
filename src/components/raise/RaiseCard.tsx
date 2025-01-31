import { memo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Eye, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
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
        {project.memo && (
          <div className="mt-4 prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: project.memo }} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const RaiseCard = memo(RaiseCardComponent);