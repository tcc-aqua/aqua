import CardsRelatorio from "@/components/blocks/relatorios/card-principal";
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
          <div className="">
            <CardsRelatorio />
            <section>
                <Content/>
            </section>
            <section>
            </section>
          </div>
        </main>
      </LayoutDashboard>
        </>
    )
}