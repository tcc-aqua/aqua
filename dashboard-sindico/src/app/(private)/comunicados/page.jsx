import Header from "../../../components/layout/Header/page";
import LayoutDashboard from "../../../components/layout/LayoutDashboard/page";
import ComunicadosDashboard from "@/components/blocks/lists/comunicados/index";

export default function Comunicados() {
    return (
        <>
            <LayoutDashboard>
                <header className="fixed top-0  right-0 z-40">
                    <Header />
                </header>
                <main className="container mx-auto pt-20 ">
                    <div className="">
                    <h1 className="text-4xl font-black py-2">Comunicados</h1>
                    <h1 className=" opacity-65 mb-3">Análises detalhadas do Jardim das Flores</h1>
                        <ComunicadosDashboard></ComunicadosDashboard>
                    </div>
                </main>
            </LayoutDashboard>
        </>
    )

}