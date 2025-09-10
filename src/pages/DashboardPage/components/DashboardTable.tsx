import React, { useEffect, useState } from "react";
import { DashboardItem } from "../types";
import { dashboardService } from "../DashboardService";

interface DashboardTableProps {
  props: DashboardItem;
}

const DashboardTable: React.FC<DashboardTableProps> = ({ props }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const subscription = dashboardService
      .getDashboardDataByCode(props.code)
      .subscribe({
        next: (res) => setData(res),
        error: (err) =>
          console.error(`Failed to fetch data for code ${props.code}`, err),
      });

    return () => subscription.unsubscribe();
  }, [props.code]);

  if (!data) return <div>Loading DashboardTable for {props.code}...</div>;

  return (
    <div>
      <h3>Summary Dashboard: {props.name}</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DashboardTable;
