import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const CustomToolbar = ({ isEditorFocused }: { isEditorFocused: boolean }) => (
  <div id="toolbar" className="flex items-center gap-2 p-2 border border-border rounded-t-md [&_.ql-formats]:mr-0">
    <span className="ql-formats flex gap-2">
      <Button
        variant="ghost"
        size="default"
        className="h-10 w-10 p-0 ql-bold"
        disabled={!isEditorFocused}
      />
      <Button
        variant="ghost"
        size="default"
        className="h-10 w-10 p-0 ql-italic"
        disabled={!isEditorFocused}
      />
      <Button
        variant="ghost"
        size="default"
        className="h-10 w-10 p-0 ql-underline"
        disabled={!isEditorFocused}
      />
    </span>
    <span className="ql-formats flex gap-2">
      <Button
        variant="ghost"
        size="default"
        className="h-10 w-10 p-0 ql-list"
        value="ordered"
        disabled={!isEditorFocused}
      />
      <Button
        variant="ghost"
        size="default"
        className="h-10 w-10 p-0 ql-list"
        value="bullet"
        disabled={!isEditorFocused}
      />
    </span>
    <span className="ql-formats">
      <Button
        variant="ghost"
        size="default"
        className="h-10 w-10 p-0 ql-link"
        disabled={!isEditorFocused}
      >
        <Link className="h-5 w-5" />
      </Button>
    </span>
    <span className="ql-formats ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="secondary" 
            size="default"
            className="h-10 px-3 flex items-center gap-2"
            disabled={!isEditorFocused}
          >
            <Zap className="h-5 w-5" />
            <span>Variables</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {variables.map((variable) => (
            <DropdownMenuItem 
              key={variable.value}
              onClick={() => {
                const quill = document.querySelector('.ql-editor');
                if (quill) {
                  const selection = window.getSelection();
                  const range = selection?.getRangeAt(0);
                  if (range) {
                    const span = document.createElement('span');
                    span.className = 'bg-blue-100 px-1 rounded';
                    span.textContent = variable.value;
                    range.deleteContents();
                    range.insertNode(span);
                  }
                }
              }}
            >
              {variable.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  </div>
);

const modules = {
  toolbar: {
    container: '#toolbar',
  },
};

const formats = [
  'bold',
  'italic',
  'underline',
  'link',
  'list',
  'bullet',
];

export function RichTextEditor({ content, onChange, disabled }: RichTextEditorProps) {
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  return (
    <div className="relative w-full h-full">
      <CustomToolbar isEditorFocused={isEditorFocused} />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        readOnly={disabled}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        className="w-full [&_.ql-container]:border [&_.ql-container]:border-border [&_.ql-container]:rounded-b-md [&_.ql-container]:border-t-0 [&_.ql-editor]:min-h-[150px] [&_.ql-tooltip]:!z-[9999] [&_.ql-tooltip]:!border-border [&_.ql-tooltip]:!bg-popover [&_.ql-tooltip]:!text-popover-foreground [&_.ql-tooltip]:!shadow-md [&_.ql-tooltip]:!rounded-md [&_.ql-tooltip]:!px-3 [&_.ql-tooltip]:!py-2 [&_.ql-tooltip.ql-editing]:!w-fit [&_.ql-tooltip]:!text-sm [&_.ql-tooltip_input]:!border-input [&_.ql-tooltip_input]:!bg-background [&_.ql-tooltip_input]:!h-9 [&_.ql-tooltip_input]:!rounded-md [&_.ql-tooltip_input]:!px-3 [&_.ql-tooltip_input]:!py-1 [&_.ql-tooltip_input]:!text-sm [&_.ql-tooltip_input]:!leading-none [&_.ql-tooltip_input]:!transition-colors [&_.ql-tooltip_input]:!w-[280px] [&_.ql-tooltip_input]:!mb-2 [&_.ql-tooltip_input:focus]:!outline-none [&_.ql-tooltip_input:focus]:!ring-1 [&_.ql-tooltip_input:focus]:!ring-ring [&_.ql-tooltip_a]:!text-primary [&_.ql-tooltip_a]:!no-underline [&_.ql-tooltip_a:hover]:!text-primary/80 [&_.ql-tooltip_a.ql-action]:!ml-0 [&_.ql-tooltip_a.ql-action]:!mr-2 [&_.ql-tooltip_a.ql-remove]:!ml-2 [&_.ql-tooltip_a.ql-remove]:!mr-0 [&_.ql-tooltip_a.ql-action]:!bg-primary [&_.ql-tooltip_a.ql-action]:!text-primary-foreground [&_.ql-tooltip_a.ql-action]:!px-4 [&_.ql-tooltip_a.ql-action]:!py-2 [&_.ql-tooltip_a.ql-action]:!rounded-md [&_.ql-tooltip_a.ql-action]:!text-sm [&_.ql-tooltip_a.ql-action]:!font-medium [&_.ql-tooltip_a.ql-action]:!inline-flex [&_.ql-tooltip_a.ql-action]:!items-center [&_.ql-tooltip_a.ql-action]:!justify-center [&_.ql-tooltip_a.ql-action]:!h-9 [&_.ql-tooltip_a.ql-action]:!transition-colors [&_.ql-tooltip_a.ql-action]:hover:!bg-primary/90"
      />
    </div>
  );
}