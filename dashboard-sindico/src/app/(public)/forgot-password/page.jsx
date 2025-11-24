"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export default function ForgotPasswordPage() {
  const form = useForm({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      form.clearErrors(); 
      const res = await api.post("/auth/forgot-password", data);

      if (res.error) {
        toast.error(res.message || "Erro ao enviar e-mail.");
        return;
      }

      toast.success("Enviamos um link para redefinir sua senha! Verifique seu e-mail.");
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao enviar e-mail.");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md rounded-xl bg-card p-8 shadow-2xl border border-border/50">
        
        <div className="flex justify-center items-center">
            <img src="./pingoTriste.png" className="w-20 h-20 mb-4" alt="" />
            <ModeToggle/>
        </div>
        
        <h1 className="text-2xl font-bold text-center">Esqueci minha senha</h1>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Informe seu e-mail cadastrado para receber o link de redefinição.
        </p>

        <div className="my-6">
          <Separator />
        </div>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
              {isSubmitting ? "Enviando..." : "Enviar link"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}