"use client";

import { motion } from "framer-motion";
import { Separator } from "../../components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import InputEmpresaSettings from "@/components/Inputs/empresaSettings/InputEmpresa";
import FotoPerfilEmpresa from "@/components/EmpresaProfileImage/page";
import Header from "@/components/Layout/Header/page"
import LayoutDashboard from "@/components/Layout/LayoutDashboard/page";

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
      <LayoutDashboard>
        <div className="flex-1 ">
          <header className="fixed top-0  right-0 z-40">
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
      </LayoutDashboard>
    </>
  );
}
