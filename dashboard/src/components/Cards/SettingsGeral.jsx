

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FotoPerfil from "@/components/Inputs/editProfile/InputProfileEdit";
import Inputpassword from "@/components/Inputs/editProfile/InputSecurity";
import InputNotifications from "@/components/Inputs/editProfile/inputConfigNotifications";
import { User, Bell, ShieldCheck, Brush } from "lucide-react";
import InputAppearance from "@/components/Inputs/editProfile/inputsAppearance";
import AnimationWrapper from "../Layout/Animation/Animation";


export default function SettingsGeral() {
  return (
    <>

      <main className="container mx-auto ">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <AnimationWrapper delay={0.1}>


            <Card className="bg-card rounded-md shadow-md h-auto  hover:border-sky-400 dark:hover:border-sky-950">
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
          </AnimationWrapper>

        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 ">
          <AnimationWrapper delay={0.2}>
            <Card className="bg-card rounded-md shadow-md h-auto  hover:border-sky-400 dark:hover:border-sky-950 ">
              {/* w-[33rem] md:w-[90rem] */}
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Brush size={18} /> Appearance
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent>
                <InputAppearance></InputAppearance>
              </CardContent>
            </Card>
          </AnimationWrapper>

          <AnimationWrapper delay={0.2} >
            <Card className="bg-card rounded-md shadow-md h-auto md:h-131  md:-mt-27  hover:border-sky-400 dark:hover:border-sky-950 ">
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
          </AnimationWrapper>

        </section>
      </main>

    </>
  );
}
