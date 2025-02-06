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
import { Editor } from '@tiptap/react';

interface FormatToolbarProps {
  editor: Editor | null;
  onInsertVariable: (variable: string) => void;
}

const fontSizes = [
  { label: 'Small', value: '14px' },
  { label: 'Normal', value: '16px' },
  { label: 'Large', value: '18px' },
  { label: 'Extra Large', value: '24px' },
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

export function FormatToolbar({ editor, onInsertVariable }: FormatToolbarProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!editor) {
    return null;
  }

  const handleLinkSubmit = () => {
    if (linkUrl) {
      // Check if there is text selected
      if (editor.state.selection.empty) {
        editor.chain().focus().insertContent({
          type: 'text',
          text: linkUrl,
          marks: [{ type: 'link', attrs: { href: linkUrl } }],
        }).run();
      } else {
        editor.chain().focus().toggleLink({ href: linkUrl }).run();
      }
    } else {
      editor.chain().focus().unsetLink().run();
    }
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
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-active={editor.isActive('bold')}
            className={`h-8 px-2 ${editor.isActive('bold') ? 'bg-muted' : ''}`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-active={editor.isActive('italic')}
            className={`h-8 px-2 ${editor.isActive('italic') ? 'bg-muted' : ''}`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            data-active={editor.isActive('underline')}
            className={`h-8 px-2 ${editor.isActive('underline') ? 'bg-muted' : ''}`}
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
                  onClick={() => {
                    editor.chain().focus().run();
                    const element = document.querySelector('.ProseMirror');
                    if (element) {
                      element.style.fontSize = size.value;
                    }
                  }}
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
                  onClick={() => editor.chain().focus().setColor(color.value).run()}
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
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-active={editor.isActive('bulletList')}
            className={`h-8 px-2 ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            data-active={editor.isActive('orderedList')}
            className={`h-8 px-2 ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}
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