"use client"

import Image from "next/image";
import { Main } from "./blocks/hero";
import Navbar04Page from "@/components/navbar-04/navbar-04";
import Features01Page from "@/app/blocks/problema/features-01";
import Stats01Page from "@/components/stats-01/stats-01";
import Features04Page from "@/app/blocks/solucao/features-04";
import AnimatedTabsDemo from "@/app/blocks/beneficios/tabs-18";
import Pricing04 from "./blocks/pricing/page";

import Footer05Page from "@/components/footer-05/footer-05";
import Contact02Page from "@/app/blocks/contact-02/contact-02";
import { motion } from "framer-motion";

export default function Home() {
  return (

    <>

      <div className="bg-gradient-to-b from-5% from-blue-200 to-15% to-white dark:bg-[#032a43] dark:bg-none">
        <header>
          <Navbar04Page />
        </header>

        <main className="container  mx-auto" id="home">

          <Main />
        </main>

        <section>
        <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-20 lg:py-12"
        id="sobre"
        >
          <Features01Page />
          </motion.section>
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


        <section id="planos" >
          <Pricing04 />
        </section>

        <section id="contato">
          <Contact02Page />
        </section>

        <footer>
          <Footer05Page />
        </footer>

      </div>
    </>
  );
}
