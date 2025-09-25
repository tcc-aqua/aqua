
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
export const NavMenu = (props) => (
  <NavigationMenu {...props}>
    <NavigationMenuList
      className=" gap-5 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">

      <NavigationMenuItem>
        <NavigationMenuLink asChild >
          <Link href="#">Home</Link>
        </NavigationMenuLink>

      </NavigationMenuItem>
      <Separator className="md:hidden w-100" />
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="#">Sobre nós</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <Separator className="md:hidden w-100" />
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="#">Planos</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <Separator className="md:hidden w-100" />
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link href="#">Fale conosco</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <Separator className="md:hidden w-100" />
    </NavigationMenuList>
  </NavigationMenu>
);
