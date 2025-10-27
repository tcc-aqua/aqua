import CardTop from "@/components/Cards/CardTopPadrao";
import Header from "@/components/Layout/Header/page";
import ApartamentosDashboard from "@/components/Listas/ListaApartamentos";
import CasasDashboard from "@/components/Listas/ListaCasas";
import ListaCasas from "@/components/Listas/ListaCasas";
import { Sidebar } from "@/components/modern-side-bar";



export default function Casas() {
    return (<>

        <div className="fixed left-0 top-0 h-screen w-64 z-50">
            <Sidebar />
        </div>
        <div className="flex-1 md:ml-30">

            <main className="container mx-auto pt-20 ">
                <header className="fixed top-0 left-64 right-0 z-40">
                    <Header />
                </header>
              
                <div className="">
                  <ApartamentosDashboard></ApartamentosDashboard>
           
            </div>
            </main>
           

        </div>


    </>)
}