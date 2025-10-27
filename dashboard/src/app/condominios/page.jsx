import CardTop from "@/components/Cards/CardTopPadrao";
import Header from "@/components/Layout/Header/page";
import CondominiosDashboard from "@/components/Listas/ListaCondominios";
import ListaCondominios from "@/components/Listas/ListaCondominios";
import { Sidebar } from "@/components/modern-side-bar";



export default function Condominios() {
    return (<>

        <div className="fixed left-0 top-0 h-screen w-64 z-50">
            <Sidebar />
        </div>

        <div className="flex-1 md:ml-30">
            <header className="fixed top-0 left-64 right-0 z-40">
                <Header />
            </header>


            <main className="container mx-auto pt-20 ">

                 <div className="">
                            <CondominiosDashboard></CondominiosDashboard>
                        </div>
            </main>
           
        </div>

      
    </>)
}