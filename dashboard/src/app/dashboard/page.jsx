

import Header from "@/components/Layout/Header/page";
import LayoutDashboard from "@/components/Layout/LayoutDashboard/page";
import DistribuicaoPorRegiao from "@/components/Cards/DistribuicaoPorRegiao";
import CardTopDash from "@/components/Cards/CardTotaisDash";
import CardAlertasRecentes from "@/components/Cards/CardAlertasRecentes";
import { ChartAreaInteractive } from "@/components/Charts/ChartArea";
import AnimationWrapper from "@/components/Layout/Animation/Animation";
import { ChartMeiaLua } from "@/components/Charts/ChartMeiaLua";
import LogsDashboard from "@/components/Cards/CardLogs";

export default function Dashboard() {

  return (<>
    <LayoutDashboard>
      <div className="flex-1 ">
        <header className="fixed top-0  right-0 z-40">
          <Header />
        </header>
        <main className="container mx-auto pt-20 ">
          <AnimationWrapper delay={0.1} >
            <div className="mt-5"><CardTopDash ></CardTopDash> </div> 
          </AnimationWrapper>


          <AnimationWrapper delay={0.2}>
            <div className="mt-10"><ChartAreaInteractive /></div>
          </AnimationWrapper>

          <section className="container mx-auto mt-10 grid grid-cols-3 gap-10">

            <div className="col-span-2 ">
              <DistribuicaoPorRegiao />
            </div>
            <div className="flex flex-col gap-6">
              <CardAlertasRecentes />
              <ChartMeiaLua />
            </div>

          </section>
          <AnimationWrapper delay={0.3}>
            <div className="mt-10"><LogsDashboard></LogsDashboard></div>
          </AnimationWrapper>


        </main>
      </div>
    </LayoutDashboard>
  </>
  );
}
