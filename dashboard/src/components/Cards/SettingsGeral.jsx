"use client";

import { Separator } from "@/components/ui/separator";

import InputNotifications from "@/components/Inputs/editProfile/inputConfigNotifications";
import InputAppearance from "@/components/Inputs/editProfile/inputsAppearance";

import AnimationWrapper from "../Layout/Animation/Animation";

import { Bell, Brush } from "lucide-react";

export default function SettingsGeral() {
  return (
    <main className="container mx-auto p-4">
      <section className="flex flex-col gap-6">

        <AnimationWrapper delay={0.1}>
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Bell size={18} /> Notifications
            </h2>
            <Separator className="my-5" />
            <div className="space-y-4">
              <InputNotifications />
            </div>
          </div>
        </AnimationWrapper>

        <AnimationWrapper delay={0.2}>
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Brush size={18} /> Appearance
            </h2>
            <Separator className="my-5" />
            <div>
              <InputAppearance />
            </div>
          </div>
        </AnimationWrapper>

      </section>
    </main>
  );
}
