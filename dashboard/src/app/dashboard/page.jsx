"use client";

import Header from "@/components/Layout/Header/page";
import { Sidebar } from "@/components/modern-side-bar";
import CardTop from "@/components/Cards/CardTopPadrao";
import { ChartRadarDots } from "@/components/Charts/ChartRadar";
import InfosDashboard from "@/components/Listas/ListaDashboard";
import LayoutDashboard from "@/components/Layout/LayoutDashboards/page";

export default function Dashboard() {
  return (
    <>

     
<LayoutDashboard>
<div className="flex-1 md:ml-20">
        <header className="fixed top-0  right-0 z-40">
          <Header />
        </header>


        <main className="container mx-auto pt-20 ">
          {/* <InfosDashboard></InfosDashboard> */}
        </main>
      </div>
</LayoutDashboard>
      


    </>
  );
}
