import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <Link to="/register">
      <Button variant={"ghost"} className="w-full">
        Registrarse
      </Button>
    </Link>
  );
};

export default Register;
