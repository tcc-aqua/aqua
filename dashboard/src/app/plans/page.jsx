import CardTop from "@/components/Cards/CardTotaisDash"
import { Sidebar } from "@/components/modern-side-bar"
import Header from "@/components/Layout/Header/page"
export default function Plans(){
    return(<>
          <header className="fixed top-0 left-64 right-0 z-40">
                  <Header />
                </header>
                <div className="fixed left-0 top-0 h-screen w-64 z-50">
                        <Sidebar />
                      </div>
                      
               <main className="container mx-auto pt-20">
                <CardTop></CardTop>
               </main>
    </>)
}