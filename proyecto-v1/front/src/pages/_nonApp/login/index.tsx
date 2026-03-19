import Form from "./form";
import { Separator } from "@/components/ui/separator";
import Register from "./register";
import { useNavigate } from "react-router-dom";
import { getAuth } from "@/lib/auth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gamepad2 } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getAuth().token) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="flex flex-grow items-center justify-center flex-col">
      <div className="flex flex-col w-80 space-y-6">
        <Form />
        <Separator />
        <Register />
        <Button variant="secondary" onClick={() => navigate("/about")}>
          Sobre GAMING CENTER <Gamepad2 />
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
