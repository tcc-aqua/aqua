import Image from "next/image";
import { Main } from "./blocks/hero";
import Navbar04Page from "@/components/navbar-04/navbar-04";
import Features01Page from "@/components/features-01/features-01";
import Stats01Page from "@/components/stats-01/stats-01";
import Features04Page from "@/components/features-04/features-04";
import AnimatedTabsDemo from "@/components/tabs-18";
import Pricing04 from "./blocks/pricing/page";
import Footer05Page from "@/components/footer-05/footer-05";


export default function Home() {
  return (

    <>

      <div className="bg-gradient-to-b from-5% from-blue-200 to-20% to-white dark:bg-background dark:bg-none">
        <header>
          <Navbar04Page />
        </header>

        <main className="container  mx-auto">
          <Main />
        </main>

        <section>
          <Features01Page />
        </section>

        <section className="mb-15">
          <Stats01Page />
        </section>

        <section>
          <Features04Page />
        </section>

        <section className="container mx-auto flex justify-center py-20">
          <AnimatedTabsDemo />
        </section>


        <section  >
          <Pricing04 />
        </section>

        <footer>
          <Footer05Page/>
        </footer>

      </div>
    </>
  );
}
