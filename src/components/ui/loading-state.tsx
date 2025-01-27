import { LoadingSpinner } from "./loading-spinner";

interface LoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
}

export function LoadingState({ loading, children }: LoadingStateProps) {
  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}