
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ShoppingCart, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AddDomainDialog } from "@/components/emails/AddDomainDialog";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AddEmail() {
  const navigate = useNavigate();
  const [addDomainOpen, setAddDomainOpen] = useState(false);

  return (
    <div className="py-6 space-y-6">
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
            <BreadcrumbLink href="/emails" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Emails
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Email</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Email</h1>
          <p className="text-muted-foreground">
            Choose how you want to set up your email
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/emails")}>
          Back to Emails
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Existing Domain</CardTitle>
            <CardDescription>
              Use your own domain to send emails. You'll need to verify ownership and configure DNS records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Perfect if you already have a domain and want to use it for sending emails.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setAddDomainOpen(true)}>
              <Mail className="w-4 h-4 mr-2" />
              Add Domain
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Done For You</CardTitle>
            <CardDescription>
              We'll handle everything - from domain purchase to email setup and warming.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The easiest way to get started. We'll take care of all the technical details.
            </p>
          </CardContent>
          <CardFooter>
            <Button disabled variant="secondary">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>

      <AddDomainDialog 
        open={addDomainOpen} 
        onOpenChange={setAddDomainOpen}
        onDomainAdded={() => navigate("/emails")}
      />
    </div>
  );
}
