import CardTop from "@/components/Cards/CardTopPadrao";
import Header from "@/components/Layout/Header/page";
import LayoutDashboard from "@/components/Layout/LayoutDashboards/page";
import CondominiosDashboard from "@/components/Listas/ListaCondominios";
import ListaCondominios from "@/components/Listas/ListaCondominios";
import { Sidebar } from "@/components/modern-side-bar";



export default function Condominios() {
    return (<>

   <LayoutDashboard>
       <div className="flex-1 ">
            <header className="fixed top-0  right-0 z-40">
                <Header />
            </header>


            <main className="container mx-auto pt-20 ">

                 <div className="">
                            <CondominiosDashboard></CondominiosDashboard>
                        </div>
            </main>
           
        </div>

   </LayoutDashboard>

     

      
    </>)
}