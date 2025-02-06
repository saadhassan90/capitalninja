import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Variable,
  ChevronDown,
  Type,
  Palette
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface FormatToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onInsertVariable: (variable: string) => void;
  onInsertLink: (url: string) => void;
}

const fontSizes = [
  { label: 'Small', value: '2' },
  { label: 'Normal', value: '3' },
  { label: 'Large', value: '4' },
  { label: 'Extra Large', value: '5' },
];

const variables = [
  { label: 'First Name', value: '{firstName}' },
  { label: 'Last Name', value: '{lastName}' },
  { label: 'Company Name', value: '{companyName}' },
  { label: 'Title', value: '{title}' },
  { label: 'Location', value: '{location}' },
  { label: 'Email', value: '{email}' },
];

const colors = [
  { label: 'Black', value: '#000000' },
  { label: 'Gray', value: '#666666' },
  { label: 'Red', value: '#ff0000' },
  { label: 'Blue', value: '#0000ff' },
  { label: 'Green', value: '#008000' },
];

export function FormatToolbar({ onFormat, onInsertVariable, onInsertLink }: FormatToolbarProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const handleLinkSubmit = () => {
    onInsertLink(linkUrl);
    setLinkUrl('');
    setShowLinkDialog(false);
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
            onClick={() => onFormat('underline')}
            className="h-8 px-2"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-8 bg-border" />

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2">
                <Type className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {fontSizes.map((size) => (
                <DropdownMenuItem 
                  key={size.value}
                  onClick={() => onFormat('fontSize', size.value)}
                >
                  {size.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-2">
                <Palette className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {colors.map((color) => (
                <DropdownMenuItem 
                  key={color.value}
                  onClick={() => onFormat('foreColor', color.value)}
                  className="flex items-center gap-2"
                >
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: color.value }} 
                  />
                  {color.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-px h-8 bg-border" />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFormat('insertUnorderedList')}
            className="h-8 px-2"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFormat('insertOrderedList')}
            className="h-8 px-2"
          >
            <ListOrdered className="h-4 w-4" />
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
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkSubmit}>
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}