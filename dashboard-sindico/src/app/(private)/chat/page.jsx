import Chat from "@/components/blocks/chat";
import Header from "@/components/Layout/Header/page";
import LayoutDashboard from "@/components/Layout/LayoutDashboard/page";

export default function Comunicados() {
    return (
        <>
            <LayoutDashboard>
                <header className="fixed top-0  right-0 z-40">
                    <Header />
                </header>
                <main className="container mx-auto pt-20 ">
                    <div className="">
                        <Chat/>
                    </div>
                </main>
            </LayoutDashboard>
        </>
    )

}