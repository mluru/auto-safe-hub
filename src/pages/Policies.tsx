
import { Car } from "lucide-react";
import { usePolicies } from "@/hooks/usePolicies";
import PolicyHeader from "@/components/PolicyHeader";
import PolicyCard from "@/components/PolicyCard";
import EmptyState from "@/components/EmptyState";

const Policies = () => {
  const { data: policies, isLoading, error } = usePolicies();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your policies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Error loading policies</h3>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PolicyHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">My Policies</h2>
          <p className="text-muted-foreground">View and manage your motor insurance policies.</p>
        </div>

        <div className="space-y-6">
          {policies?.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>

        {/* Empty State */}
        {policies?.length === 0 && <EmptyState />}

        {/* Add New Policy */}
        {policies && policies.length > 0 && <EmptyState hasExistingPolicies />}
      </main>
    </div>
  );
};

export default Policies;
