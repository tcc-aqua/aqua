import CardTop from "@/components/Cards/CardTopPadrao"
import ContractorsFilter from "@/components/Filters/ContractorsFilter"
import { Sidebar } from "@/components/modern-side-bar"
export default function Contractors(){
    return(<>
          <div className="fixed left-0 top-0 h-screen w-64 z-50">
                <Sidebar />
              </div>
              <main className="container mx-auto">
                <div className="">
                   <CardTop></CardTop>
                </div>
            <div className="p-4 mt-5">
              <ContractorsFilter></ContractorsFilter>
            </div>
                
              </main>
    </>)
}