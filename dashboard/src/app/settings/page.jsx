"use client";

import { motion } from "framer-motion";
import { Separator } from "../../components/ui/separator"
import FotoPerfil from "@/components/ProfileImage/page";
import InputProfile from "@/components/Inputs/InputProfile";
import Inputpassword from "@/components/Inputs/InputPassword";
import ConfirmChanges from "@/components/Inputs/ConfirmChanges";
import { Sidebar } from "@/components/modern-side-bar";


const cardVariants = {
  hidden: { y: -120, opacity: 0, zIndex: -1 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    zIndex: 10,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
};

export default function Settings() {
   

  return (<>

  <div className="fixed left-0 top-0 h-screen w-64 z-50 ">
        <Sidebar />
      </div>
    

    <main className="container grid  ">
      


      <section className="mx-auto w-[33rem] md:w-[95rem] grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="bg-card rounded-md shadow-md h-130"
        >
          <h1 className="p-2 ml-2 text-sm font-semibold">Profile Settings</h1>
          <Separator></Separator>
          <FotoPerfil></FotoPerfil>
          <InputProfile></InputProfile>

        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="bg-card rounded-xl shadow-md h-110"
        />
      </section>


      <section className="mx-auto w-[33rem] md:w-[95rem]  grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0.6}
          className="bg-card rounded-xl shadow-md h-50"
        >
          <h1 className="p-2 ml-2 text-sm font-semibold">Account & Security</h1>
          <Separator></Separator>

          <Inputpassword></Inputpassword>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0.9}
          className="bg-card rounded-xl shadow-md h-92 md:-mt-20"
        />
      </section>


      <section className="mx-auto w-[33rem] md:w-[95rem]  grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1.2}
          className="bg-card rounded-xl shadow-md h-15 md:-mt-23"
        >
          <ConfirmChanges></ConfirmChanges>
        </motion.div>

      </section>
    </main>
</>
  );
}
