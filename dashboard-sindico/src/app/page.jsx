import CardCondominio from "@/components/blocks/dashboard/card-condominio";
import CardsPrincipal from "@/components/blocks/dashboard/cards-principal";
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
            <CardCondominio/>
            <CardsPrincipal />
          </div>
        </main>
      </LayoutDashboard>
    </>
  );
}
