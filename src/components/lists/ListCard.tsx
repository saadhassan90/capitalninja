import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListInvestorsTable } from "./ListInvestorsTable";
import { ListCardMenu } from "./ListCardMenu";
import { ListEditDialog } from "./ListEditDialog";

interface List {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface ListCardProps {
  list: List;
  onDelete?: () => void;
}

export function ListCard({ list, onDelete }: ListCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{list.name}</CardTitle>
        {list.description && (
          <CardDescription>{list.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ListCardMenu 
          listId={list.id}
          listName={list.name}
          listDescription={list.description}
          onListUpdated={onDelete || (() => {})}
        />
      </CardContent>
    </Card>
  );
}
