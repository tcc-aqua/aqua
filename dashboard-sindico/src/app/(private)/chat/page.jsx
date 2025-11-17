import Chat from "@/components/blocks/chat";
import Header from "@/components/Layout/Header/page";
import LayoutDashboard from "@/components/Layout/LayoutDashboard/page";

export default function Comunicados() {
    return (
        <>
            <LayoutDashboard>
                <header className="fixed top-0  right-0 z-40">
                    <Header />
                </header>
                <main className="container mx-auto pt-20 ">
                    <div className="">
                    <h1 className="text-4xl font-black py-2">Chat com o administrativo</h1>
                    <h1 className=" opacity-65 mb-3">Análises detalhadas do Jardim das Flores</h1>
                        <Chat/>
                    </div>
                </main>
            </LayoutDashboard>
        </>
    )

}