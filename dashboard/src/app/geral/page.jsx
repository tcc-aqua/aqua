
import ProfileCards from "@/components/Cards/SettingsGeral";
import Header from "@/components/Layout/Header/page";
import LayoutDashboard from "@/components/Layout/LayoutDashboard/page";


export default function Profile() {
    return (<>
        <LayoutDashboard>
            <div className="flex-1 ">
                <header className="fixed top-0  right-0 z-40">
                    <Header />
                </header>
                <main className="container mx-auto pt-20 ">
                    <div className="">
                     <ProfileCards></ProfileCards>
                    </div>
                </main>
            </div>
        </LayoutDashboard>
    </>)
}