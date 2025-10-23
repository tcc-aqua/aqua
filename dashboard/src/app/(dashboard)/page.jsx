import CardTop from "@/components/Cards/CardTopPadrao"
import { ChartRadarDots } from "@/components/Charts/ChartRadar"
import { Sidebar } from "@/components/modern-side-bar"


export default function Dashboard() {
  
  return (<>
      <div className="fixed  left-0 top-0 h-screen w-64 z-50">
            <Sidebar />
          </div>
          <main className="container mx-auto">
  
            <CardTop></CardTop>

             <section className="grid grid-cols-2 gap-4 mt-5">
              <ChartRadarDots></ChartRadarDots>
             

            </section>



          </main>
  </>)
}