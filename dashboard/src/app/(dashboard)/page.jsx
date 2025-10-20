import { ChartRadarDots } from "@/components/Charts/ChartRadar"
import { Sidebar } from "@/components/modern-side-bar"
import { Card } from "@/components/ui/card"


export default function Dashboard() {
  
  return (<>
      <div className="fixed left-0 top-0 h-screen w-64 z-50">
            <Sidebar />
          </div>
          <main className="container mx-auto">

            <section className="grid grid-cols-4 gap-4 mt-5">
              <Card>

              </Card>
              <Card>
                
              </Card>
              <Card>
                
              </Card>
              <Card>
                
              </Card>
            </section>
             <section className="grid grid-cols-2 gap-4 mt-5">
              <ChartRadarDots></ChartRadarDots>
             

            </section>



          </main>
  </>)
}