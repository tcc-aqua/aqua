
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
export const NavMenu = ({ orientation = "horizontal", ...props }) => (
  <NavigationMenu {...props}>
   <NavigationMenuList
  className={`container mx-auto gap-5 space-x-0 ${
    orientation === 'vertical' ? "flex flex-col items-start justify-start" : ""
  }`}
>
  <NavigationMenuItem>
    <NavigationMenuLink asChild>
      <Link href="#">Home</Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
  {orientation === 'vertical' && <Separator className="block w-full md:w-60 sm:w-45" />}
  <NavigationMenuItem>
    <NavigationMenuLink asChild>
      <Link href="#">Sobre nós</Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
  {orientation === 'vertical' && <Separator className="block w-full md:w-60"  />}
  <NavigationMenuItem>
    <NavigationMenuLink asChild>
      <Link href="#">Planos</Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
  {orientation === 'vertical' && <Separator className="block w-full md:w-60" />}
  <NavigationMenuItem>
    <NavigationMenuLink asChild>
      <Link href="#">Fale conosco</Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
   {orientation === 'vertical' && <Separator className="block w-full md:w-60" />}
</NavigationMenuList>
  </NavigationMenu>
);
