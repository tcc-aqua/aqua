
import { ChartAreaInteractive } from "@/components/Charts/ChartArea"
import { ChartBarHorizontal } from "@/components/Charts/ChartBarHorizontal"
import { ChartPieSeparatorNone } from "@/components/Charts/ChartPie"
import { Sidebar } from "@/components/modern-side-bar"


export default function Analytics() {
    return (<>
        <div className="fixed left-0 top-0 h-screen w-64 z-50">
            <Sidebar />
        </div>

        <main className="container mx-auto space-y-4 mt-5">
            <div className="grid grid-cols-1">
                <ChartAreaInteractive></ChartAreaInteractive>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <ChartBarHorizontal></ChartBarHorizontal>

                <ChartPieSeparatorNone></ChartPieSeparatorNone>
            </div>
        </main>
    </>)
}