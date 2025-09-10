import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { DashboardItem } from "../types";
import { dashboardService } from "../DashboardService";
import "../DashboardPage.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTranslation } from "react-i18next";
import { ActionRowType } from "../../../models/Contract";
import { TicketCode } from "../../../components";
import {
  CONTRACT_ROUTE_MASTER,
  PURCHASING_PLAN_VIEW_ROUTE,
} from "../../../config/route-const";

interface SummaryDashboardProps {
  props: DashboardItem;
}

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ props }) => {
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
          year: null,
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
        <div className="summary-dashboard-header-error">
          {translate("dashboards.notification.accessDenied")}
        </div>
      );
    }

    if (data?.results?.status === "Success") {
      return (
        <div className="summary-dashboard-header-count">
          <TicketCode
            content={data?.value ?? 0}
            href={config?.url ? CONTRACT_ROUTE_MASTER + config?.url : "#"}
          />
        </div>
      );
    }

    if (data?.results?.status && data?.results?.status !== "Success") {
      return (
        <div className="summary-dashboard-header-error">
          {data?.results?.message ?? "Đã xảy ra lỗi"}
        </div>
      );
    }

    return null;
  };

  return (
    <Card loading={loading} className="summary-dashboard" bordered={false}>
      <div className="summary-dashboard-header">
        <div className="summary-dashboard-icon-wrapper">
          <i className={`fas ${iconClass}`} />
        </div>
        <div className="summary-dashboard-header-content">
          <div className="summary-dashboard-header-meta">{props.name}</div>
          {renderContent()}
        </div>
      </div>
    </Card>
  );
};

export default SummaryDashboard;
