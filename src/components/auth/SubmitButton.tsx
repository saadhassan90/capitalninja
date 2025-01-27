import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
  isFormValid: boolean;
}

export function SubmitButton({ loading, isFormValid }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full h-12 mt-6"
      disabled={loading || !isFormValid}
    >
      <Mail className="mr-2" />
      {loading ? "Sending magic link..." : "Continue with Email"}
    </Button>
  );
}