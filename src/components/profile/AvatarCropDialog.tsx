import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AvatarCropDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedImage: string | null;
  crop: Crop;
  setCrop: (crop: Crop) => void;
  imageRef: React.RefObject<HTMLImageElement>;
  onSave: () => void;
}

export function AvatarCropDialog({
  isOpen,
  setIsOpen,
  selectedImage,
  crop,
  setCrop,
  imageRef,
  onSave,
}: AvatarCropDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Avatar</DialogTitle>
        </DialogHeader>
        {selectedImage && (
          <div className="flex flex-col gap-4">
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              aspect={1}
            >
              <img
                ref={imageRef}
                src={selectedImage}
                alt="Crop preview"
                style={{ maxWidth: '100%' }}
              />
            </ReactCrop>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onSave}>
                Save
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}