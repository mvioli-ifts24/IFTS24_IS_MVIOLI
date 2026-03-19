import { useNavigate } from "react-router-dom";
import Form from "./form";
import { useEffect } from "react";
import { getAuth } from "@/lib/auth";

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getAuth().token) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="w-80">
      <Form />
    </div>
  );
};

export default RegisterPage;
