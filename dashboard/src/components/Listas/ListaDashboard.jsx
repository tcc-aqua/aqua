





export default function ListaDashboard(){
    const cards = [
    {
      title: "Total Usuarios",
      value: casaStats.total,
      icon: Home, bg: "bg-card",
      iconColor: "text-blue-700",
      textColor: "text-blue-800"
    },
    {
      title: "Casas Ativas",
      value: casaStats.ativas,
      icon: HousePlug,
      bg: "bg-card",
      iconColor: "text-green-700",
      textColor: "text-green-800"
    },
    {
      title: "Sensores Ativos",
      value: sensorStats.ativos,
      icon: SignalHigh,
      bg: "bg-card",
      iconColor: "text-green-700",
      textColor: "text-green-800"
    },
    {
      title: "Alertas",
      value: casaStats.alertas,
      icon: AlertTriangle,
      bg: "bg-card",
      iconColor: "text-red-700",
      textColor: "text-red-800"
    },
  ];
}