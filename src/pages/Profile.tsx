import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { UserDetailsSection } from "@/components/profile/UserDetailsSection";
import { useBeforeUnload, useBlocker } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Form state
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

  // Initial data from query
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      
      // Set all form fields with initial data
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

  // Check for unsaved changes by comparing current form values with initial data
  useEffect(() => {
    if (!profile) return;

    const hasChanges = 
      companyName !== (profile.company_name || "") ||
      companyDescription !== (profile.company_description || "") ||
      companyWebsite !== (profile.company_website || "") ||
      raisingAmount !== (profile.raising_amount?.toString() || "") ||
      raisingDescription !== (profile.raising_description || "") ||
      raisingStage !== (profile.raising_stage || "") ||
      firstName !== (profile.first_name || "") ||
      lastName !== (profile.last_name || "") ||
      title !== (profile.title || "") ||
      phone !== (profile.phone || "") ||
      linkedinUrl !== (profile.linkedin_url || "") ||
      location !== (profile.location || "") ||
      bio !== (profile.bio || "");

    setHasUnsavedChanges(hasChanges);
  }, [
    profile,
    companyName,
    companyDescription,
    companyWebsite,
    raisingAmount,
    raisingDescription,
    raisingStage,
    firstName,
    lastName,
    title,
    phone,
    linkedinUrl,
    location,
    bio,
  ]);

  // Block navigation if there are unsaved changes
  useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  // Show browser warning when closing/refreshing with unsaved changes
  useBeforeUnload(
    (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    }
  );

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

      setHasUnsavedChanges(false);
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
        {hasUnsavedChanges && (
          <div className="text-yellow-500 font-medium">
            You have unsaved changes
          </div>
        )}
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

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Company Details</h2>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyDescription">Company Description</Label>
              <Textarea
                id="companyDescription"
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input
                id="companyWebsite"
                type="url"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Raising Capital</h2>
            
            <div className="space-y-2">
              <Label htmlFor="raisingAmount">Target Amount ($)</Label>
              <Input
                id="raisingAmount"
                type="number"
                value={raisingAmount}
                onChange={(e) => setRaisingAmount(e.target.value)}
                placeholder="e.g. 1000000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="raisingStage">Stage</Label>
              <Input
                id="raisingStage"
                value={raisingStage}
                onChange={(e) => setRaisingStage(e.target.value)}
                placeholder="e.g. Seed, Series A, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="raisingDescription">Description</Label>
              <Textarea
                id="raisingDescription"
                value={raisingDescription}
                onChange={(e) => setRaisingDescription(e.target.value)}
                rows={4}
                placeholder="Describe your fundraising goals and plans..."
              />
            </div>
          </div>

          <Button type="submit">
            {hasUnsavedChanges ? "Save Changes" : "Update Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
