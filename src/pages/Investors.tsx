import { InvestorsTable } from "@/components/InvestorsTable";
import { Users } from "lucide-react";

const Investors = () => {
  return (
    <div className="flex-1 p-8 flex flex-col h-screen">
      <div className="flex items-center gap-2 mb-8">
        <Users className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investors</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Find and connect with investors</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <InvestorsTable />
      </div>
    </div>
  );
};

export default Investors;