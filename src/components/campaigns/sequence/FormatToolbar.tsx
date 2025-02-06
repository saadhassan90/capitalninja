import { Editor } from '@tiptap/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BasicFormatButtons } from "./toolbar/BasicFormatButtons";
import { TextStyleControls } from "./toolbar/TextStyleControls";
import { ListControls } from "./toolbar/ListControls";
import { VariableMenu } from "./toolbar/VariableMenu";

interface FormatToolbarProps {
  editor: Editor | null;
  onInsertVariable: (variable: string) => void;
}

export function FormatToolbar({ editor, onInsertVariable }: FormatToolbarProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!editor) {
    return null;
  }

  const handleLinkSubmit = () => {
    if (linkUrl) {
      if (editor.state.selection.empty) {
        editor.chain().focus().insertContent({
          type: 'text',
          text: linkUrl,
          marks: [{ type: 'link', attrs: { href: linkUrl } }],
        }).run();
      } else {
        editor.chain().focus().toggleLink({ href: linkUrl }).run();
      }
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setLinkUrl('');
    setShowLinkDialog(false);
  };

  return (
    <>
      <div className="border rounded-md bg-muted/50 p-2 mb-4 flex flex-wrap gap-2">
        <BasicFormatButtons editor={editor} />
        <div className="w-px h-8 bg-border" />
        <TextStyleControls editor={editor} />
        <div className="w-px h-8 bg-border" />
        <ListControls editor={editor} onOpenLinkDialog={() => setShowLinkDialog(true)} />
        <div className="w-px h-8 bg-border" />
        <VariableMenu onInsertVariable={onInsertVariable} />
      </div>

      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkSubmit}>
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}