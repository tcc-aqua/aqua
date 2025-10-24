import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { Instruction } from "@/components/blocks/instruction";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-[#0372c6]">

      <div className="bg-[#0372c6] relative hidden lg:block">
        <img
          src="/logo-png.svg"
          alt="Imagem ilustrativa"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <div className="flex flex-col p-6 md:p-10">
        <div className="flex justify-start items-center mb-6 gap-80">
          <div className="flex items-center gap-2">
            <img src="./logo.svg" className="w-12" />
            <img src="./escrita-dark.png" className="w-18 mt-2" />
          </div>

          <Instruction className="h-16 w-16" /> 

        </div>


        <div className="flex flex-1 items-center">
          <div className="w-full max-w-lg">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}