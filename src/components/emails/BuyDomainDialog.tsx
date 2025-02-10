
import { useState } from "react";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface BuyDomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDomainPurchased?: () => void;
}

export function BuyDomainDialog({ open, onOpenChange, onDomainPurchased }: BuyDomainDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here we would integrate with a domain provider API
      // For now, show a placeholder message
      toast({
        title: "Coming Soon",
        description: "Domain purchasing will be available soon!",
      });
    } catch (error) {
      console.error("Error searching domains:", error);
      toast({
        title: "Error",
        description: "Failed to search domains. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy Domain</DialogTitle>
          <DialogDescription>
            Search for available domains to purchase and use with your email campaigns.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSearch}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="search">Search Domains</Label>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Enter domain name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search Domains"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
