"use client";

import { Mail, CheckCircle, XCircle } from "lucide-react";

export default function InputProfile({ nome, sobrenome, role, telefone, telefoneVerificado, email }) {

  const handleChangeEmail = () => {
    const newEmail = prompt("Digite seu novo e-mail:", email);
    if (newEmail) {
      console.log("Novo e-mail:", newEmail);
    }
  };

  return (
    <>

      <section className="grid grid-cols-2 gap-4 mx-auto max-w-md mt-6">
        <div>
          <label className="text-sm mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
          />
        </div>

        <div>
          <label className="text-sm mb-1">Sobrenome</label>
          <input
            type="text"
            value={sobrenome}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
          />
        </div>
      </section>


      <section className="grid grid-cols-2 gap-4 mx-auto max-w-md mt-2">
        <div>
          <label className="text-sm mb-1">Role</label>
          <input
            type="text"
            value={role}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
          />
        </div>
      </section>


      <section className="grid grid-cols-2 gap-4 mx-auto max-w-md mt-2 ">
        <div>
          <label className="text-sm mb-1">Telefone</label>
          <input
            type="text"
            value={telefone}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
          />
        </div>
        <div className="flex items-center gap-1 mt-6 ml-29">
          {telefoneVerificado ? (
            <>
              <CheckCircle className="text-green-500" size={16} />
              <span className="text-xs text-green-600">Verificado</span>
            </>
          ) : (
            <>
              <XCircle className="text-red-500" size={16} />
              <span className="text-xs text-red-600">Não Verificado</span>
            </>
          )}
        </div>
      </section>


      <section className="grid grid-cols-2 gap-4 mx-auto max-w-md mt-2">
        <div>
          <label className="text-sm mb-1">Email</label>
          <input
            type="text"
            value={email}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
          />
        </div>
        <div className="flex items-center mt-6 ml-28">
          <button
            onClick={handleChangeEmail}
            className="flex items-center border rounded-md p-1 px-5 text-gray-700 hover:text-accent text-xs"
          >
            <Mail size={16} />
            <span className="ml-1">Change</span>
          </button>
        </div>
      </section>

    </>
  );
}
