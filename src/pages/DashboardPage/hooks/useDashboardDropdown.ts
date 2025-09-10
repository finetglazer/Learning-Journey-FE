import { useState, useEffect } from "react";
import { dashboardService } from "../DashboardService";
import { DashboardItem } from "../types";

export const useDashboardDropdown = () => {
  const [data, setData] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const subscription = dashboardService.getDropdown().subscribe({
      next: (res) => {
        setData(res);
        setLoading(false);
      },
      error: (err) => {
        setError(err);
        setLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  return { data, loading, error };
};
