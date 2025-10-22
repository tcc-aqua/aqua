import CardTop from "@/components/Cards/CardTopPadrao"
import { Sidebar } from "@/components/modern-side-bar"
export default function Plans(){
    return(<>
          <div className="fixed left-0 top-0 h-screen w-64 z-50">
                <Sidebar />
              </div>
               <main className="container mx-auto">
                <CardTop></CardTop>
               </main>
    </>)
}