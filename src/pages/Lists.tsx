import { ListSection } from "@/components/lists/ListSection";
import { ListCheck } from "lucide-react";

const Lists = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-8">
        <ListCheck className="h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">Lists</h1>
      </div>
      <ListSection />
    </div>
  );
};

export default Lists;