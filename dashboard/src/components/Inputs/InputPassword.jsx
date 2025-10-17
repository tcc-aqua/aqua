
import { KeyRound } from "lucide-react";

export default function InputPassword({ password }) {
  const handleChangePassword = () => {
    const newPassword = prompt("Digite sua nova senha:", password);
    if (newPassword) {

      console.log("Nova senha:", newPassword);
    }
  };

  return (<>
    <section className="grid grid-cols-2 gap-4 mx-auto max-w-sm md:max-w-lg mt-2">
      <div className="flex w-full items-center gap-2">
        <div className="flex-1 flex flex-col">
          <h1 className="block text-sm mt-1">Password</h1>
        </div>
      </div>
      <div className="flex items-center justify-end mt-2 md:ml-[11rem]">
        <button
          onClick={handleChangePassword}
          className="flex items-center border rounded-md p-1 px-5 text-gray-700 hover:text-accent text-xs whitespace-nowrap"
        >
          <KeyRound size={16} />
          <span className="ml-1">Change Password</span>
        </button>
      </div>
    </section>

    <section className="grid grid-cols-2 gap-4 mx-auto max-w-sm md:max-w-lg m">
      <div className="flex-1 flex flex-col">
        <h1 className="block text-sm ">Onde Você Fez Login</h1>

      </div>
      <div className="flex items-center justify-end max-w-sm md:max-w-lg mt-2 ">
        <button

          className="flex items-center rounded-md p-1 px-5 text-gray-700 hover:text-accent text-xs"
        >

          <span className="ml-1">Vizualizar</span>
        </button>
      </div>

    </section>

  </>
  );
}
