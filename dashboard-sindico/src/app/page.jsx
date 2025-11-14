import Header from "@/components/layout/Header/page";
import LayoutDashboard from "@/components/layout/LayoutDashboard/page";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <LayoutDashboard>
        <header className="fixed top-0  right-0 z-40">
          <Header />
        </header>
        <main className="container mx-auto pt-20 ">
          <div className="">
            <h1>hello world</h1>
          </div>
        </main>
      </LayoutDashboard>
    </>
  );
}
