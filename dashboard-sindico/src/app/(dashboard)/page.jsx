import AlertasRecentes from "@/components/blocks/dashboard/alertas-recentes";
import CardCondominio from "@/components/blocks/dashboard/card-condominio";
import CardsPrincipal from "@/components/blocks/dashboard/cards-principal";
import { ChartBarLabel } from "@/components/blocks/dashboard/charts/ChartBar";
import { ChartLineMultiple } from "@/components/blocks/dashboard/charts/ChartLine";
import Header from "@/components/layout/Header/page";
import LayoutDashboard from "@/components/layout/LayoutDashboard/page";

export default function Dashboard() {
  return (
    <>
      <LayoutDashboard>
        <header className="fixed top-0  right-0 z-40">
          <Header />
        </header>
        <main className="container mx-auto pt-20 ">
          <div className="">
            <CardCondominio />
            <CardsPrincipal />
            <section className="grid grid-cols-2 gap-8">
            <ChartLineMultiple />
            <ChartBarLabel /> 
            </section>
            <section>
              <AlertasRecentes/>
            </section>
          </div>
        </main>
      </LayoutDashboard>
    </>
  );
}
