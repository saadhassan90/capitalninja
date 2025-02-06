import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Variable } from 'lucide-react';
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
  <div id="toolbar" className="flex items-center gap-1 p-2 border border-border rounded-t-md [&_.ql-formats]:mr-0">
    <span className="ql-formats flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 ql-bold"
        disabled={!isEditorFocused}
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 ql-italic"
        disabled={!isEditorFocused}
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 ql-underline"
        disabled={!isEditorFocused}
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 ql-link"
        disabled={!isEditorFocused}
      />
    </span>
    <span className="ql-formats flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 ql-list"
        value="ordered"
        disabled={!isEditorFocused}
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 ql-list"
        value="bullet"
        disabled={!isEditorFocused}
      />
    </span>
    <span className="ql-formats">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 flex items-center gap-2"
            disabled={!isEditorFocused}
          >
            <Variable className="h-4 w-4" />
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
        className="w-full [&_.ql-container]:border [&_.ql-container]:border-border [&_.ql-container]:rounded-b-md [&_.ql-container]:border-t-0 [&_.ql-editor]:min-h-[150px]"
      />
    </div>
  );
}