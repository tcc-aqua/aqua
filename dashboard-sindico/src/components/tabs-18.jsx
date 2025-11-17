"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const ProfileContent = () => (
  <AnimatePresence>
    <motion.div className="space-y-4" initial="hidden" animate="visible" exit="hidden" variants={listVariants}>
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Nome do Condomínio</CardTitle>
            <CardDescription>Condomínio Vista Alegre</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Endereço: Rua Exemplo, 123</p>
            <p>Responsável: João da Silva</p>
            <p>Email: sindico@condominio.com</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const SettingsContent = () => (
  <AnimatePresence>
    <motion.div className="space-y-4" initial="hidden" animate="visible" exit="hidden" variants={listVariants}>
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Condomínio</CardTitle>
            <CardDescription>Gerencie regras e permissões</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome do Condomínio</label>
                <Input placeholder="Condomínio Vista Alegre" />
              </div>
              <div>
                <label className="text-sm font-medium">Codigo de acesso</label>
                <Input placeholder="João da Silva" />
              </div>
              <div>
                <label className="text-sm font-medium">Endereco</label>
                <Input type="email" placeholder="sindico@condominio.com" />
              </div>
              <div>
                <label className="text-sm font-medium">Cep</label>
                <Input type="tel" placeholder="(11) 98765-4321" />
              </div>
             
            </div>

            <div className="pt-4 flex justify-end">
              <Button>Salvar Configurações</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

export default function CondominiumTabs() {
  return (
    <Tabs defaultValue="profile" className="max-w-4xl w-full">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="profile">Perfil</TabsTrigger>
        <TabsTrigger value="settings">Configurações</TabsTrigger>
      </TabsList>

      <div className="mt-2 p-4 border rounded-md bg-card">
        <TabsContent value="profile">
          <ProfileContent />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsContent />
        </TabsContent>
      </div>
    </Tabs>
  );
}
