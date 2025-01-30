import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

export default function Enrichment() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const processCSV = async (content: string) => {
    try {
      // Simple CSV parsing (you might want to use a library for more robust parsing)
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, i) => {
          obj[header] = values[i]?.trim();
          return obj;
        }, {} as Record<string, string>);
      });

      return rows;
    } catch (error) {
      console.error('Error processing CSV:', error);
      throw new Error('Invalid CSV format');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    
    try {
      // Read and process the CSV file
      const content = await file.text();
      const processedData = await processCSV(content);

      // Store the upload in user_uploaded_leads
      const { data: uploadData, error: uploadError } = await supabase
        .from('user_uploaded_leads')
        .insert({
          original_filename: file.name,
          raw_data: processedData,
        })
        .select()
        .single();

      if (uploadError) throw uploadError;

      setProgress(50);

      // Start processing the data
      const { data: processedResult, error: processError } = await supabase
        .functions.invoke('process-investor-leads', {
          body: { uploadId: uploadData.id }
        });

      if (processError) throw processError;

      setProgress(100);
      
      toast({
        title: "Processing Complete",
        description: `Matched ${processedResult.matchedCount} out of ${processedResult.totalRows} investors`,
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error Processing File",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setFile(null);
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 2000);
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
              disabled={isProcessing}
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

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Processing your file... This may take a few minutes.
              </p>
            </div>
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