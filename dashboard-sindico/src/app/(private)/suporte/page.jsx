import Mensagens from "@/components/blocks/lists/suporte";
import CardsSuporte from "@/components/blocks/suporte/card-principal";
import Header from "@/components/layout/Header/page";
import LayoutDashboard from "@/components/layout/LayoutDashboard/page";

export default function Suporte() {
    return (
        <>
            <LayoutDashboard>
                <header className="fixed top-0  right-0 z-40">
                    <Header />
                </header>
                <main className="container mx-auto pt-20 ">
                    <div className="">
                        <h1 className="text-4xl font-black py-2">Central de Suporte</h1>
                        <CardsSuporte/>
                        <Mensagens/>
                    </div>
                </main>
            </LayoutDashboard>
        </>
    )
}