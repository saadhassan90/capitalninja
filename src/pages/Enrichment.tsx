
import { useState } from "react";
import { Sparkles, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileUploadSection } from "@/components/enrichment/FileUploadSection";
import { ProgressSection } from "@/components/enrichment/ProgressSection";
import { InstructionsSection } from "@/components/enrichment/InstructionsSection";
import { EnrichmentHistoryTable } from "@/components/enrichment/EnrichmentHistoryTable";
import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Enrichment() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [memoStatus, setMemoStatus] = useState<'idle' | 'extracting' | 'analyzing' | 'creating' | 'complete' | 'failed'>('idle');
  const { toast } = useToast();

  const { data: uploads, refetch: refetchUploads } = useQuery({
    queryKey: ['enrichment-uploads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_uploaded_leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

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

      // Refresh the uploads list after successful processing
      refetchUploads();

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

  const handleDelete = () => {
    refetchUploads();
  };

  return (
    <div className="flex-1 space-y-6 p-8">
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
            <BreadcrumbPage>Enrichment</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <Sparkles className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enrich Investor Data</h1>
          <p className="text-muted-foreground mt-1">
            Upload a CSV file containing investor leads to enrich it with data from our database
          </p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          <FileUploadSection
            file={file}
            isProcessing={isProcessing}
            memoStatus={memoStatus}
            onFileChange={handleFileChange}
            onProcess={handleUpload}
          />
          <ProgressSection
            file={file}
            isProcessing={isProcessing}
            progress={progress}
            memoStatus={memoStatus}
          />
          <InstructionsSection />
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Upload History</h2>
        <EnrichmentHistoryTable 
          uploads={uploads || []} 
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
