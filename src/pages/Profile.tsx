import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { UserDetailsSection } from "@/components/profile/UserDetailsSection";
import { CompanyDetailsSection } from "@/components/profile/CompanyDetailsSection";
import { FundraisingSection } from "@/components/profile/FundraisingSection";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/components/AuthProvider";

const Profile = () => {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile, updateAvatar } = useProfile();
  
  const [email, setEmail] = useState("");
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

  useEffect(() => {
    if (profile) {
      setEmail(user?.email || "");
      setCompanyName(profile.company_name || "");
      setCompanyDescription(profile.company_description || "");
      setCompanyWebsite(profile.company_website || "");
      setRaisingAmount(profile.raising_amount?.toString() || "");
      setRaisingDescription(profile.raising_description || "");
      setRaisingStage(profile.raising_stage || "");
      setAvatarUrl(profile.avatar_url);
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setTitle(profile.title || "");
      setPhone(profile.phone || "");
      setLinkedinUrl(profile.linkedin_url || "");
      setLocation(profile.location || "");
      setBio(profile.bio || "");
    }
  }, [profile, user?.email]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const profileData = {
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
    };

    console.log("Submitting profile update:", profileData);
    updateProfile.mutate(profileData);
  };

  const handleAvatarUpdate = async (url: string) => {
    setAvatarUrl(url);
    await updateAvatar(url);
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