import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  email: string;
  company_name: string | null;
  company_description: string | null;
  company_website: string | null;
  raising_amount: number | null;
  raising_description: string | null;
  raising_stage: string | null;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  phone: string | null;
  linkedin_url: string | null;
  location: string | null;
  bio: string | null;
  avatar_url?: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      console.log("Fetching profile for user:", user?.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Fetched profile data:", data);
      return data;
    },
    enabled: !!user?.id,
  });

  const updateProfile = useMutation({
    mutationFn: async (profileData: Partial<ProfileData>) => {
      if (!user?.id) {
        throw new Error("No user ID available");
      }

      console.log("Updating profile with data:", profileData);
      
      // Clean up the data before sending to Supabase
      const cleanedData = Object.fromEntries(
        Object.entries(profileData).map(([key, value]) => [
          key,
          // Convert empty strings to null
          value === "" ? null : value
        ])
      );

      console.log("Cleaned profile data:", cleanedData);

      const { data, error } = await supabase
        .from("profiles")
        .update(cleanedData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      console.log("Profile update response:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateAvatar = async (url: string) => {
    if (!user) return;
    
    try {
      console.log("Updating avatar URL:", url);
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", user.id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Success",
        description: "Avatar updated successfully.",
      });
    } catch (error) {
      console.error("Avatar update error:", error);
      toast({
        title: "Error",
        description: "Failed to update avatar.",
        variant: "destructive",
      });
    }
  };

  return {
    profile,
    isLoading,
    updateProfile,
    updateAvatar,
  };
}