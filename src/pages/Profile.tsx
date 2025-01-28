import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type Crop } from 'react-image-crop';
import { getCroppedImg } from "@/utils/imageUtils";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AvatarSection } from "@/components/profile/AvatarSection";
import { PersonalInfoSection } from "@/components/profile/PersonalInfoSection";
import { CompanyInfoSection } from "@/components/profile/CompanyInfoSection";
import { AdditionalInfoSection } from "@/components/profile/AdditionalInfoSection";
import { profileFormSchema, type ProfileFormValues } from "@/types/profile";

export default function Profile() {
  const { profile, isLoading, updateProfile, updateAvatar } = useProfile();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [tempImage, setTempImage] = useState<string>();
  const [imageRef, setImageRef] = useState<HTMLImageElement>();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      title: profile?.title || "",
      company_name: profile?.company_name || "",
      company_description: profile?.company_description || "",
      company_website: profile?.company_website || "",
      linkedin_url: profile?.linkedin_url || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile.mutateAsync(data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setTempImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error handling image upload:", error);
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCropComplete = async () => {
    if (!imageRef || !crop) return;

    try {
      setUploading(true);
      const croppedImageBlob = await getCroppedImg(imageRef, crop);
      
      const filePath = `${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedImageBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateAvatar(publicUrl);
      setTempImage(undefined);
      setCrop(undefined);

      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8">
      <ProfileHeader />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AvatarSection
            profile={profile}
            uploading={uploading}
            handleImageUpload={handleImageUpload}
            handleCropComplete={handleCropComplete}
            tempImage={tempImage}
            crop={crop}
            setCrop={setCrop}
            setImageRef={setImageRef}
            setTempImage={setTempImage}
          />

          <PersonalInfoSection form={form} />
          <CompanyInfoSection form={form} />
          <AdditionalInfoSection form={form} />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}