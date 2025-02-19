
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useStaticLists() {
  return useQuery({
    queryKey: ["static-lists"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("lists")
        .select("*")
        .eq("type", "static")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}
