import { useEditor, EditorContent } from '@tiptap/react';
import { getEditorExtensions } from './editor/editorConfig';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

export function RichTextEditor({ content, onChange, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: getEditorExtensions(),
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none min-h-[150px]',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md">
      <EditorContent editor={editor} />
    </div>
  );
}