import React, { useEffect, useState } from "react";
import { DashboardItem } from "../types";
import { dashboardService } from "../DashboardService";
import { Bar } from "react-chartjs-2";
import { Card, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatNumber } from "../../../core/helpers/number";
import dayjs from "dayjs";

const { Option } = Select;

interface AdvanceChartDashboardProps {
  props: DashboardItem;
}

const AdvanceChartDashboard: React.FC<AdvanceChartDashboardProps> = ({
  props,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { advanceChartYear, setAdvanceChartYear } = useDashboardData();
  const [translate] = useTranslation();

  useEffect(() => {
    if (props.hasPermission === true) {
      setLoading(true);
      const subscription = dashboardService
        .getDashboardDataByCode({
          code: props.code,
          chartDateRange: null,
          year: advanceChartYear,
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
  }, [props.code, props.hasPermission, advanceChartYear]);

  const config = props.additionalConfiguration as Record<string, any> | null;
  const iconClass = config?.icon ?? "fa-box";

  const renderContent = () => {
    if (props.hasPermission === false) {
      return (
        <div className="advance-chart-dashboard-content-error">
          {translate("dashboards.notification.accessDenied")}
        </div>
      );
    }

    if (data?.results?.status === "Success") {
      return (
        <div className="advance-chart-dashboard-content-chart">
          <Bar
            className="bar-chart"
            data={{
              labels: data?.labels.map((it: any) => {
                return translate("dashboards.budgetUsage.month_" + it);
              }),
              datasets: data?.datasets.map((it: any) => {
                return {
                  ...it,
                  label: translate("dashboards.budgetUsage." + it.label),
                };
              }),
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
        <div className="advance-chart-dashboard-content-error">
          {data?.results?.message ?? "Đã xảy ra lỗi"}
        </div>
      );
    }

    return null;
  };

  return (
    <Card
      loading={loading}
      className="advance-chart-dashboard"
      bordered={false}
    >
      <div className="advance-chart-dashboard-header">
        <div className="advance-chart-dashboard-header-title">
          <div className="advance-chart-dashboard-header-title-meta">
            {props.name}
            <Select
              defaultValue={advanceChartYear}
              onChange={setAdvanceChartYear}
              style={{ width: 150 }}
            >
              <Option value={dayjs().year()}>
                {translate("dashboards.budgetUsage.currentYear")}
              </Option>
              <Option value={dayjs().year() - 1}>
                {translate("dashboards.budgetUsage.prevYear")}
              </Option>
            </Select>
          </div>
          <div className="advance-chart-dashboard-header-title-control">
            <p className={"budget-usage-amount"}>
              {formatNumber(data?.totalUsageAmount)}
            </p>
            <p className={"budget-total-amount"}>
              {translate("dashboards.budgetUsage.totalBudget") +
                ": " +
                formatNumber(data?.totalBudget)}
            </p>
          </div>
        </div>
        <div className="advance-chart-dashboard-header-description"></div>
      </div>
      <div className="advance-chart-dashboard-content">{renderContent()}</div>
    </Card>
  );
};

export default AdvanceChartDashboard;
