import { User } from "lucide-react";

export function ProfileHeader() {
  return (
    <div className="flex items-center gap-2 mb-8">
      <User className="h-8 w-8" />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account settings and profile information
        </p>
      </div>
    </div>
  );
}