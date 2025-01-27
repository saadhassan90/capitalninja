import { useState, useRef } from "react";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userId: string;
  onAvatarUpdate: (url: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, userId, onAvatarUpdate }: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log("File read successfully");
        setSelectedImage(reader.result as string);
        setIsOpen(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = async (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
    console.log("Starting image crop process");
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Canvas is empty');
        console.log("Image cropped successfully", { blobSize: blob.size });
        resolve(blob);
      }, 'image/jpeg', 1);
    });
  };

  const uploadAvatar = async () => {
    if (!imageRef.current || !crop) {
      console.log("Missing image reference or crop data");
      return;
    }

    try {
      console.log("Starting avatar upload process");
      const croppedImageBlob = await getCroppedImg(imageRef.current, crop);
      const filePath = `${userId}/avatar.jpg`;

      console.log("Uploading to Supabase storage", { filePath });
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedImageBlob, {
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("Upload successful", uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log("Generated public URL:", publicUrl);

      onAvatarUpdate(publicUrl);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      console.error("Error in upload process:", error);
      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentAvatarUrl || undefined} />
        <AvatarFallback>Avatar</AvatarFallback>
      </Avatar>
      <Button variant="outline" className="w-40">
        <label className="cursor-pointer w-full">
          Change Avatar
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </Button>

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
                <Button onClick={uploadAvatar}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}