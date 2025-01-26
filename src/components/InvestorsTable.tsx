import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { investors, Investor } from "@/data/investors";

export function InvestorsTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvestors = investors.filter((investor) =>
    investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.investmentFocus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mb-6">
        <Input
          placeholder="Search investors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Investment Focus</TableHead>
              <TableHead>Min. Investment</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Portfolio Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvestors.map((investor) => (
              <TableRow key={investor.id}>
                <TableCell className="font-medium">{investor.name}</TableCell>
                <TableCell>{investor.company}</TableCell>
                <TableCell>{investor.investmentFocus}</TableCell>
                <TableCell>{investor.minimumInvestment}</TableCell>
                <TableCell>{investor.location}</TableCell>
                <TableCell>{investor.portfolio} companies</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}