import { FC } from "react";

export const AuthLeftColumn: FC = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 text-primary-foreground">
      <div className="max-w-xl mx-auto flex flex-col justify-center h-full">
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
  );
};