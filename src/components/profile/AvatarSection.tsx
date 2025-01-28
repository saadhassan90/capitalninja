import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface AvatarSectionProps {
  profile: any;
  uploading: boolean;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCropComplete: () => Promise<void>;
  tempImage?: string;
  crop?: Crop;
  setCrop: (crop: Crop) => void;
  setImageRef: (ref: HTMLImageElement) => void;
  setTempImage: (image: string | undefined) => void;
}

export function AvatarSection({
  profile,
  uploading,
  handleImageUpload,
  handleCropComplete,
  tempImage,
  crop,
  setCrop,
  setImageRef,
  setTempImage,
}: AvatarSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="max-w-xs"
          />
        </div>

        {tempImage && (
          <div className="space-y-4">
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              aspect={1}
              circularCrop
            >
              <img
                src={tempImage}
                ref={(ref) => ref && setImageRef(ref)}
                alt="Upload preview"
                className="max-h-[400px]"
              />
            </ReactCrop>
            <div className="flex gap-4">
              <Button
                onClick={handleCropComplete}
                disabled={!crop || uploading}
              >
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Image
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTempImage(undefined);
                  setCrop(undefined);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}