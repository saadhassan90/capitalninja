import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { MagicLinkForm, SignupFormData } from "@/components/auth/MagicLinkForm";
import { TestLoginButton } from "@/components/auth/TestLoginButton";
import { AuthPageHeader } from "@/components/auth/AuthPageHeader";
import { BackgroundElements } from "@/components/auth/BackgroundElements";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent, formData: SignupFormData) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });
      
      if (signUpError) throw signUpError;

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
    <div className="relative min-h-screen bg-background">
      <BackgroundElements />
      <AuthPageHeader />
      
      <div className="container relative mx-auto pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-6 max-w-xl">
            <h1 className="text-5xl font-bold leading-tight">
              Connect with the Right
              <span className="text-primary"> Investors</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              CapitalNinja helps you find and connect with investors that match your needs. 
              Save time and make better investment decisions with our powerful platform.
            </p>
          </div>

          {/* Right Column - Auth Form */}
          <div className="bg-card rounded-xl shadow-lg p-8 space-y-8 border relative z-10">
            <AuthHeader />

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
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