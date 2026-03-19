import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const NonAppLayout = () => {
  return (
    <>
      <div className="h-fit">
        <Link to="/">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4" />
            Inicio
          </Button>
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center flex-grow">
        <Outlet />
      </div>
    </>
  );
};

export default NonAppLayout;
