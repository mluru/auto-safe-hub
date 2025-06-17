
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, DollarSign, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { getStatusColor, formatCurrency, isRenewalDue } from "@/utils/policyUtils";

interface PolicyCardProps {
  policy: any;
}

const PolicyCard = ({ policy }: PolicyCardProps) => {
  // Safely cast JSONB fields
  const vehicleInfo = policy.vehicle_info as { chassis_number?: string } | null;
  const ownerInfo = policy.owner_info as { name?: string; email?: string; phone?: string } | null;

  return (
    <Card className="border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              {policy.vehicle_year} {policy.vehicle_make} {policy.vehicle_model}
            </CardTitle>
            <CardDescription>
              Policy Number: {policy.policy_number}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(policy.status)}>
              {policy.status.toUpperCase()}
            </Badge>
            {isRenewalDue(policy.expiry_date) && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Renewal Due
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Registration:</span>
                <p className="font-medium">{policy.vehicle_reg_number}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Make & Model:</span>
                <p className="font-medium">{policy.vehicle_make} {policy.vehicle_model}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Year:</span>
                <p className="font-medium">{policy.vehicle_year}</p>
              </div>
              {vehicleInfo?.chassis_number && (
                <div>
                  <span className="text-muted-foreground">Chassis:</span>
                  <p className="font-medium font-mono text-xs">{vehicleInfo.chassis_number}</p>
                </div>
              )}
            </div>
          </div>

          {/* Policy Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Policy Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Start Date:</span>
                <p className="font-medium">{policy.start_date}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Expiry Date:</span>
                <p className="font-medium">{policy.expiry_date}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Premium:</span>
                <p className="font-medium text-lg">{formatCurrency(policy.premium)}</p>
              </div>
              {policy.renewable && (
                <div>
                  <span className="text-muted-foreground">Renewable:</span>
                  <p className="font-medium text-green-600">Yes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Owner Information */}
        {ownerInfo && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Owner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {ownerInfo.name && (
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium">{ownerInfo.name}</p>
                </div>
              )}
              {ownerInfo.email && (
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{ownerInfo.email}</p>
                </div>
              )}
              {ownerInfo.phone && (
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium">{ownerInfo.phone}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Download Policy
          </Button>
          
          {(isRenewalDue(policy.expiry_date) || policy.status === 'expired') && policy.renewable ? (
            <Button variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
              <Calendar className="h-4 w-4 mr-2" />
              Renew Policy
            </Button>
          ) : (
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Renewal
            </Button>
          )}
          
          <Button variant="outline" asChild>
            <Link to="/my/claims">
              <DollarSign className="h-4 w-4 mr-2" />
              File Claim
            </Link>
          </Button>
          
          <Button variant="outline">
            Update Information
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyCard;
