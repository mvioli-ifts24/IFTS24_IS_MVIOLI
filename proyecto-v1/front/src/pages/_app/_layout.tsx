import Navbar from "@/components/navbar";
import { getAuth } from "@/lib/auth";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AppLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (getAuth().error) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex flex-col space-y-6 flex-grow">
      <Navbar />
      <div className="flex flex-grow justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
