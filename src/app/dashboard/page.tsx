"use client";

import { useDashboard } from "../components/dashboard/DashboardProvider";
import EditableDashboard from "../components/dashboard/EditableDashboard";

export default function DashboardPage() {
  const { dashboardConfig, setActiveModal } = useDashboard();

  return (
    <EditableDashboard
      config={dashboardConfig}
      editMode={false}
      onOpenModal={(modalName) => setActiveModal(modalName as any)}
    />
  );
}
