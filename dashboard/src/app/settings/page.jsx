


import Header from "@/components/Layout/Header/page"
import LayoutDashboard from "@/components/Layout/LayoutDashboard/page";
import SettingsDashboard from "@/components/Listas/ListaSettings";
import AnimationWrapper from "@/components/Layout/Animation/Animation";


export default function Settings() {
  return (
    <>
      <LayoutDashboard>
        <div className="flex-1 ">
          <header className="fixed top-0  right-0 z-40">
            <Header />
          </header>

          <main className="container mx-auto pt-20 ">
            <AnimationWrapper delay={0.1}>
              <h1 className="font-bold text-5xl mt-10">Configurações do Sistema</h1>
              <h2 className="font-semibold text-foreground/60 mt-3 mb-10 ml-3">Painel de controle de logs.</h2>
            </AnimationWrapper>
              <AnimationWrapper delay={0.2}>
                 <div className="">
              <SettingsDashboard></SettingsDashboard>
            </div>
              </AnimationWrapper>
           
          </main>

        </div>
      </LayoutDashboard>
    </>
  );
}
