import React, { useEffect, useState } from "react";
import { Badge, Card, List } from "antd";
import { DashboardItem } from "../types";
import { dashboardService } from "../DashboardService";
import "../DashboardPage.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useTranslation } from "react-i18next";
import { TicketCode } from "components";
import dayjs from "dayjs";
import { join } from "path";
import { ROOT_ROUTE } from "core/config/consts";

interface SimpleListDashboardProps {
  props: DashboardItem;
}

const SimpleListDashboard: React.FC<SimpleListDashboardProps> = ({ props }) => {
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

  const getUrl = (item: any) => {
    const finalUrl =
      !item.actionName.toLowerCase().includes("xóa") &&
      config.urlConfig &&
      config.urlConfig[item.type.toString()]
        ? config.urlConfig[item.type.toString()].replace(
            "{id}",
            item.adjustmentSlipId
          )
        : "#";
    return join(ROOT_ROUTE, finalUrl);
  };

  const renderContent = () => {
    if (props.hasPermission === false) {
      return (
        <div className="simple-list-dashboard-header-error">
          {translate("dashboards.notification.accessDenied")}
        </div>
      );
    }

    if (data?.results?.status === "Success") {
      return (
        <List
          size={"small"}
          itemLayout="horizontal"
          dataSource={data?.items ?? []}
          renderItem={(item: any) => (
            <List.Item>
              <Badge.Ribbon text={item.typeName}>
                <div style={{ width: "100%" }}>
                  <div className={"simple-list-dashboard-content-meta"}>
                    <div className={"simple-list-dashboard-content-meta-title"}>
                      {item.actionName}
                    </div>
                    <div className={"simple-list-dashboard-content-meta-link"}>
                      <TicketCode content={item.code} href={getUrl(item)} />
                    </div>
                    <div
                      className={
                        "simple-list-dashboard-content-meta-description"
                      }
                    >
                      {item.name}
                    </div>
                  </div>
                  <div className={"simple-list-dashboard-content-footer"}>
                    <div
                      className={"simple-list-dashboard-content-footer-time"}
                      key={2}
                    >
                      {dayjs
                        .utc(item.createdDate)
                        .local()
                        .format("DD/MM/YYYY HH:mm:ss")}
                    </div>
                    <div
                      className={"simple-list-dashboard-content-footer-time"}
                      key={2}
                    >
                      {dayjs
                        .utc(item.executionTime)
                        .local()
                        .format("DD/MM/YYYY HH:mm:ss")}
                    </div>
                  </div>
                </div>
              </Badge.Ribbon>
            </List.Item>
          )}
        />
      );
    }

    if (data?.results?.status && data?.results?.status !== "Success") {
      return (
        <div className="simple-list-dashboard-header-error">
          {data?.results?.message ?? "Đã xảy ra lỗi"}
        </div>
      );
    }

    return null;
  };

  return (
    <Card loading={loading} className="simple-list-dashboard" bordered={false}>
      <div className="simple-list-dashboard-header">
        <div className="simple-list-dashboard-header-icon-wrapper">
          <i className={`fas ${iconClass}`} />
        </div>
        <div className="simple-list-dashboard-header-title">{props.name}</div>
      </div>
      <div className="simple-list-dashboard-content">{renderContent()}</div>
    </Card>
  );
};

export default SimpleListDashboard;
