
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
  className="mx-auto gap-5 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start sm:ml-15"
>
  <NavigationMenuItem>
    <NavigationMenuLink asChild>
      <Link href="#">Home</Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
  <Separator className="md:hidden w-80" />
  <NavigationMenuItem>
    <NavigationMenuLink asChild>
      <Link href="#">Sobre nós</Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
  <Separator className="md:hidden w-full" />
  <NavigationMenuItem>
    <NavigationMenuLink asChild>
      <Link href="#">Planos</Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
  <Separator className="md:hidden w-full" />
  <NavigationMenuItem>
    <NavigationMenuLink asChild>
      <Link href="#">Fale conosco</Link>
    </NavigationMenuLink>
  </NavigationMenuItem>
  <Separator className="md:hidden w-full" />
</NavigationMenuList>
  </NavigationMenu>
);
