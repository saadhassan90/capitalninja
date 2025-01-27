import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { MagicLinkForm, SignupFormData } from "@/components/auth/MagicLinkForm";
import { TestLoginButton } from "@/components/auth/TestLoginButton";
import { AuthPageHeader } from "@/components/auth/AuthPageHeader";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent, formData: SignupFormData) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, send the magic link
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });
      
      if (otpError) throw otpError;

      // Update profile with additional information
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          company_name: formData.company,
          title: formData.title,
        })
        .eq("email", email);
      
      if (profileError) throw profileError;
      
      toast({
        title: "Success",
        description: "Check your email for the magic link to complete your signup.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Check your email for the magic link to sign in.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: "saadhassan90@gmail.com",
        password: "test123456",
      });

      if (error) throw error;
      
      toast({
        title: "Test login successful",
        description: "You are now logged in with the test account.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 text-primary-foreground">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6">
            Connect with the Right Investors
          </h1>
          <p className="text-xl opacity-90 mb-12">
            CapitalNinja helps you find and connect with investors that match your needs. 
            Save time and make better investment decisions with our powerful platform.
          </p>
          
          {/* Testimonial */}
          <div className="bg-primary-foreground/10 p-6 rounded-lg">
            <p className="italic mb-4">
              "CapitalNinja has transformed how we connect with investors. The platform's 
              efficiency and accuracy in matching us with the right investors has been invaluable."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20" />
              <div>
                <p className="font-medium">Sarah Chen</p>
                <p className="text-sm opacity-80">Founder, TechVentures</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 flex flex-col">
        <AuthPageHeader />
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            <AuthHeader />

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <MagicLinkForm
                  type="signin"
                  email={email}
                  loading={loading}
                  onEmailChange={setEmail}
                  onSubmit={handleSignIn}
                />
              </TabsContent>
              
              <TabsContent value="signup">
                <MagicLinkForm
                  type="signup"
                  email={email}
                  loading={loading}
                  onEmailChange={setEmail}
                  onSubmit={handleSignUp}
                />
              </TabsContent>
            </Tabs>

            <TestLoginButton loading={loading} onClick={handleTestLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}