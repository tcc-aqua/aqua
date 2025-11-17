import Header from "@/components/Layout/Header/page";
import LayoutDashboard from "@/components/Layout/LayoutDashboard/page";
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
                        <ComunicadosDashboard></ComunicadosDashboard>
                    </div>
                </main>
            </LayoutDashboard>
        </>
    )

}