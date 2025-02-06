import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline } from "lucide-react";
import { Editor } from '@tiptap/react';

interface BasicFormatButtonsProps {
  editor: Editor;
}

export function BasicFormatButtons({ editor }: BasicFormatButtonsProps) {
  return (
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
  );
}