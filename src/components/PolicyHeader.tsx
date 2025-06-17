
import { Button } from "@/components/ui/button";
import { Car, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const PolicyHeader = () => {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">SecureMotor</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/products">
                <FileText className="h-4 w-4 mr-2" />
                Browse Insurance
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PolicyHeader;
