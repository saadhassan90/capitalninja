import { useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RaiseCard } from "@/components/raise/RaiseCard";

// Temporary mock data - will be replaced with actual data from Supabase
const mockProjects = [
  {
    id: "1",
    name: "Series A Fundraising",
    description: "Raising capital for expansion into new markets",
    target_amount: 5000000,
    created_at: "2024-01-15T10:00:00Z",
    status: "active",
  },
  {
    id: "2",
    name: "Seed Round",
    description: "Initial fundraising for product development",
    target_amount: 1000000,
    created_at: "2024-02-01T15:30:00Z",
    status: "draft",
  },
];

const Raise = () => {
  const [projects, setProjects] = useState(mockProjects);

  const handleDelete = (deletedProjectId: string) => {
    setProjects(currentProjects => 
      currentProjects.filter(project => project.id !== deletedProjectId)
    );
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Briefcase className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Raise</h1>
            <p className="text-muted-foreground mt-2">
              Manage your fundraising projects and track progress
            </p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <RaiseCard 
            key={project.id} 
            project={project}
            onDelete={() => handleDelete(project.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Raise;