import Header from "@/components/Layout/Header/page"
import LayoutDashboard from "@/components/Layout/LayoutDashboards/page"
import { Sidebar } from "@/components/modern-side-bar"


export default function Contact() {
    return (<>
       <LayoutDashboard>
         <div className="flex-1 md:ml-30">

            <main className="container mx-auto pt-20 ">
                <header className="fixed top-0 right-0 z-40">
                    <Header />
                </header>

            </main>


        </div>

       </LayoutDashboard>
       
    </>)
}