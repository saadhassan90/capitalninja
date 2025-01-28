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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, DollarSign } from "lucide-react";

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
      raising_amount: profile?.raising_amount || undefined,
      raising_description: profile?.raising_description || "",
      raising_stage: profile?.raising_stage || "",
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
      
      <Tabs defaultValue="user" className="space-y-6">
        <TabsList>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            User
          </TabsTrigger>
          <TabsTrigger value="fundraising" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Fundraising
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="user" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="fundraising" className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Fundraising Information</h2>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="raising_amount">Target Amount ($)</label>
                      <input
                        type="number"
                        id="raising_amount"
                        {...form.register("raising_amount")}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="raising_stage">Stage</label>
                      <input
                        type="text"
                        id="raising_stage"
                        {...form.register("raising_stage")}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="raising_description">Description</label>
                      <textarea
                        id="raising_description"
                        {...form.register("raising_description")}
                        className="w-full p-2 border rounded"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

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
      </Tabs>
    </div>
  );
}