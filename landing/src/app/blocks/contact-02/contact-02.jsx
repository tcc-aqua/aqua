"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon, MapPinIcon, MessageCircle, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Contact02Page = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      toast.error("Você precisa aceitar os termos e condições.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Mensagem enviada com sucesso!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
          acceptTerms: false,
        });
      } else {
        toast.error(data.error || "Erro ao enviar mensagem.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao enviar mensagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-background flex items-center justify-center py-16"
    >
      <div className="w-full max-w-screen-xl mx-auto px-6 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <b className="text-muted-foreground uppercase font-semibold text-sm">
            Fale Conosco
          </b>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            Comece a economizar com a Aqua
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            Preencha o formulário ou entre em contato por um dos canais abaixo. Nossa equipe irá falar com você para apresentar as opções de plano ideais para sua necessidade.
          </p>
        </motion.div>

        <div className="mt-24 grid lg:grid-cols-2 gap-16 md:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12"
          >
            {/* E-mail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary rounded-full">
                <MailIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">E-mail</h3>
              <p className="my-2.5 text-muted-foreground">
                Envie uma mensagem e nossa equipe retornará em breve.
              </p>
              <Link className="font-medium text-primary" href="mailto:contato@aqua.com.br">
                servicesaquateam@gmail.com
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary rounded-full">
                <PhoneIcon />
              </div>
              <h3 className="mt-6 font-semibold text-xl">Telefone</h3>
              <p className="my-2.5 text-muted-foreground">
                De segunda a sexta, das 8h às 17h.
              </p>
              <Link className="font-medium text-primary" href="tel:+551100000000">
                +55 (11) 0000-0000
              </Link>
            </motion.div>
          </motion.div>

          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="bg-blue-100 dark:bg-[#0a5280] shadow-none py-0">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="firstName">Seu Nome</Label>
                      <Input
                        placeholder="Seu nome"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="mt-2 bg-white h-10 shadow-none placeholder:text-gray-400 placeholder:text-opacity-60"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="lastName">Seu Sobrenome</Label>
                      <Input
                        placeholder="Seu sobrenome"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="mt-2 bg-white h-10 shadow-none placeholder:text-gray-400 placeholder:text-opacity-60"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="email">Seu E-mail</Label>
                      <Input
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-2 bg-white h-10 shadow-none placeholder:text-gray-400 placeholder:text-opacity-60"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea
                        id="message"
                        placeholder="Nos diga mais sobre sua residência ou condomínio. Nossa equipe entrará em contato."
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        required
                        className="mt-2 bg-white shadow-none placeholder:text-gray-400 placeholder:text-opacity-60"
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                      />
                      <Label htmlFor="acceptTerms" className="gap-0">
                        Li e concordo com os
                        <Link href="#" className="underline ml-1">
                          termos e condições
                        </Link>
                        <span>.</span>
                      </Label>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? "Enviando..." : "Enviar"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact02Page;
