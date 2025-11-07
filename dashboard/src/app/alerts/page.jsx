import AnimationWrapper from "@/components/Layout/Animation/Animation"
import Header from "@/components/Layout/Header/page"
import LayoutDashboard from "@/components/Layout/LayoutDashboard/page"
import AlertasDashboard from "@/components/Listas/ListaAlertas"

export default function Alerts() {
    return (<>
        <LayoutDashboard>
            <div className="flex-1 ">
                <header className="fixed top-0 right-0 z-40">
                    <Header />
                </header>
                <main className="container mx-auto pt-20 ">
                    {/* <AnimationWrapper delay={0.1}>
                        <h1 className="font-bold text-5xl  mt-10">Gestão de Alertas</h1>
                        <h2 className="font-semibold text-foreground/60 mt-3 mb-10 ml-3">Painel de controle de alertas.</h2>
                    </AnimationWrapper> */}
                    <div>
                        <AlertasDashboard></AlertasDashboard>
                    </div>
                </main>
            </div>
        </LayoutDashboard>

    </>)
}