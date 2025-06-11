
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Upload, FileText, Car, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Claims = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({
    policyId: "",
    accidentDate: "",
    description: "",
    policeReportNumber: ""
  });

  const claims = [
    {
      id: "CLM-001",
      policyNumber: "MI-2024-001234",
      vehicle: "Toyota Camry 2022",
      description: "Minor fender bender",
      status: "under_review",
      submittedDate: "2024-06-01",
      estimatedAmount: 2500,
      accidentDate: "2024-05-28"
    },
    {
      id: "CLM-002",
      policyNumber: "MI-2024-005678",
      vehicle: "Honda Civic 2021",
      description: "Windshield replacement",
      status: "approved",
      submittedDate: "2024-05-15",
      estimatedAmount: 450,
      accidentDate: "2024-05-10"
    }
  ];

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
    console.log("Submitting claim:", formData);
    // This will be connected to Supabase later
  };

  if (activeTab === "new") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setActiveTab("list")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Claims
              </Button>
              <div className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">SecureMotor</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>File New Claim</CardTitle>
                <CardDescription>
                  Submit a new motor insurance claim. Please provide all required information and documentation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    
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
                        <option value="POL-001">MI-2024-001234 - Toyota Camry 2022</option>
                        <option value="POL-002">MI-2024-005678 - Honda Civic 2021</option>
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

                    <div>
                      <Label htmlFor="policeReport">Police Report Number (if applicable)</Label>
                      <Input
                        id="policeReport"
                        placeholder="Enter police report number"
                        value={formData.policeReportNumber}
                        onChange={(e) => handleInputChange("policeReportNumber", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Required Documents</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <Label className="block text-sm font-medium mb-2">Police Report</Label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="policeReportFile"
                          />
                          <label htmlFor="policeReportFile" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm">
                              Upload File
                            </Button>
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG only</p>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <Label className="block text-sm font-medium mb-2">Repair Quotations</Label>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="quotationsFile"
                          />
                          <label htmlFor="quotationsFile" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm">
                              Upload Files
                            </Button>
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">Multiple files allowed</p>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <Label className="block text-sm font-medium mb-2">ID Card</Label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="idCardFile"
                          />
                          <label htmlFor="idCardFile" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm">
                              Upload File
                            </Button>
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">Vehicle owner's ID</p>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <Label className="block text-sm font-medium mb-2">Driver's License</Label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            id="licenseFile"
                          />
                          <label htmlFor="licenseFile" className="cursor-pointer">
                            <Button type="button" variant="outline" size="sm">
                              Upload File
                            </Button>
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">Driver's license copy</p>
                        </div>
                      </Card>
                    </div>
                  </div>

                  {/* Vehicle Photos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Vehicle Photos</h3>
                    <p className="text-sm text-muted-foreground">
                      Please upload photos of your vehicle showing the damage and all four sides of the vehicle.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["Front", "Back", "Left Side", "Right Side"].map((side) => (
                        <Card key={side} className="p-4">
                          <div className="text-center">
                            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <Label className="block text-xs font-medium mb-2">{side}</Label>
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png"
                              className="hidden"
                              id={`vehicle${side.replace(" ", "")}File`}
                            />
                            <label htmlFor={`vehicle${side.replace(" ", "")}File`} className="cursor-pointer">
                              <Button type="button" variant="outline" size="sm">
                                Upload
                              </Button>
                            </label>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Card className="p-4">
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <Label className="block text-sm font-medium mb-2">Damage Photos</Label>
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png"
                          className="hidden"
                          id="damagePhotosFile"
                        />
                        <label htmlFor="damagePhotosFile" className="cursor-pointer">
                          <Button type="button" variant="outline">
                            Upload Multiple Photos
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">Upload all damage photos</p>
                      </div>
                    </Card>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                      Submit Claim
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
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Car className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">SecureMotor</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button onClick={() => setActiveTab("new")}>
                <FileText className="h-4 w-4 mr-2" />
                File New Claim
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Claims Management</h2>
          <p className="text-muted-foreground">Track and manage your insurance claims.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Claims</CardTitle>
            <CardDescription>All submitted claims and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {claims.map((claim) => (
                <Card key={claim.id} className="border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-lg">{claim.description}</h3>
                        <p className="text-sm text-muted-foreground">
                          Claim ID: {claim.id} • Policy: {claim.policyNumber}
                        </p>
                      </div>
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status.replace("_", " ")}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Vehicle:</span>
                        <p className="font-medium">{claim.vehicle}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Accident Date:</span>
                        <p className="font-medium">{claim.accidentDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Submitted:</span>
                        <p className="font-medium">{claim.submittedDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Estimated Amount:</span>
                        <p className="font-medium">${claim.estimatedAmount}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Upload Additional Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Claims;
