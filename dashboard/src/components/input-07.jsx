"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function InputWithAdornmentDemo() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-xs space-y-2 ">
      <div
        className="relative flex items-center rounded-full border focus-within:ring-1  focus-within:ring-ring pl-2">
        <MailIcon className="h-5 w-5 text-muted-foreground" />
        <Input
          type="email"
          placeholder="Email"
          className="border-0 focus-visible:ring-0 shadow-none h-15 rounded-full " />
      </div>
      <div
        className="relative flex items-center rounded-full border focus-within:ring-1 focus-within:ring-ring px-2">
        <LockIcon className="h-5 w-5 text-muted-foreground" />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Senha"
          className="border-0 focus-visible:ring-0 shadow-none h-15 rounded-full" />
        <button onClick={togglePasswordVisibility}>
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <EyeIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>
      <Link href={'../dashboard'}>
      <Button className="w-full rounded-full h-10 mt-5 cursor-pointer">Entrar</Button>
      </Link>
      <Link href='../login' className="text-[#0372c6] underline hover:text-blue-900 flex justify-center">
         Esqueci minha senha
      </Link>
    </div>
  );
}
