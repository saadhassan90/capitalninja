
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseAddToListProps {
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useAddToList({ onSuccess, onOpenChange }: UseAddToListProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addToList = async (params: {
    selectedInvestors: string[];
    targetListId: string;
    isNewList: boolean;
    newList?: { name: string; description: string };
  }) => {
    const { selectedInvestors, targetListId, isNewList, newList } = params;

    if (selectedInvestors.length === 0) {
      toast({
        title: "No investors selected",
        description: "Please select at least one investor to add to a list.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      let finalListId = targetListId;

      if (isNewList && newList) {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error("Not authenticated");

        const { data: newListData, error: createError } = await supabase
          .from("lists")
          .insert({
            name: newList.name,
            description: newList.description,
            type: "static",
            created_by: user.user.id
          })
          .select()
          .single();

        if (createError) throw createError;
        finalListId = newListData.id;
      }

      // Since we're working with contact IDs directly now
      const listInvestors = selectedInvestors.map(contactId => ({
        list_id: finalListId,
        contact_id: contactId
      }));

      const { error: insertError } = await supabase
        .from("list_investors")
        .insert(listInvestors);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      toast({
        title: "Success",
        description: `Successfully added investors to the list`,
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error adding to list:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to add to list`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    addToList
  };
}
