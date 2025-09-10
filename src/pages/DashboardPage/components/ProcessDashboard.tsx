import React, { useEffect, useState } from "react";
import { Card, Progress } from "antd";
import { DashboardItem } from "../types";
import { dashboardService } from "../DashboardService";
import "../DashboardPage.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTranslation } from "react-i18next";
import { TicketCode } from "../../../components";
import { CONTRACT_ROUTE_MASTER } from "../../../config/route-const";
import dayjs from "dayjs";
import { formatNumber } from "../../../core/helpers/number";

interface ProcessDashboardProps {
  props: DashboardItem;
}

const ProcessDashboard: React.FC<ProcessDashboardProps> = ({ props }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [translate] = useTranslation();

  useEffect(() => {
    if (props.hasPermission === true) {
      setLoading(true);
      const subscription = dashboardService
        .getDashboardDataByCode({
          code: props.code,
          chartDateRange: null,
          year: dayjs().year(),
        })
        .subscribe({
          next: (res) => {
            setData(res);
            setLoading(false);
          },
          error: () => {
            setLoading(false);
          },
        });

      return () => subscription.unsubscribe();
    }
  }, [props.code, props.hasPermission]);

  const config = props.additionalConfiguration as Record<string, any> | null;
  const iconClass = config?.icon ?? "fa-box";

  const renderContent = () => {
    if (props.hasPermission === false) {
      return (
        <div className="process-dashboard-header-error">
          {translate("dashboards.notification.accessDenied")}
        </div>
      );
    }

    if (data?.results?.status === "Success") {
      return (
        <div className="process-dashboard-content-chart">
          <div className="process-dashboard-content-label">
            {`${formatNumber(data?.actualAmount)}/${formatNumber(
              data?.plannedAmount
            )} ${
              props.additionalConfiguration.dataConfig?.labels?.plannedAmount
            }`}
          </div>
          <Progress
            {...props.additionalConfiguration.processOptions}
            percent={Math.round(
              (100 * data?.actualAmount) / data?.plannedAmount
            )}
          />
        </div>
      );
    }

    if (data?.results?.status && data?.results?.status !== "Success") {
      return (
        <div className="process-dashboard-header-error">
          {data?.results?.message ?? "Đã xảy ra lỗi"}
        </div>
      );
    }

    return null;
  };

  return (
    <Card loading={loading} className="process-dashboard" bordered={false}>
      <div className="process-dashboard-header">
        <div className="process-dashboard-header-icon-wrapper">
          <i className={`fas ${iconClass}`} />
        </div>
        <div className="process-dashboard-header-title">{props.name}</div>
      </div>
      <div className="process-dashboard-content">{renderContent()}</div>
    </Card>
  );
};

export default ProcessDashboard;
