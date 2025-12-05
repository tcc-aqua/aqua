"use client";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import InputNotifications from "@/components/descartesAqua/inputConfigNotifications";
import InputAppearance from "@/components/Inputs/editProfile/inputsAppearance";

import AnimationWrapper from "../Layout/Animation/Animation";

import { Bell, Brush } from "lucide-react";

export default function SettingsGeral() {
  return (
    <main className="container mx-auto p-4">
      <section className="flex flex-col gap-8">

 
        <AnimationWrapper delay={0.1}>
          <Card className="rounded-2xl shadow-sm border-border/40 bg-background">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
           
                <Bell size={18} />
                Notifications
              </CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6 space-y-4">
              <InputNotifications />
            </CardContent>
          </Card>
        </AnimationWrapper>


        <AnimationWrapper delay={0.2}>
          <Card className="rounded-2xl shadow-sm border-border/40 bg-background">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
            
                <Brush size={18} />
                Appearance
              </CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              <InputAppearance />
            </CardContent>
          </Card>
        </AnimationWrapper>

      </section>
    </main>
  );
}
