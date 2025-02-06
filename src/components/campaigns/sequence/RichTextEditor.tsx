import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'link'],
    [{ list: 'ordered' }, { list: 'bullet' }],
  ],
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
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        readOnly={disabled}
        className="w-full [&_.ql-container]:border-x [&_.ql-container]:border-b [&_.ql-container]:border-border [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:mb-2 [&_.ql-editor]:min-h-[150px]"
      />
    </div>
  );
}