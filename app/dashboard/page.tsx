import DashboardClient from "./DashboardClient";

/* ⏳ Server Component */
async function getData() {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    data: [
      { name: "Ene", usuarios: 400, ventas: 240 },
      { name: "Feb", usuarios: 300, ventas: 139 },
      { name: "Mar", usuarios: 500, ventas: 380 },
      { name: "Abr", usuarios: 700, ventas: 520 },
      { name: "May", usuarios: 600, ventas: 410 },
    ],
    pieData: [
      { name: "Usuarios", value: 1240 },
      { name: "Ventas", value: 8320 },
    ],
  };
}

export default async function Page() {
  const { data, pieData } = await getData();

  return <DashboardClient data={data} pieData={pieData} />;
}
