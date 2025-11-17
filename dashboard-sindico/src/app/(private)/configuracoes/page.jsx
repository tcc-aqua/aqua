import Header from "@/components/Layout/Header/page";
import LayoutDashboard from "@/components/Layout/LayoutDashboard/page";
import AnimatedTabsDemo from "@/components/tabs-18";

export default function Comunicados() {
    return (
        <>
            <LayoutDashboard>
                <header className="fixed top-0  right-0 z-40">
                    <Header />
                </header>
                <main className="container mx-auto pt-20 ">
                    <h1 className="text-4xl font-black py-2">Configurações</h1>
                    <h1 className=" opacity-65">Gerencie suas preferências e dados do condomínio</h1>
                    <AnimatedTabsDemo />
                </main>
            </LayoutDashboard>
        </>
    )

}