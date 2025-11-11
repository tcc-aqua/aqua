"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function InputNotifications() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const notifications = [
    {
      title: "Notificações por E-mail",
      description: "Receba alertas importantes no seu e-mail.",
      state: emailNotifs,
      setState: setEmailNotifs,
    },
    // {
    //   title: "Notificações por SMS",
    //   description: "Receba alertas via SMS no seu celular.",
    //   state: smsNotifs,
    //   setState: setSmsNotifs,
    // },
    {
      title: "Notificações Push",
      description: "Receba notificações diretamente no seu navegador ou app.",
      state: pushNotifs,
      setState: setPushNotifs,
    },
  
  ];

  return (
    <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 ">
      {notifications.map((notif, index) => (
        <Card key={index} className="shadow-md hover:shadow-lg transition-shadow  hover:border-sky-400 dark:hover:border-sky-700">
          <CardContent className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{notif.title}</p>
              <p className="text-xs text-muted-foreground">{notif.description}</p>
            </div>
            <Switch
              checked={notif.state}
              onCheckedChange={(checked) => notif.setState(!!checked)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
