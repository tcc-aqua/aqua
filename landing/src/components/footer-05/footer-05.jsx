import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
  InstagramIcon
} from "lucide-react";
import Link from "next/link";
import { Logo } from "../navbar-04/logo";

const footerLinks = [
  {
    title: "Sobre nós",
    href: "#sobre",
  },
  {
    title: "Planos",
    href: "#planos",
  },
  {
    title: "Contato",
    href: "#contato",
  },
  {
    title: "Ajuda",
    href: "#contato",
  },
  // {
  //   title: "",
  //   href: "#",
  // },
  // {
  //   title: "Privacy",
  //   href: "#",
  // },
];

const Footer05Page = () => {
  return (
    <div className=" flex flex-col">
      <div className="grow bg-muted" />
      <footer className="border-t">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="py-12 flex flex-col justify-start items-center">
            {/* Logo */}
            <Logo />

            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              {footerLinks.map(({ title, href }) => (
                <li key={title}>
                  <Link href={href} className="text-muted-foreground hover:text-accent hover:scale-99 fl">
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Separator className={'dark:bg-white'} />
          <div
            className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="/" target="_blank">
                Aqua
              </Link>
              . Todos os direitos reservados.
            </span>

            <div className="flex items-center gap-5 text-accent">
              <Link href="#" target="_blank">
                <TwitterIcon className="h-5 w-5" />
              </Link>

              <Link href="#" target="_blank">
                <InstagramIcon className="h-5 w-5" />
              </Link>
              <Link href="#" target="_blank">
                <GithubIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer05Page;