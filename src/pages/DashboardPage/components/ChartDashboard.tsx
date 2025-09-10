import React, { useEffect, useState } from "react";
import { DashboardItem, DateRange } from "../types";
import { dashboardService } from "../DashboardService";
import { useTranslation } from "react-i18next";
import { Card } from "antd";
import { Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDashboardProps {
  props: DashboardItem;
  dateRange: DateRange;
}

const ChartDashboard: React.FC<ChartDashboardProps> = ({
  props,
  dateRange,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [translate] = useTranslation();

  useEffect(() => {
    if (props.hasPermission === true) {
      setLoading(true);
      const subscription = dashboardService
        .getDashboardDataByCode({
          code: props.code,
          chartDateRange: dateRange,
          year: null,
        })
        .subscribe({
          next: (res) => {
            setData(res);
            setLoading(false);
          },
          error: (err) => {
            setLoading(false);
          },
        });

      return () => subscription.unsubscribe();
    }
  }, [props.code, props.hasPermission, dateRange]);

  const config = props.additionalConfiguration as Record<string, any> | null;
  const iconClass = config?.icon ?? "fa-box";

  const renderContent = () => {
    if (props.hasPermission === false) {
      return (
        <div className="chart-dashboard-content-error">
          {translate("dashboards.notification.accessDenied")}
        </div>
      );
    }

    if (data?.results?.status === "Success") {
      return (
        <div className="chart-dashboard-content-chart">
          <Doughnut
            className="doughnut-chart"
            data={{
              labels: data?.labels.map((it: any, idx: number) => {
                return `${translate(
                  "dashboards.chartDashboard.status." + it
                )} - ${data?.datasets[0]?.data[idx]}`;
              }),
              datasets: data?.datasets,
            }}
            options={
              props.additionalConfiguration
                ? props.additionalConfiguration.chartOptions
                : {}
            }
          />
        </div>
      );
    }

    if (data?.results?.status && data?.results?.status !== "Success") {
      return (
        <div className="chart-dashboard-content-error">
          {data?.results?.message ?? "Đã xảy ra lỗi"}
        </div>
      );
    }

    return null;
  };

  return (
    <Card loading={loading} className="chart-dashboard" bordered={false}>
      <div className="chart-dashboard-content">
        <div className="chart-dashboard-content-meta">{props.name}</div>
        {renderContent()}
      </div>
    </Card>
  );
};

export default ChartDashboard;
