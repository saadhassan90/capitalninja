import { Button } from "@/components/ui/button";
import { Bold, Italic, Variable, ChevronDown, Link } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface FormatToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onInsertVariable: (variable: string) => void;
}

const variables = [
  { label: 'First Name', value: '{firstName}' },
  { label: 'Last Name', value: '{lastName}' },
  { label: 'Company Name', value: '{companyName}' },
  { label: 'Title', value: '{title}' },
  { label: 'Location', value: '{location}' },
  { label: 'Email', value: '{email}' },
];

export function FormatToolbar({ onFormat, onInsertVariable }: FormatToolbarProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const handleInsertLink = () => {
    if (linkUrl) {
      onFormat('createLink', linkUrl);
      setLinkUrl("");
      setShowLinkDialog(false);
    }
  };

  return (
    <>
      <div className="border rounded-md bg-muted/50 p-2 mb-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
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
            onClick={() => setShowLinkDialog(true)}
            className="h-8 px-2"
          >
            <Link className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-8 bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2">
              <Variable className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {variables.map((variable) => (
              <DropdownMenuItem 
                key={variable.value}
                onClick={() => onInsertVariable(variable.value)}
              >
                {variable.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsertLink}>
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}