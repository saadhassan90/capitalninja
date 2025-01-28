import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export default function Enrichment() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      // Simulated processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically:
      // 1. Upload the file to your server
      // 2. Process the CSV
      // 3. Return enriched data
      // 4. Generate download link
      
      console.log("Processing file:", file.name);
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-8">
        <Sparkles className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enrich Investor Data</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Upload a CSV file containing investor leads to enrich it with data from our database
          </p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border">
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
              disabled={!file || isProcessing}
            >
              {isProcessing ? "Processing..." : "Upload & Process"}
            </Button>
          </div>
          
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected file: {file.name}
            </p>
          )}
          
          <div className="bg-muted/50 p-4 rounded border">
            <h3 className="font-medium mb-2">How it works</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>1. Upload a CSV file containing investor information</li>
              <li>2. Our system will match and enrich your data with our database</li>
              <li>3. Download the enriched CSV file with additional insights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}