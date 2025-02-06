import { Button } from "@/components/ui/button";
import { List, ListOrdered, Link } from "lucide-react";
import { Editor } from '@tiptap/react';

interface ListControlsProps {
  editor: Editor | null;
  onOpenLinkDialog: () => void;
}

export function ListControls({ editor, onOpenLinkDialog }: ListControlsProps) {
  if (!editor) {
    return null;
  }

  return (
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
        onClick={onOpenLinkDialog}
        className="h-8 px-2"
      >
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
}