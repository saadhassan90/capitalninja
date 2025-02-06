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
    <div className="border rounded-md">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        formats={formats}
        readOnly={disabled}
        className="min-h-[150px]"
      />
    </div>
  );
}