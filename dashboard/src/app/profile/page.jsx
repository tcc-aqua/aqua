
import ProfileCards from "@/components/Cards/SettingsGeral";
import Header from "@/components/Layout/Header/page";
import LayoutDashboard from "@/components/Layout/LayoutDashboard/page";
import EmployeeProfile from "@/components/Listas/Profile";

export default function Profile() {
    return (<>
        <LayoutDashboard>
            <div className="flex-1 ">
                <header className="fixed top-0  right-0 z-40">
                    <Header />
                </header>
                <main className="container mx-auto pt-30 ">
                    <div className="">
                      <EmployeeProfile></EmployeeProfile>
                    </div>
                </main>
            </div>
        </LayoutDashboard>
    </>)
}