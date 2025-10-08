import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { ModeToggle } from "../themes/botao";

const Navbar04Page = () => {
  return (
    <div className="py-6">
      <nav
        className="top-6  inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-(--breakpoint-xl) mx-auto rounded-3xl borde-black shadow-xl">
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <Logo />

          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />


          <div className="flex items-center gap-5">
            {/* ModeToggle - visível apenas em telas médias pra cima */}
            <div className="hidden md:block">
              <ModeToggle />
            </div>
            {/* 
            <Button variant="outline" className="hidden sm:inline-flex rounded-full">
              Sign In
            </Button> */}
            <Button className="rounded-full dark:bg-accent cursor-pointer">LogIn</Button>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
              
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar04Page;
