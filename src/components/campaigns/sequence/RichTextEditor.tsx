import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Zap, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

const variables = [
  { label: 'First Name', value: '{firstName}' },
  { label: 'Last Name', value: '{lastName}' },
  { label: 'Company Name', value: '{companyName}' },
  { label: 'Title', value: '{title}' },
  { label: 'Location', value: '{location}' },
  { label: 'Email', value: '{email}' },
];

export function RichTextEditor({ content, onChange, disabled }: RichTextEditorProps) {
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => setIsEditorFocused(true),
    onBlur: () => setIsEditorFocused(false),
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 p-2 border border-border rounded-t-md bg-background">
        <div className="flex items-center gap-1 border-r border-border pr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 w-8 p-0 hover:bg-accent ${editor.isActive('bold') ? 'bg-accent' : ''}`}
            disabled={!isEditorFocused}
          >
            <Bold className="h-4 w-4 text-foreground" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 w-8 p-0 hover:bg-accent ${editor.isActive('italic') ? 'bg-accent' : ''}`}
            disabled={!isEditorFocused}
          >
            <Italic className="h-4 w-4 text-foreground" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`h-8 w-8 p-0 hover:bg-accent ${editor.isActive('underline') ? 'bg-accent' : ''}`}
            disabled={!isEditorFocused}
          >
            <Underline className="h-4 w-4 text-foreground" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r border-border pr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 p-0 hover:bg-accent ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
            disabled={!isEditorFocused}
          >
            <ListOrdered className="h-4 w-4 text-foreground" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 p-0 hover:bg-accent ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
            disabled={!isEditorFocused}
          >
            <List className="h-4 w-4 text-foreground" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={`h-8 w-8 p-0 hover:bg-accent ${editor.isActive('link') ? 'bg-accent' : ''}`}
            disabled={!isEditorFocused}
          >
            <LinkIcon className="h-4 w-4 text-foreground" />
          </Button>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm"
                className="h-8 px-3 flex items-center gap-2"
                disabled={!isEditorFocused}
              >
                <Zap className="h-4 w-4 text-foreground" />
                <span>Variables</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {variables.map((variable) => (
                <DropdownMenuItem 
                  key={variable.value}
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .insertContent(`<span class="bg-blue-100 px-1 rounded">${variable.value}</span>`)
                      .run();
                  }}
                >
                  {variable.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <EditorContent 
        editor={editor} 
        className="w-full border border-t-0 border-border rounded-b-md min-h-[150px] focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 [&_.ProseMirror]:p-3 [&_.ProseMirror]:min-h-[150px] [&_.ProseMirror:focus]:outline-none"
      />
    </div>
  );
}