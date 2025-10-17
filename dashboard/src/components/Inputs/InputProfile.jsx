"use client";

import { Mail, Check, X } from "lucide-react";

export default function InputProfile({
  nome,
  sobrenome,
  role,
  telefone,
  telefoneVerificado,
  email,
}) {
  const handleChangeEmail = () => {
    const newEmail = prompt("Digite seu novo e-mail:", email);
    if (newEmail) {
      console.log("Novo e-mail:", newEmail);
    }
  };

  return (
    <>
   
      <section className="grid grid-cols-2 gap-4 mx-auto max-w-sm md:max-w-lg mt-6">
        <div>
          <label className="text-sm mb-1 block">Nome</label>
          <input
            type="text"
            value={nome}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
          />
        </div>

        <div>
          <label className="text-sm mb-1 block">Sobrenome</label>
          <input
            type="text"
            value={sobrenome}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
          />
        </div>
      </section>

     
      <section className="grid grid-cols-2 gap-4 mx-auto max-w-sm md:max-w-lg mt-2">
        <div>
          <label className="text-sm mb-1 block">Função</label>
          <input
            type="text"
            value={role}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
          />
        </div>
      </section>

    
      <section className="grid grid-cols-2 gap-4 mx-auto max-w-sm md:max-w-lg mt-2 relative">
        <div>
          <label className="text-sm mb-1 block">Telefone</label>
          <input
            type="text"
            value={telefone}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
          />
        </div>

        <div className="relative">
          <div className="absolute top-9 right-0 md:right-[-3rem] flex items-center gap-1 whitespace-nowrap">
            {telefoneVerificado ? (
              <>
                <Check className="text-green-500" size={12} />
                <span className="text-[9px] text-green-600">Verificado</span>
              </>
            ) : (
              <>
                <X className="text-red-500" size={12} />
                <span className="text-[9px] text-red-600">Não Verificado</span>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 mx-auto max-w-sm md:max-w-lg mt-2">
        <div>
          <label className="text-sm mb-1 block">Email</label>
          <input
            type="text"
            value={email}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
          />
        </div>
        <div className="flex items-center mt-7 justify-end md:justify-start md:ml-[12rem]">
          <button
            onClick={handleChangeEmail}
            className="flex items-center border rounded-md p-1 px-5 text-gray-700 hover:text-accent text-xs whitespace-nowrap"
          >
            <Mail size={16} />
            <span className="ml-1">Change Email</span>
          </button>
        </div>
      </section>
    </>
  );
}
