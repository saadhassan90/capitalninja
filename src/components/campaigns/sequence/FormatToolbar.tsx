import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Variable } from "lucide-react";

interface FormatToolbarProps {
  onFormat: (command: string) => void;
  onInsertVariable: () => void;
}

export function FormatToolbar({ onFormat, onInsertVariable }: FormatToolbarProps) {
  return (
    <div className="border rounded-md bg-muted/50 p-2 mb-4 flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('bold')}
        className="h-8 px-2"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('italic')}
        className="h-8 px-2"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('underline')}
        className="h-8 px-2"
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-8 bg-border mx-2" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onInsertVariable}
        className="h-8 px-2"
      >
        <Variable className="h-4 w-4" />
      </Button>
    </div>
  );
}