'use client';

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, Building, Mail, MapPin, Key, Hash } from "lucide-react";
import Cookies from "js-cookie";

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1, staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.99 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
};
const tabContentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const InfoDisplayItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
    <Icon className="h-5 w-5 text-muted-foreground mr-3" />
    <div className="flex flex-col">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="font-semibold text-base text-card-foreground">{value || "-"}</span>
    </div>
  </div>
);

export default function CondominiumTabs() {
  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        // Busca perfil
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) setProfile(await profileRes.json());

        // Busca dashboard do condomínio
        const dashboardRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (dashboardRes.ok) setDashboard(await dashboardRes.json());
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchData();
  }, []);

  const ProfileContent = () => (
    <motion.div
      key="profile-content-tab"
      variants={tabContentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <motion.div initial="hidden" animate="visible" variants={listVariants}>
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-t-4 border-b-4 border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold">
                <User className="mr-3 h-6 w-6" /> Perfil do Síndico
              </CardTitle>
              <CardDescription>Informações pessoais e do condomínio. Contatos para emergências.</CardDescription>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoDisplayItem icon={User} label="Nome Completo" value={profile?.name} />
              <InfoDisplayItem icon={Mail} label="Email de Contato" value={profile?.email} />
              <InfoDisplayItem icon={Key} label="Cargo Atual" value={profile?.role} />
              <InfoDisplayItem icon={Building} label="Condomínio Atribuído" value={profile?.residencia_type || "Não atribuído"} />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const SettingsContent = () => {
    const condominio = dashboard?.condominio;

    return (
      <motion.div
        key="settings-content-tab"
        variants={tabContentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="space-y-6"
      >
        <motion.div initial="hidden" animate="visible" variants={listVariants}>
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-t-4 border-b-4 border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-bold">
                  <Settings className="mr-3 h-6 w-6" /> Configurações do Condomínio
                </CardTitle>
                <CardDescription>Visualize regras, informações cadastrais e identificadores do condomínio.</CardDescription>
              </CardHeader>
              <Separator className="mb-4" />
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoDisplayItem icon={Building} label="Nome Oficial" value={condominio?.name} />
                <InfoDisplayItem icon={Hash} label="Código de Acesso" value={condominio?.codigo_acesso} />
                <InfoDisplayItem icon={MapPin} label="Endereço" value={`${condominio?.logradouro}, ${condominio?.numero} - ${condominio?.bairro}, ${condominio?.cidade} - ${condominio?.uf}`} />
                <InfoDisplayItem icon={Mail} label="CEP" value={condominio?.cep} />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <Tabs defaultValue="profile" className="p-4 sm:p-6">
      <TabsList className="w-full bg-muted/20 border shadow-sm rounded-xl mb-4">
        <TabsTrigger
          value="profile"
          className="text-base font-semibold data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:border transition-all duration-300 rounded-lg"
        >
          <User className="mr-2 h-4 w-4" /> Perfil
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="text-base font-semibold data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:border transition-all duration-300 rounded-lg"
        >
          <Settings className="mr-2 h-4 w-4" /> Condomínio
        </TabsTrigger>
      </TabsList>
      <AnimatePresence mode="wait">
        <div className="rounded-xl">
          <TabsContent value="profile">
            <ProfileContent />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsContent />
          </TabsContent>
        </div>
      </AnimatePresence>
    </Tabs>
  );
}
