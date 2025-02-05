import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function CampaignForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { listId, raiseId } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const { data: raise } = useQuery({
    queryKey: ["raise", raiseId],
    queryFn: async () => {
      if (!raiseId) return null;
      const { data, error } = await supabase
        .from("raises")
        .select("*")
        .eq("id", raiseId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!raiseId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("campaigns").insert({
        name,
        subject,
        content,
        source_list_id: listId,
        raise_id: raiseId,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;

      toast.success("Campaign created successfully");
      navigate("/outreach");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {raise && (
        <div className="bg-muted p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-2">Campaign for raise: {raise.name}</h3>
          <p className="text-sm text-muted-foreground">{raise.description}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Email Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Email Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="min-h-[200px]"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/outreach")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Campaign"}
        </Button>
      </div>
    </form>
  );
}