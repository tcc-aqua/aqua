
import { Sidebar } from "@/components/modern-side-bar"
import Header from "@/components/Layout/Header/page"

import UsersDashboard from "@/components/Listas/ListaUsers"
import LayoutDashboard from "@/components/Layout/LayoutDashboards/page"

export default function Users() {
  return (<>
<LayoutDashboard>
      <div className="flex-1 ">
      <header className="fixed top-0 right-0 z-40">
        <Header />
      </header>
      <main className="container mx-auto pt-20">
        <div className="">
         <UsersDashboard></UsersDashboard>
        </div>
      
      </main>
    </div>

</LayoutDashboard>



  </>)
}