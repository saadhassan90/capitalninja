
import { InvestorsTable } from "@/components/InvestorsTable";
import { Users, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Investors = () => {
  return (
    <div className="flex-1 p-8 flex flex-col h-screen">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Investors</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
