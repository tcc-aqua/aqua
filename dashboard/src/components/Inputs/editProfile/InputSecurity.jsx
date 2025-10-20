"use client";

import { useState } from "react";
import { KeyRound, Eye, ShieldCheck, LogOut } from "lucide-react";
import { Button, Switch } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";

export default function AccountSecurityCard({ password }) {
  const [modal, setModal] = useState(null);
  const closeModal = () => setModal(null);

  const handleChangePassword = () => setModal("password");
  const handleViewSessions = () => setModal("sessions");
  const handleEnable2FA = () => setModal("2fa");
  const handleLogoutOtherDevices = () => setModal("logout");

  const savePassword = () => {
    closeModal();
    toast.success("Senha alterada com sucesso!");
  };

  const activate2FA = () => {
    closeModal();
    toast.success("Autenticação em 2 etapas ativada!");
  };

  const logoutAll = () => {
    closeModal();
    toast.success("Sessões remotas encerradas!");
  };

  return (

    
    <div className="mx-auto max-w-lg space-y-10 ">
      <Toaster position="top-right" richColors />

      <Card>
        <CardContent className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm font-medium flex items-center gap-2">
              <KeyRound size={16} /> Senha
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Atualize sua senha periodicamente para manter a segurança
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleChangePassword}
            className="flex items-center gap-1"
          >
            <KeyRound size={16} /> Alterar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm font-medium flex items-center gap-2">
              <Eye size={16} /> Onde Você Fez Login
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Visualize todos os dispositivos e sessões ativas na sua conta
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewSessions}
            className="flex items-center gap-1"
          >
            <Eye size={16} /> Visualizar
          </Button>
        </CardContent>
      </Card>

      {/* <Card>
        <CardContent className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm font-medium flex items-center gap-2">
              <ShieldCheck size={16} /> Autenticação em 2 Etapas
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Adicione uma camada extra de segurança à sua conta
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEnable2FA}
            className="flex items-center gap-1"
          >
            <ShieldCheck size={16} /> Ativar
          </Button>
        </CardContent>
      </Card> */}

      <Card>
        <CardContent className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-sm font-medium flex items-center gap-2">
              <LogOut size={16} /> Encerrar Sessões Remotas
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Encerre todas as sessões em outros dispositivos conectados
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogoutOtherDevices}
            className="flex items-center gap-1"
          >
            <LogOut size={16} /> Encerrar
          </Button>
        </CardContent>
      </Card>

  {/* <div className="mx-auto max-w-4xl">
      <Toaster position="top-right" richColors />

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-sm font-medium flex items-center gap-2">
              Senha
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Atualize sua senha periodicamente para manter a segurança
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleChangePassword}
              className="flex items-center gap-1"
            >
              <KeyRound size={16} /> Alterar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-sm font-medium flex items-center gap-2">
                Onde Você Fez Login
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Visualize todos os dispositivos e sessões ativas na sua conta
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewSessions}
              className="flex items-center gap-1"
            >
              <Eye size={16} /> Visualizar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-sm font-medium flex items-center gap-2">
              Autenticação em 2 Etapas
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Adicione uma camada extra de segurança à sua conta
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnable2FA}
              className="flex items-center gap-1"
            >
              <ShieldCheck size={16} /> Ativar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-sm font-medium flex items-center gap-2">
              Encerrar Sessões Remotas
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Encerre todas as sessões em outros dispositivos conectados
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogoutOtherDevices}
              className="flex items-center gap-1"
            >
              <LogOut size={16} /> Encerrar
            </Button>
          </CardContent>
        </Card>
      </div> */}

      

      <Dialog open={modal === "password"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
            <DialogDescription>Atualize sua senha periodicamente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            <input
              type="password"
              placeholder="Senha atual"
              className="w-full px-2 py-1 rounded text-sm bg-muted/10"
            />
            <input
              type="password"
              placeholder="Nova senha"
              className="w-full px-2 py-1 rounded text-sm bg-muted/10"
            />
            <input
              type="password"
              placeholder="Confirmar nova senha"
              className="w-full px-2 py-1 rounded text-sm bg-muted/10"
            />
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={closeModal}>
              Cancelar
            </Button>
            <Button className="ml-2" onClick={savePassword}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "sessions"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sessões Ativas</DialogTitle>
            <DialogDescription>
              Visualize todos os dispositivos conectados à sua conta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            <p>PC - Windows 10 (hoje)</p>
            <p>Notebook - MacOS (ontem)</p>
            <p>iPhone - iOS 17 (2 dias atrás)</p>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={closeModal}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "2fa"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Autenticação em 2 Etapas</DialogTitle>
            <DialogDescription>
              Ative a autenticação de dois fatores para maior segurança. Você receberá códigos via app ou SMS.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={closeModal}>
              Cancelar
            </Button>
            <Button className="ml-2" onClick={activate2FA}>
              Ativar 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === "logout"} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Encerrar Sessões Remotas</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja encerrar todas as sessões em outros dispositivos? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="destructive" className="ml-2" onClick={logoutAll}>
              Encerrar Todas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
