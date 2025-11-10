import AnimationWrapper from "@/components/Layout/Animation/Animation"
import Header from "@/components/Layout/Header/page"
import LayoutDashboard from "@/components/Layout/LayoutDashboard/page"
import SuporteDashboard from "@/components/Listas/ListaSuporte"

export default function Contact() {
    return (<>
        <LayoutDashboard>
            <div className="flex-1 ">
                <header className="fixed top-0 right-0 z-40">
                    <Header />
                </header>
                <main className="container mx-auto pt-20 ">
                    

                    <div className="">
                        <SuporteDashboard></SuporteDashboard>
                    </div>
                </main>
            </div>
        </LayoutDashboard>
    </>)
}