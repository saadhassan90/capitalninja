import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, Database } from "lucide-react";

interface StatsCardsProps {
  listsCount: number | null;
  investorsCount: number | null;
}

export const StatsCards = ({ listsCount, investorsCount }: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Lists</CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{listsCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{investorsCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};