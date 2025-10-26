import CardTop from "@/components/Cards/CardTopPadrao"
import ContractorsFilter from "@/components/Filters/Usuarios"
import { Sidebar } from "@/components/modern-side-bar"
import Header from "@/components/Layout/Header/page"
import ListaUsers from "@/components/Listas/ListaUsers"
import CardTopUsers from "@/components/Cards/CardsTop/CardTopUsers"
import UsersDashboard from "@/components/Listas/ListaUsers"

export default function Users() {
  return (<>

    <div className="fixed left-0 top-0 h-screen w-64 z-50">
      <Sidebar />
    </div>

    <div className="flex-1 md:ml-50">
      <header className="fixed top-0 left-64 right-0 z-40">
        <Header />
      </header>
      <main className="container mx-auto pt-20">
        <div className="">
         <UsersDashboard></UsersDashboard>
        </div>
      
      </main>
    </div>

  </>)
}