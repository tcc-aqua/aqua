"use client";

import Header from "@/components/Layout/Header/page";
import { Sidebar } from "@/components/modern-side-bar";
import CardTop from "@/components/Cards/CardTotaisDash";
import { ChartRadarDots } from "@/components/Charts/ChartRadar";
import InfosDashboard from "@/components/Listas/ListaDashboard";
import LayoutDashboard from "@/components/Layout/LayoutDashboards/page";
import DistribuicaoPorRegiao from "@/components/Cards/DistribuicaoPorRegiao";
import CardTopDash from "@/components/Cards/CardTotaisDash";
import CardAlertasRecentes from "@/components/Cards/CardAlertasRecentes";

export default function Dashboard() {
  return (
    <>


      <LayoutDashboard>
        <div className="flex-1 ">
          <header className="fixed top-0  right-0 z-40">
            <Header />
          </header>




          <main className="container mx-auto pt-20 ">
            <CardTopDash></CardTopDash>
            <section className="container max-auto justify-center grid grid-cols-2 gap-10 ">
              <div> <DistribuicaoPorRegiao></DistribuicaoPorRegiao></div>
          <div>   <CardAlertasRecentes></CardAlertasRecentes></div>
           
            </section>
          </main>
        </div>
      </LayoutDashboard>



    </>
  );
}
