"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Instruction } from "@/components/blocks/instruction"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/layout/DarkMode/page";

// Define o esquema de validação do formulário
const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres"),
});

const LoginFormContent = () => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);

      if (res?.error) {
        toast.error(res.message || "Credenciais inválidas.");
        return;
      }

      if (!res?.token) {
        toast.error("Nenhum token recebido do servidor.");
        return;
      }

      document.cookie = `token=${res.token}; Path=/; SameSite=Lax`;

      toast.success("Login realizado com sucesso!");

      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao realizar login.");
    }
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md group overflow-hidden rounded-xl bg-card p-8 shadow-2xl transition-all duration-300 hover:shadow-primary/50 dark:hover:shadow-primary/20 border border-border/50 mx-auto">
      <div className="absolute inset-0 z-0 opacity-0 transition duration-300 ">
        <div className="absolute inset-0 bg-primary/20 dark:bg-primary/5 blur-xl"></div> 
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-background/50 opacity-40 transition duration-300 group-hover:opacity-80 rounded-xl animate-spin-slow"></div>
      </div>

      <div className="relative isolate flex flex-col items-center z-10">
        
        <h1 className="text-2xl font-bold tracking-tight text-center">
          Acesso ao Sistema de Síndicos
        </h1>
        <ModeToggle/>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Bem-vindo de volta!
        </p>

        <div className="my-6 w-full flex items-center justify-center">
          <Separator />
        </div>

        <Form {...form}>
          <form
            className="w-full space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@condominio.com"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full font-semibold">
              Entrar
            </Button>
          </form>
        </Form>
        
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Esqueceu sua senha?{" "}
          <a
            href="/forgot-password"
            className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
          >
            Recuperar
          </a>
        </p>
      </div>
    </div>
  );
};

// O componente principal de layout
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-background">
      <div className="bg-[#0372c6] relative hidden lg:block">
        <img
          src="/logo-png.svg"
          alt="Imagem ilustrativa"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="flex flex-col p-6 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <img src="./logo.svg" className="w-12" alt="Logo Principal" />
            <img src="./escrita-dark.png" className="w-18 mt-2" alt="Nome do Sistema" />
          </div>

          <Instruction className="h-16 w-16" />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <LoginFormContent />
          </div>
        </div>
      </div>
    </div>
  );
}