"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export default function ConfirmChanges() {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    setOpen(false)
    toast.success("Alterações salvas com sucesso!")
  }

  return (
    <section className="grid grid-cols-2 gap-4 mx-auto max-w-md p-1 mt-2">
   
      <h1 className="text-sm text-start mt-1">
        Salvar todas as alterações feitas?
      </h1>


      <div className="flex justify-end gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="text-sm h-7">Confirmar</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tem certeza?</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita. Confirme se deseja salvar todas as alterações.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm}>
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
