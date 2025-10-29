import CardTop from "@/components/Cards/CardTopPadrao";
import Header from "@/components/Layout/Header/page";
import LayoutDashboard from "@/components/Layout/LayoutDashboards/page";
import CasasDashboard from "@/components/Listas/ListaCasas";
import ListaCasas from "@/components/Listas/ListaCasas";
import { Sidebar } from "@/components/modern-side-bar";



export default function Casas() {
    return (<>
    <LayoutDashboard>
        <div className="flex-1 ">

            <main className="container mx-auto pt-20 ">
                <header className="fixed top-0  right-0 z-40">
                    <Header />
                </header>
              
                <div className="">
                    <CasasDashboard></CasasDashboard>
           
            </div>
            </main>
           

        </div>

    </LayoutDashboard>

        


    </>)
}