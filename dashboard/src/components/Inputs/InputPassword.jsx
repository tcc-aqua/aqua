

import { KeyRound } from "lucide-react";

export default function InputPassword({ password }) {
  const handleChangePassword = () => {
    const newPassword = prompt("Digite sua nova senha:", password);
    if (newPassword) {
     
      console.log("Nova senha:", newPassword);
    }
  };

  return (
    <section className="grid grid-cols-2 gap-4 mx-auto max-w-md mt-2">
      <div className="flex w-full items-center gap-2">
        <div className="flex-1 flex flex-col">
          <label className="block text-sm mb-1">Password</label>
        
        </div>

        <button
          onClick={handleChangePassword}
          className="flex items-center border rounded-md px-2 py-1 text-gray-700 hover:text-accent text-sm ml-auto mt-6"
        >
          <KeyRound size={18} />
          <span className="ml-1">Change</span>
        </button>
      </div>
    </section>
    

  );
}
