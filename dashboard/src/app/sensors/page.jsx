import CardTop from "@/components/Cards/CardTopPadrao";
import Header from "@/components/Layout/Header/page";
import SensorsDashboard from "@/components/Listas/ListaSensors";
import ListaSensors from "@/components/Listas/ListaSensors";
import { Sidebar } from "@/components/modern-side-bar";



export default function Sensors() {
    return (<>

        <div className="fixed left-0 top-0 h-screen w-64 z-50">
            <Sidebar />
        </div>
        <div className="flex-1 md:ml-50">

            <main className="container mx-auto pt-20 ">
                <header className="fixed top-0 left-64 right-0 z-40">
                    <Header />
                </header>
                 <div className="">
                <SensorsDashboard></SensorsDashboard>
            </div>
            </main>

           
        </div>


    </>)
}