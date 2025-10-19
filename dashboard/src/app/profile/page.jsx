"use client"

import { motion } from "framer-motion";
import { Sidebar } from "@/components/modern-side-bar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FotoPerfil from "@/components/ProfileImage/page";
import InputProfile from "@/components/Inputs/InputProfile";
import Inputpassword from "@/components/Inputs/InputSecurity";
import InputNotifications from "@/components/Inputs/inputConfigNotifications";
import { User, Bell, ShieldCheck, Eye } from "lucide-react"; // ícones
import InputAppearance from "@/components/Inputs/inputsAppearance";

const cardVariants = {
  hidden: { y: -120, opacity: 0, zIndex: -1 },
  visible: (delay = 0) => ({
    y: 0,
    opacity: 1,
    zIndex: 10,
    transition: { duration: 0.8, ease: "easeOut", delay },
  }),
};

export default function Profile() {
  return (
    <>
      <div className="fixed left-0 top-0 h-screen w-64 z-50">
        <Sidebar />
      </div>
      <main className="container mx-auto">
        <section className="mx-auto w-[33rem] md:w-[90rem] grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <Card className="bg-card rounded-md shadow-md h-auto">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <User size={18} /> Profile Settings
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-4">
                <FotoPerfil />
                <InputProfile />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <Card className="bg-card rounded-md shadow-md h-auto">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Bell size={18} /> Notifications
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-4">
                <InputNotifications />
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section className="mx-auto w-[33rem] md:w-[90rem] grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0.6}
          >
            <Card className="bg-card rounded-md shadow-md h-auto  md:mt-3">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck size={18} /> Account & Security
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className='space-y-2'>
                <Inputpassword />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <Card className="bg-card rounded-md shadow-md h-auto md:-mt-51">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Eye size={18} /> Appearance
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent>
               <InputAppearance></InputAppearance>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>
    </>
  );
}
