import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileUploadSection } from "@/components/enrichment/FileUploadSection";
import { ProgressSection } from "@/components/enrichment/ProgressSection";
import { InstructionsSection } from "@/components/enrichment/InstructionsSection";

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

  const analyzeCSV = async (content: string) => {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const sampleData = lines.slice(1, 6).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, i) => {
        obj[header] = values[i]?.trim();
        return obj;
      }, {} as Record<string, string>);
    });

    const { data: analysis, error: analysisError } = await supabase
      .functions.invoke('analyze-csv-columns', {
        body: { headers, sampleData }
      });

    if (analysisError) {
      console.error('Error analyzing CSV:', analysisError);
      throw new Error('Failed to analyze CSV columns');
    }

    return analysis;
  };

  const processCSV = async (content: string) => {
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
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const content = await file.text();
      setProgress(20);
      
      const columnMapping = await analyzeCSV(content);
      setProgress(40);
      
      const processedData = await processCSV(content);

      const { data: uploadData, error: uploadError } = await supabase
        .from('user_uploaded_leads')
        .insert({
          user_id: user.id,
          original_filename: file.name,
          raw_data: processedData,
          column_mapping: columnMapping,
          total_rows: processedData.length
        })
        .select()
        .single();

      if (uploadError) throw uploadError;

      setProgress(60);

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

    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error Processing File",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setFile(null);
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
          <FileUploadSection
            file={file}
            isProcessing={isProcessing}
            onFileChange={handleFileChange}
            onUpload={handleUpload}
          />
          <ProgressSection
            file={file}
            isProcessing={isProcessing}
            progress={progress}
          />
          <InstructionsSection />
        </div>
      </div>
    </div>
  );
}