import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

const Enrichment = () => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type !== "text/csv") {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement file upload and enrichment logic
    toast({
      title: "Processing file",
      description: "Your file is being processed and enriched",
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Enrich Investor Data</h1>
        <p className="text-gray-500 mt-2">
          Upload a CSV file containing investor leads to enrich it with data from our database
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button
              onClick={handleUpload}
              disabled={!file}
              className="min-w-[120px]"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
          
          {file && (
            <p className="text-sm text-gray-500">
              Selected file: {file.name}
            </p>
          )}
          
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-medium mb-2">How it works</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>1. Upload a CSV file containing investor information</li>
              <li>2. Our system will match and enrich your data with our database</li>
              <li>3. Download the enriched CSV file with additional insights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enrichment;