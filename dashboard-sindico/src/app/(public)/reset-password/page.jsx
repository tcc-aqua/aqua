"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ModeToggle } from "@/components/layout/DarkMode/page"; 

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Token de redefinição ausente ou inválido.");
      return;
    }

    try {
      form.clearErrors();
      const res = await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });

      if (res.error) {
        toast.error(res.message || "Erro ao redefinir senha.");
        return;
      }

      toast.success("Senha redefinida com sucesso! Você será redirecionado para o login.");
      router.push("/login"); 
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao redefinir senha.");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md rounded-xl bg-card p-8 shadow-2xl border border-border/50">
        
        <div className="flex justify-center items-center mb-2">
            <img 
              src="./gota-feliz.svg" 
              className="w-20 h-20" 
              alt="Mascote Feliz, nova senha" 
            />
            <ModeToggle />
        </div>
        
        <h1 className="text-2xl font-bold text-center">Redefinir senha</h1>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Informe sua <b>nova senha</b> para acessar o sistema.
        </p>

        <div className="my-6">
          <Separator />
        </div>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      disabled={isSubmitting} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirme a nova senha</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      disabled={isSubmitting} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full font-semibold"
              disabled={isSubmitting} 
            >
              {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}