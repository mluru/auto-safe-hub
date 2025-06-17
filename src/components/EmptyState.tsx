
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  hasExistingPolicies?: boolean;
}

const EmptyState = ({ hasExistingPolicies = false }: EmptyStateProps) => {
  if (hasExistingPolicies) {
    return (
      <Card className="mt-8 border-dashed">
        <CardContent className="p-8 text-center">
          <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Need coverage for another vehicle?</h3>
          <p className="text-muted-foreground mb-4">
            Get a quote for additional motor insurance coverage.
          </p>
          <Button asChild>
            <Link to="/products">
              <FileText className="h-4 w-4 mr-2" />
              Browse Products
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="p-8 text-center">
        <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No policies found</h3>
        <p className="text-muted-foreground mb-4">
          You don't have any insurance policies yet. Browse our products to get started.
        </p>
        <Button asChild>
          <Link to="/products">
            <FileText className="h-4 w-4 mr-2" />
            Browse Insurance Products
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
