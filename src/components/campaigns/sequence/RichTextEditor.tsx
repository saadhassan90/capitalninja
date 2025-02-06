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

const CustomToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-link" />
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
    </span>
    <span className="ql-formats">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 -mt-1">
            <Variable className="h-4 w-4" />
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
  return (
    <div className="relative w-full h-full">
      <CustomToolbar />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        readOnly={disabled}
        className="w-full [&_.ql-container]:border [&_.ql-container]:border-border [&_.ql-toolbar]:border [&_.ql-toolbar]:border-border [&_.ql-editor]:min-h-[150px]"
      />
    </div>
  );
}