import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { Instruction } from "@/components/blocks/instruction";
import InputWithAdornmentDemo from "@/components/input-07";
import Link from "next/link";

export default function EmailLogin() {
    return (
        <div className="grid min-h-svh lg:grid-cols-3 ">

            <div className="relative hidden lg:block bg-[#0372c6]">
                <img
                    src="/logo-png.svg"
                    alt="Imagem ilustrativa"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
                <div className="absolute inset-0 flex flex-col justify-end items-center pb-10 text-white text-center">

                    <div className="text-4xl font-semibold leading-tight drop-shadow-lg p-8">
                        Organize suas leituras com o Skoob!
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">

                <div>

                    <Link href='../login' className="text-[#0372c6] font-bold">
                        {'< '} Voltar
                    </Link>
                </div>
                <h1 className="text-2xl font-bold">Bom te ver novamente!</h1>
                <h2 className="text-sm mb-6">Preencha o seu e-mail para acessar sua conta.</h2>

                <div className="w-full max-w-lg">
                    <InputWithAdornmentDemo />
                </div>
            </div>
        </div>
    );
}
