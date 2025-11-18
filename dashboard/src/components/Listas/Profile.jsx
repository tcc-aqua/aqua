"use client";

import { useState, useEffect } from "react";
import { useAdminProfile } from "@/hooks/useAdminProfile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

import Loading from "../Layout/Loading/page";
import AnimationWrapper from "../Layout/Animation/Animation";

import {
  Edit3,
  User,
  Save,
  Loader2,
  Phone,
  MapPin,
  Mail,
  AlertTriangle,
  ShieldCheck,
  UserCircle2,
  Plus,
} from "lucide-react";

export default function EmployeeProfile() {
  const { admin, loading, saving, saveProfile, uploadPhoto } = useAdminProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [errorLoad, setErrorLoad] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (!loading) {
      if (!admin) setErrorLoad(true);
      else {
        setErrorLoad(false);
        setFormData({ email: admin?.email || "", password: "" });
      }
    }
  }, [admin, loading]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { email: formData.email };
    if (formData.password.trim()) payload.password = formData.password;

    const ok = await saveProfile(payload);
    if (ok) setIsOpen(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadPhoto(file);
  };

  if (loading) return <Loading />;
  if (errorLoad)
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-bold">Erro ao carregar perfil</h2>
        <p className="text-muted-foreground mb-4">Tente recarregar a página ou fazer login novamente.</p>
        <Button onClick={() => window.location.reload()} className="bg-sky-600">Recarregar</Button>
      </div>
    );

  const getRoleBadge = (role) => {
    if (!role) return null;
    const normalized = role.toLowerCase();
    const badgeStyles = {
      superadmin: "bg-purple-700 text-white",
      admin: "bg-blue-600 text-white",
    };
    const icons = { superadmin: ShieldCheck, admin: UserCircle2 };
    const Icon = icons[normalized] || UserCircle2;
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
        <Icon className="w-4 h-4" />
        {normalized}
      </span>
    );
  };

  return (
    <>
      <AnimationWrapper delay={0.1}>
        <Card className="relative max-w-4xl mx-auto rounded-3xl mt-10 shadow-2xl bg-card border border-transparent hover:border-sky-500 transition-all overflow-hidden">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsOpen(true)}
                  disabled={saving}
                  variant="ghost"
                  className="absolute top-6 right-6 flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editar perfil</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <CardContent className="p-10 space-y-10">
            <div className="flex flex-col items-center text-center">
              <motion.div
                className="relative mb-5 group"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {admin?.image ? (
                  <img
                    src={admin.image}
                    alt="Perfil"
                    className="w-44 h-44 rounded-full object-cover shadow-xl ring-4 ring-sky-200 transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-44 h-44 rounded-full bg-sky-600 flex items-center justify-center text-white shadow-xl ring-4 ring-sky-200">
                    <User className="w-20 h-20" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-sky-600 p-2 rounded-full shadow cursor-pointer hover:bg-sky-700 transition-colors">
                  <Plus className="w-4 h-4 text-white" />
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer rounded-full" onChange={handlePhotoUpload} />
                </div>
              </motion.div>

              <h1 className="text-4xl font-bold text-foreground">
                {admin?.first_name} <span className="text-sky-600">{admin?.last_name}</span>
              </h1>
              <div className="mt-3">{getRoleBadge(admin?.role)}</div>
              {admin?.department && (
                <span className="mt-4 px-4 py-1 rounded-full text-sm bg-sky-100 text-sky-700 font-semibold shadow-sm">
                  {admin.department}
                </span>
              )}
            </div>

            <div className="w-full h-px bg-border" />

            <motion.div
              className="space-y-6 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-foreground text-center mb-4">Contato</h3>
              {[["Telefone", admin?.phone, Phone], ["E-mail", admin?.email, Mail], ["Endereço", admin?.address, MapPin]].map(([label, value, Icon]) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 hover:bg-muted transition-all shadow-sm"
                >
                  <Icon className="w-6 h-6 text-sky-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-semibold text-foreground text-base">{value || "—"}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </AnimationWrapper>

      <AnimationWrapper delay={0.2}>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-2xl bg-background border overflow-hidden">
            <div className="h-2 w-full bg-primary rounded-t-md" />
            <DialogHeader className="mt-3 pb-2 text-center">
              <DialogTitle className="text-xl font-bold">Editar Perfil</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">Atualize seu e-mail, senha ou foto</p>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 mt-4 px-6 pb-6" autoComplete="off">
              <div className="flex flex-col gap-1">
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" required type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="password">Nova senha (opcional)</Label>
                <Input id="password" type="password" placeholder="Digite para alterar" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} />
              </div>

              <DialogFooter className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="w-32">Cancelar</Button>
                <Button type="submit" disabled={saving} className="w-32 flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </AnimationWrapper>
    </>
  );
}
