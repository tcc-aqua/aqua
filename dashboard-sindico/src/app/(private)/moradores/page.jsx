import UsersDashboard from "@/components/blocks/lists/moradores";
import CardsPrincipal from "@/components/blocks/moradores/card-principal";
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
            <CardsPrincipal />
            <section>
                <UsersDashboard/>
            </section>
            <section>
            </section>
          </div>
        </main>
      </LayoutDashboard>
        </>
    )
}