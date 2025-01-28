import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Trash2, FileDown } from "lucide-react";

const Exports = () => {
  // Mock data for demonstration
  const exports = [
    {
      id: 1,
      name: "Q1 Investors Export",
      date: "2024-03-15",
      status: "completed",
      type: "Enriched Data",
      records: 150,
    },
    {
      id: 2,
      name: "PE Firms Analysis",
      date: "2024-03-10",
      status: "completed",
      type: "Raw Data",
      records: 75,
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-8">
        <FileDown className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exports History</h1>
          <p className="text-gray-500 mt-2">
            View and manage your data exports
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Export Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Records</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exports.map((export_) => (
              <TableRow key={export_.id}>
                <TableCell className="font-medium">{export_.name}</TableCell>
                <TableCell>{new Date(export_.date).toLocaleDateString()}</TableCell>
                <TableCell>{export_.type}</TableCell>
                <TableCell>{export_.records}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {export_.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Exports;