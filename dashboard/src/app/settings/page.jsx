"use client";

import { motion } from "framer-motion";
import { Separator } from "../../components/ui/separator";
import FotoPerfil from "@/components/ProfileImage/page";
import InputProfile from "@/components/Inputs/InputProfile";
import Inputpassword from "@/components/Inputs/InputSecurity";
import ConfirmChanges from "@/components/Inputs/ConfirmChanges";
import { Sidebar } from "@/components/modern-side-bar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import InputEmpresaSettings from "@/components/Inputs/InputEmpresa";

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
  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-64 z-50">
        <Sidebar />
      </div>

      <main className="container grid">
     
        <section className="mx-auto w-[33rem] md:w-[90rem] grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <Card className="bg-card rounded-md shadow-md h-auto">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                Empresa Settings 
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-4">
                <FotoPerfil />
              <InputEmpresaSettings></InputEmpresaSettings>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            <Card className="bg-card rounded-xl shadow-md h-110" />
          </motion.div>
        </section>

    
        <section className="mx-auto w-[33rem] md:w-[90rem] grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0.6}
          >
            <Card className="bg-card rounded-xl shadow-md h-50">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Account & Security
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent>
               
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0.9}
          >
            <Card className="bg-card rounded-xl shadow-md h-92 md:-mt-20" />
          </motion.div>
        </section>

      
        <section className="mx-auto w-[33rem] md:w-[90rem] grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={1.2}
          >
            <Card className="bg-card rounded-xl shadow-md h-15 md:-mt-23">
              <CardFooter>
                <ConfirmChanges />
              </CardFooter>
            </Card>
          </motion.div>
        </section>
      </main>
    </>
  );
}
