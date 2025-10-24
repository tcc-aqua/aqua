"use client";

import { motion } from "framer-motion";
import { Separator } from "../../components/ui/separator";
import ConfirmChanges from "@/components/Inputs/empresaSettings/ConfirmChanges";
import { Sidebar } from "@/components/modern-side-bar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import InputEmpresaSettings from "@/components/Inputs/empresaSettings/InputEmpresa";
import FotoPerfilEmpresa from "@/components/EmpresaProfileImage/page";
import Header from "@/components/Layout/Header/page"

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
      <div className="flex-1 md:ml-50">
        <header className="fixed top-0 left-64 right-0 z-40">
          <Header />
        </header>
        <main className="container mx-auto pt-20">

          <section className="mx-auto w-full grid grid-cols-1 gap-6 p-4">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <Card className="bg-card rounded-md shadow-md h-auto">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">
                    <FotoPerfilEmpresa></FotoPerfilEmpresa>
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4">

                  <InputEmpresaSettings></InputEmpresaSettings>
                </CardContent>
              </Card>
            </motion.div>

          </section>
        </main>
      </div>
    </>
  );
}
