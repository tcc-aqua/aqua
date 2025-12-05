"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

import Loading from "../Layout/Loading/page";
import AnimationWrapper from "../Layout/Animation/Animation";

import {
  Save,
  Loader2,
  Mail,
  AlertTriangle,
  ShieldCheck,
  UserCircle2,
  Plus,
  Clock,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import InputAppearance from "../Inputs/editProfile/inputsAppearance";

export const adminEvent = new EventTarget();
export default function EmployeeProfile() {
  const { admin, loading, saving, saveProfile, uploadPhoto } = useAdminProfile();

  const [isOpen, setIsOpen] = useState(false);
  const [errorLoad, setErrorLoad] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [localImagePreview, setLocalImagePreview] = useState(null);
  const [showAllTimeline, setShowAllTimeline] = useState(false);

  const [showPersonalInfo, setShowPersonalInfo] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("showPersonalInfo") || "true")
      : true
  );

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!admin) {
        setErrorLoad(true);
      } else {
        setErrorLoad(false);
        setFormData({ email: admin.email || "", password: "" });
        setLocalImagePreview(null);
      }
    }
  }, [admin, loading]);

  const completeness = useMemo(() => {
    if (!admin) return 0;
    const fields = [
      { ok: !!admin.image, weight: 40 },
      { ok: !!admin.email, weight: 30 },
      { ok: !!admin.criado_em, weight: 30 },
    ];
    return Math.min(
      100,
      fields.reduce((acc, f) => acc + (f.ok ? f.weight : 0), 0)
    );
  }, [admin]);

  const passwordStrength = useMemo(() => {
    const p = formData.password || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.round((score / 5) * 100);
  }, [formData.password]);

  const strengthLabel = (val) => {
    if (val === 0) return "Vazia";
    if (val < 40) return "Fraca";
    if (val < 70) return "Média";
    return "Forte";
  };
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const timeline = admin?.activities || [
    { id: 1, text: "Conta criada", date: formatDate(admin?.criado_em) },
    { id: 2, text: "Perfil atualizado", date: formatDate("2024-10-12") },
    { id: 3, text: "Senha alterada", date: formatDate("2025-02-01") },

  ];
  useEffect(() => {
    const handler = (e) => {
      setShowPersonalInfo(e.detail);
      localStorage.setItem("showPersonalInfo", JSON.stringify(e.detail));
    };

    window.addEventListener("toggle-personal-info", handler);

    return () => window.removeEventListener("toggle-personal-info", handler);
  }, []);


  const loadingUI = loading ? <Loading /> : null;

  const errorUI = errorLoad ? (
    <div className="flex flex-col items-center py-20 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-3" />
      <h2 className="text-xl font-bold">Erro ao carregar perfil</h2>
      <p className="text-muted-foreground mb-4">
        Tente recarregar a página ou fazer login novamente.
      </p>
      <Button onClick={() => window.location.reload()} className="bg-sky-600">
        Recarregar
      </Button>
    </div>
  ) : null;

  if (loadingUI) return loadingUI;
  if (errorUI) return errorUI;

  const handleChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setLocalImagePreview(ev.target.result);
    reader.readAsDataURL(file);

    await uploadPhoto(file);

    //  dispara evento global para Header atualizar a imagem instantaneamente
    const event = new CustomEvent("imageUpdate", {
      detail: {
        id: admin.id,                // ID do admin atual
        image: URL.createObjectURL(file)
      }
    });
    adminEvent.dispatchEvent(event);
  };
  function maskEmail(email) {
    if (!email || typeof email !== "string") return "*****";

    const [user, domain] = email.split("@");
    if (!domain) return "*****";


    const maskedUser =
      user.length <= 2
        ? user[0] + "*".repeat(Math.max(user.length - 1, 1))
        : user[0] + "*".repeat(user.length - 2) + user[user.length - 1];

    return maskedUser + "@" + domain;
  }


  const getRoleBadge = (role) => {
    if (!role) return null;
    const r = role.toLowerCase();
    const colors = {
      superadmin: "text-purple-600 border-purple-700",
      admin: "text-blue-600 border-blue-700",
    };
    const icons = { superadmin: ShieldCheck, admin: UserCircle2 };
    const Icon = icons[r] || UserCircle2;

    return (
      <span
        className={`px-2 py-1 rounded-md border font-semibold shadow-md  ${colors[r]}`}
      >
        <Icon className="w-4 h-4  inline-block mr-1" />
        {r}
      </span>
    );
  };

  return (
    <div className="max-w-8xl mx-auto px-4 py-10 space-y-8">
      <AnimationWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 rounded-3xl shadow-xl flex flex-col items-center text-center">
            <div className="relative mb-4 group">
              <img
                src={
                  localImagePreview ||
                  admin?.image ||
                  "https://ui-avatars.com/api/?name=User"
                }
                alt="profile"
                className="w-44 h-44 rounded-full object-cover shadow-xl ring-1 group-hover:scale-105 transition-transform bg-accent"
              />
              <div className="absolute bottom-2 right-2 bg-sky-600 p-2 rounded-full cursor-pointer hover:bg-sky-700 transition-colors">
                <Plus className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>


            {getRoleBadge(admin.role)}

            <div className="w-full mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Completo</span>
                <span>{completeness}%</span>
              </div>

              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completeness}%` }}
                  className="h-3 rounded-full"
                  style={{
                    background:
                      completeness > 80
                        ? "#06b6d4"
                        : completeness > 50
                          ? "#34d399"
                          : "#fb7185",
                  }}
                />
              </div>
            </div>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <Card className="p-6 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-semibold mb-4">
                Informações
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  [
                    "E-mail",
                    showPersonalInfo ? admin.email : maskEmail(admin.email),
                    Mail
                  ],
                  ["Criado em", formatDate(admin.criado_em), Clock],
                ].map(([label, value, Icon]) => (
                  <motion.div
                    key={label}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 shadow"
                  >
                    <Icon className="text-sky-600 w-6 h-6" />
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-semibold">{value || "—"}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-4 rounded-2xl shadow">
                <h4 className="font-semibold ">Preferências</h4>
                <div className="">

                  <InputAppearance></InputAppearance>

                </div>
                {timeline.length > 3 && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowAllTimeline((s) => !s)}
                    >
                      {showAllTimeline ? "Mostrar menos" : `Ver mais`}
                    </Button>
                  </div>
                )}
              </Card>

              <Card className="p-4 rounded-2xl shadow">
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4" /> Segurança
                </h4>

                <div>
                  <p className="text-sm text-muted-foreground">Nova senha</p>

                 
                  <div className="mt-2 relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nova senha"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((x) => !x)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>

            
                  <div className="mt-2 text-xs flex justify-between text-muted-foreground">
                    <span>Força: {strengthLabel(passwordStrength)}</span>
                    <span>{formData.password.length} chars</span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2 mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength}%` }}
                      className="h-2 rounded-full"
                      style={{
                        background:
                          passwordStrength > 70
                            ? "#34d399"
                            : passwordStrength > 40
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    />
                  </div>

               
                  <div className="mt-4 relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirme a senha"
                      value={formData.confirmPassword || ""}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((x) => !x)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>

                
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
                    )}

                
                  <Button
                    disabled={
                      saving ||
                      !formData.password.trim() ||
                      formData.password !== formData.confirmPassword
                    }
                    className="mt-4 w-full flex gap-2 justify-center"
                    onClick={() => setShowModal(true)}
                  >
                    {saving ? <Loader2 className="animate-spin" /> : <Save />}
                    Salvar Senha
                  </Button>

                </div>

                <Dialog open={showModal} onOpenChange={setShowModal}>
                  <DialogContent className="sm: rounded-2xl shadow-2xl bg-background border border-border overflow-hidden">
                    <div className="h-2 w-full rounded-t-md bg-green-600" />
                    <DialogHeader className="flex flex-col items-center text-center space-y-4 pb-4 border-b border-border mt-3">
                      <div className="p-4 rounded-full bg-green-100 dark:bg-green-900">
                        <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
                      </div>
                      <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
                        Confirmação
                      </DialogTitle>
                    </DialogHeader>

                    <div className="mt-5 space-y-4 px-4 text-sm text-foreground/90 text-center">
                      <p className="text-lg">
                        Deseja realmente alterar a senha?
                      </p>
                    </div>

                    <DialogFooter className="flex justify-end mt-6 border-t border-border pt-4 space-x-2">
                      <Button
                        variant="ghost"
                        onClick={() => setShowModal(false)}
                        className="flex items-center gap-2"
                      >
                        <X className="h-5 w-5" />
                        Cancelar
                      </Button>

                      <Button
                        className="flex items-center gap-2 px-6 py-3 text-white transition bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                        onClick={async () => {
                          const data = { email: formData.email };
                          if (formData.password.trim()) data.password = formData.password;
                          const ok = await saveProfile(data);
                          if (ok) {
                            setShowModal(false);
                            setFormData((p) => ({ ...p, password: "" }));
                          }
                        }}
                      >
                        <Check className="h-5 w-5" />
                        Confirmar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Card>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    </div>
  );
}
