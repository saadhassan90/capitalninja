import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, toggleMark, setBlockType } from 'prosemirror-commands';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Zap, Bold, Italic, List, ListOrdered } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

// Extend the basic schema to include marks we need
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: {
    ...schema.spec.marks,
    link: {
      attrs: { href: {} },
      inclusive: false,
      parseDOM: [{ tag: 'a', getAttrs: dom => ({ href: (dom as HTMLElement).getAttribute('href') }) }],
      toDOM: node => ['a', { ...node.attrs, class: 'text-primary underline' }, 0]
    }
  }
});

export function RichTextEditor({ content, onChange, disabled }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: mySchema.nodeFromJSON(content ? JSON.parse(content) : { type: 'doc', content: [{ type: 'paragraph' }] }),
      schema: mySchema,
      plugins: [
        history(),
        keymap(baseKeymap)
      ]
    });

    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction(transaction) {
        const newState = view.state.apply(transaction);
        view.updateState(newState);
        if (onChange) {
          const content = JSON.stringify(newState.doc.toJSON());
          onChange(content);
        }
      }
    });

    viewRef.current = view;

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, []);

  const toggleFormat = (markType: string) => {
    if (!viewRef.current) return;
    const { state, dispatch } = viewRef.current;
    toggleMark(mySchema.marks[markType])(state, dispatch);
  };

  const setLink = () => {
    if (!viewRef.current) return;
    const { state, dispatch } = viewRef.current;
    const { from, to } = state.selection;
    
    if (from === to) return; // No text selected
    
    const url = window.prompt('Enter URL:');
    if (!url) return;
    
    toggleMark(mySchema.marks.link, { href: url })(state, dispatch);
  };

  const insertVariable = (variable: string) => {
    if (!viewRef.current) return;
    const { state, dispatch } = viewRef.current;
    const { from } = state.selection;
    
    const tr = state.tr.insertText(variable, from);
    dispatch(tr);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 p-2 border border-border rounded-t-md bg-background">
        <div className="flex items-center gap-1 border-r border-border pr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => toggleFormat('strong')}
            className="h-8 w-8 p-0 hover:bg-accent"
            disabled={disabled}
          >
            <Bold className="h-4 w-4 text-foreground" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => toggleFormat('em')}
            className="h-8 w-8 p-0 hover:bg-accent"
            disabled={disabled}
          >
            <Italic className="h-4 w-4 text-foreground" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r border-border pr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setBlockType(mySchema.nodes.ordered_list)(viewRef.current?.state, viewRef.current?.dispatch)}
            className="h-8 w-8 p-0 hover:bg-accent"
            disabled={disabled}
          >
            <ListOrdered className="h-4 w-4 text-foreground" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setBlockType(mySchema.nodes.bullet_list)(viewRef.current?.state, viewRef.current?.dispatch)}
            className="h-8 w-8 p-0 hover:bg-accent"
            disabled={disabled}
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
            className="h-8 w-8 p-0 hover:bg-accent"
            disabled={disabled}
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
                disabled={disabled}
              >
                <Zap className="h-4 w-4 text-foreground" />
                <span>Variables</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {variables.map((variable) => (
                <DropdownMenuItem 
                  key={variable.value}
                  onClick={() => insertVariable(variable.value)}
                >
                  {variable.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div 
        ref={editorRef}
        className="w-full border border-t-0 border-border rounded-b-md min-h-[150px] p-3 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      />
    </div>
  );
}