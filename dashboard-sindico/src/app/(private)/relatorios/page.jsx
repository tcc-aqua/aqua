import CardsRelatorio from "@/components/blocks/relatorios/card-principal";
import MyChart5 from "@/components/blocks/relatorios/charts/MediaDeMoradores";
import Content from "@/components/blocks/relatorios/content/page";
import Header from "@/components/layout/Header/page";
import LayoutDashboard from "@/components/layout/LayoutDashboard/page";

export default function Moradores() {
    return (
        <>
         <LayoutDashboard>
        <header className="fixed top-0  right-0 z-40">
          <Header />
        </header>
        <main className="container mx-auto pt-20 ">
        <h1 className="text-4xl font-black py-2">Relatórios do Condomínio</h1>
        <h1 className=" opacity-65 mb-3">Análises detalhadas do Jardim das Flores</h1>
          <div className="">
            <CardsRelatorio />
            <section className="grid grid-cols-2 gap-10"> 
                <Content/>
                <MyChart5/>
            </section>
            <section>
            </section>
          </div>
        </main>
      </LayoutDashboard>
        </>
    )
}