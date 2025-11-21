import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { name: "", value: "consumo-diario", content: "Consumo Diário: 250 L" },
  { name: "", value: "consumo-mensal", content: "Consumo Mensal: 7.500 L" },
  { name: "", value: "alertas", content: "Alertas Ativos: 2 Vazamentos Detectados" },
];

export default function TabsShadowDemo({ value, onValueChange }) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="max-w-xs w-full mx-auto">
      <TabsList className="flex p-0 h-auto bg-background gap-3 justify-center">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="
              w-5 h-5 rounded-full
              data-[state=active]:bg-blue-600
              bg-gray-300
              hover:bg-blue-400
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            aria-label={tab.value}
          />
        ))}
      </TabsList>

     
    </Tabs>
  );
}
