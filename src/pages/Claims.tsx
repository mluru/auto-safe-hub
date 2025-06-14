
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, ArrowLeft } from "lucide-react";
import { useClaims, useCreateClaim } from "@/hooks/useClaims";
import { usePolicies } from "@/hooks/usePolicies";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";

const Claims = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({
    policyId: "",
    accidentDate: "",
    description: ""
  });

  const { data: claims, isLoading: claimsLoading } = useClaims();
  const { data: policies } = usePolicies();
  const createClaimMutation = useCreateClaim();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-blue-100 text-blue-800";
      case "under_review": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createClaimMutation.mutate({
      policy_id: formData.policyId,
      accident_date: formData.accidentDate,
      description: formData.description,
    }, {
      onSuccess: () => {
        toast.success("Claim submitted successfully!");
        setActiveTab("list");
        setFormData({ policyId: "", accidentDate: "", description: "" });
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to submit claim");
      }
    });
  };

  if (activeTab === "new") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Button variant="ghost" onClick={() => setActiveTab("list")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Claims
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>File New Claim</CardTitle>
                <CardDescription>
                  Submit a new motor insurance claim. Please provide all required information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="policy">Select Policy</Label>
                      <select 
                        id="policy"
                        className="w-full mt-1 p-2 border border-input rounded-md"
                        value={formData.policyId}
                        onChange={(e) => handleInputChange("policyId", e.target.value)}
                        required
                      >
                        <option value="">Select a policy</option>
                        {policies?.map((policy) => (
                          <option key={policy.id} value={policy.id}>
                            {policy.policy_number} - {policy.vehicle_make} {policy.vehicle_model} {policy.vehicle_year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="accidentDate">Accident Date</Label>
                      <Input
                        id="accidentDate"
                        type="date"
                        value={formData.accidentDate}
                        onChange={(e) => handleInputChange("accidentDate", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Accident Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide a detailed description of what happened..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        required
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={createClaimMutation.isPending}
                    >
                      {createClaimMutation.isPending ? "Submitting..." : "Submit Claim"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setActiveTab("list")}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Claims Management</h2>
            <p className="text-muted-foreground">Track and manage your insurance claims.</p>
          </div>
          <Button onClick={() => setActiveTab("new")}>
            <FileText className="h-4 w-4 mr-2" />
            File New Claim
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Claims</CardTitle>
            <CardDescription>All submitted claims and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            {claimsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : claims?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No claims found. File your first claim to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {claims?.map((claim) => (
                  <Card key={claim.id} className="border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{claim.description}</h3>
                          <p className="text-sm text-muted-foreground">
                            Claim ID: {claim.claim_number} • Policy: {claim.policies?.policy_number}
                          </p>
                        </div>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status.replace("_", " ")}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Vehicle:</span>
                          <p className="font-medium">
                            {claim.policies?.vehicle_make} {claim.policies?.vehicle_model} {claim.policies?.vehicle_year}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Accident Date:</span>
                          <p className="font-medium">{new Date(claim.accident_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Submitted:</span>
                          <p className="font-medium">{new Date(claim.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Estimated Amount:</span>
                          <p className="font-medium">
                            {claim.estimated_amount ? `$${claim.estimated_amount}` : 'Pending'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Claims;
