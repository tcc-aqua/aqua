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
      <SheetContent className=" px-6 py-5">

        <Logo />



        <NavMenu orientation="vertical" className="mt-6 [&>div]:h-full ml-30 md:ml-0 boder shadow-accent-foreground " />

        <div className="container mx-auto mt-8 border rounded-xl p-2 w-100 flex items-center justify-center gap-10">
          <h1 className="font-bold whitespace-nowrap">Escolher modo</h1>
          <ModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
};
