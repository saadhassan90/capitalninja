import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AvatarUpload } from "@/components/profile/AvatarUpload";

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

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      
      // Update local state with profile data
      setCompanyName(data.company_name || "");
      setCompanyDescription(data.company_description || "");
      setCompanyWebsite(data.company_website || "");
      setRaisingAmount(data.raising_amount?.toString() || "");
      setRaisingDescription(data.raising_description || "");
      setRaisingStage(data.raising_stage || "");
      setAvatarUrl(data.avatar_url);
      
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
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>
      
      <div className="mb-8">
        <AvatarUpload
          currentAvatarUrl={avatarUrl}
          userId={user?.id || ""}
          onAvatarUpdate={handleAvatarUpdate}
        />
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Company Details</h2>
          
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
          <h2 className="text-xl font-semibold">Raising Capital</h2>
          
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

        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  );
};

export default Profile;