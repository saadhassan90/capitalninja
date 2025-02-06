import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

export function RichTextEditor({ content, onChange, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none min-h-[150px]',
      },
    },
    editable: !disabled,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md">
      <div className="border-b bg-muted/50 p-2 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
          disabled={disabled}
        >
          Bold
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
          disabled={disabled}
        >
          Italic
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
          disabled={disabled}
        >
          Bullet List
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
          disabled={disabled}
        >
          Numbered List
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}