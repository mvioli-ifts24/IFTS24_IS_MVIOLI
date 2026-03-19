import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { getAuth } from "@/lib/auth";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { data } = getAuth();

  const ITEMS = [
    { url: "/", label: "Inicio" },
    { url: "/profile", label: "Perfil" },
    data?.is_admin
      ? { url: "/helper", label: "Ayudar" }
      : { url: "/help", label: "Ayuda" },
    { url: "/about", label: "Sobre" },
  ];

  return (
    <NavigationMenu className="shadow-lg p-2 rounded sticky top-4 bg-background">
      <NavigationMenuList>
        {ITEMS.map((item) => (
          <NavigationMenuItem key={item.label}>
            <Link to={item.url} className={navigationMenuTriggerStyle()}>
              {item.label}
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
