"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import InputNotifications from "@/components/Inputs/editProfile/inputConfigNotifications";
import InputAppearance from "@/components/Inputs/editProfile/inputsAppearance";

import AnimationWrapper from "../Layout/Animation/Animation";

import { Bell, Brush } from "lucide-react";

export default function SettingsGeral() {
  return (
    <main className="container mx-auto p-4">

      {/* GRID ÚNICA PARA FICAR LADO A LADO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <AnimationWrapper delay={0.1}>
          <Card className="bg-card rounded-md shadow-md hover:border-sky-400 dark:hover:border-sky-950">
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

        <AnimationWrapper delay={0.2}>
          <Card className="bg-card rounded-md shadow-md hover:border-sky-400 dark:hover:border-sky-950">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Brush size={18} /> Appearance
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
              <InputAppearance />
            </CardContent>
          </Card>
        </AnimationWrapper>

      </section>

    </main>
  );
}
