import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { ModeToggle } from "../DarkMode/DarkMode";
import { Separator } from "@radix-ui/react-dropdown-menu";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="muted" size="icon" className="rounded-full">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className=" px-6 py-5 ">

        <Logo />



        <NavMenu orientation="vertical" className=" container mx-auto grid grid-cols-1 [&>div]:h-full rounded-xl  p-7 max-h-[400px] " />

        <div className="container mx-auto shadow-md rounded-xl p-2 w-80 gap-5 flex items-center justify-center md:gap-10  md:w-70 dark:border-1 mt-100">

          <h1 className="font-bold whitespace-nowrap ">Escolher modo</h1>
          <ModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
};
