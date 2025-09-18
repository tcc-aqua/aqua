import Image from "next/image";
import { Main } from "./blocks/hero";
import Navbar04Page from "@/components/navbar-04/navbar-04";
import Features01Page from "@/components/features-01/features-01";
import Stats01Page from "@/components/stats-01/stats-01";

export default function Home() {
  return (

    <>

      <header>
        <Navbar04Page />
      </header>

      <div className="container bg-white mx-auto">
        <Main />
      </div>
      <Features01Page />
      <Stats01Page />
    </>
  );
}
