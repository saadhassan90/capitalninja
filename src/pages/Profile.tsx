import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { UserDetailsSection } from "@/components/profile/UserDetailsSection";
import { CompanyDetailsSection } from "@/components/profile/CompanyDetailsSection";
import { FundraisingSection } from "@/components/profile/FundraisingSection";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState(user?.email || "");
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [raisingAmount, setRaisingAmount] = useState("");
  const [raisingDescription, setRaisingDescription] = useState("");
  const [raisingStage, setRaisingStage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      
      setCompanyName(data.company_name || "");
      setCompanyDescription(data.company_description || "");
      setCompanyWebsite(data.company_website || "");
      setRaisingAmount(data.raising_amount?.toString() || "");
      setRaisingDescription(data.raising_description || "");
      setRaisingStage(data.raising_stage || "");
      setAvatarUrl(data.avatar_url);
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setTitle(data.title || "");
      setPhone(data.phone || "");
      setLinkedinUrl(data.linkedin_url || "");
      setLocation(data.location || "");
      setBio(data.bio || "");
      
      return data;
    },
    enabled: !!user?.id,
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          email,
          company_name: companyName,
          company_description: companyDescription,
          company_website: companyWebsite,
          raising_amount: raisingAmount ? parseInt(raisingAmount) : null,
          raising_description: raisingDescription,
          raising_stage: raisingStage,
          first_name: firstName,
          last_name: lastName,
          title,
          phone,
          linkedin_url: linkedinUrl,
          location,
          bio,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpdate = async (url: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", user.id);

      if (error) throw error;
      setAvatarUrl(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar URL.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex-1 space-y-4 p-8 pt-6">Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-8">
          <AvatarUpload
            currentAvatarUrl={avatarUrl}
            userId={user?.id || ""}
            onAvatarUpdate={handleAvatarUpdate}
          />
        </div>

        <form onSubmit={handleUpdateProfile} className="rounded-lg border bg-card p-8 space-y-8">
          <UserDetailsSection
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            title={title}
            setTitle={setTitle}
            phone={phone}
            setPhone={setPhone}
            linkedinUrl={linkedinUrl}
            setLinkedinUrl={setLinkedinUrl}
            location={location}
            setLocation={setLocation}
            bio={bio}
            setBio={setBio}
          />

          <CompanyDetailsSection
            companyName={companyName}
            setCompanyName={setCompanyName}
            companyDescription={companyDescription}
            setCompanyDescription={setCompanyDescription}
            companyWebsite={companyWebsite}
            setCompanyWebsite={setCompanyWebsite}
          />

          <FundraisingSection
            raisingAmount={raisingAmount}
            setRaisingAmount={setRaisingAmount}
            raisingStage={raisingStage}
            setRaisingStage={setRaisingStage}
            raisingDescription={raisingDescription}
            setRaisingDescription={setRaisingDescription}
          />

          <Button type="submit">Update Profile</Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;