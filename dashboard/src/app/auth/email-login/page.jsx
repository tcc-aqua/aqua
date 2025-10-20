import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { Instruction } from "@/components/blocks/instruction";
import InputWithAdornmentDemo from "@/components/input-07";
import Link from "next/link";

export default function EmailLogin() {
    return (
        <div className="grid min-h-screen lg:grid-cols-2">

            <div className="relative hidden lg:flex flex-col bg-[#0372c6]">

                <div className="relative flex-grow">
                    <img
                        src="/logo-png.svg"
                        alt="Imagem ilustrativa"
                        className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 flex flex-col justify-end items-center pb-10 px-4 text-white z-20">
                        <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold">
                        Bem-vindo ao Sistema Aqua! 
                        </h1>
                    </div>
                </div>

            </div>

            <div className="flex flex-col p-6 md:p-10 h-full">


                <div className="flex items-center gap-2 mb-6">
                    <img src="/logo.svg" className="w-12" />
                    <img src="/escrita.png" className="w-18 mt-2" />
                </div>

                <div className="flex flex-col justify-center flex-grow">

                    <div className="mb-4">
                        <Link href="../login" className="text-[#0372c6] font-bold flex justify-center">
                            {'< '} Voltar
                        </Link>
                    </div>

                    <div className="">
                        <h1 className="flex justify-center text-3xl font-bold mb-2">Bom te ver novamente!</h1>
                        <h2 className="text-md mb-6 flex justify-center">Preencha o seu e-mail para acessar sua conta.</h2>

                        <div className="flex justify-center">
                            <div className="w-full max-w-lg flex justify-center ">
                                <InputWithAdornmentDemo />
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

