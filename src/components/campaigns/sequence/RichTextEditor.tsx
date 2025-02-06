interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

export function RichTextEditor({ content, onChange, disabled }: RichTextEditorProps) {
  return (
    <div className="border rounded-md">
      <div
        contentEditable={!disabled}
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={(e) => {
          const html = e.currentTarget.innerHTML;
          onChange(html);
        }}
        className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none min-h-[150px]"
      />
    </div>
  );
}