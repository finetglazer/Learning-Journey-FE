import React from "react";
import { DashboardItem } from "../types";
import { useTranslation } from "react-i18next";
import { Card } from "antd";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  CONTRACT_ROUTE_MASTER,
  PORTAL_ROUTE,
} from "../../../config/route-const";
import { TicketCode } from "../../../components";
import { join } from "path";
import { ROOT_ROUTE } from "../../../core/config/consts";

interface IconListDashboardProps {
  props: DashboardItem;
}

const IconListDashboard: React.FC<IconListDashboardProps> = ({ props }) => {
  const [translate] = useTranslation();

  const config = props.additionalConfiguration as Record<string, any> | null;
  const iconClass = config?.icon ?? "fa-box";

  const renderContent = () => {
    if (props.hasPermission === false) {
      return (
        <div className="icon-list-dashboard-content-error">
          {translate("dashboards.notification.accessDenied")}
        </div>
      );
    }

    return <div className="icon-list-dashboard-content-error"></div>;
  };

  return (
    <Card bordered={false} size={"default"} className={"icon-list-dashboard"}>
      <div className={"icon-list-dashboard-icon"}>
        <i className={`fas ${iconClass}`} />
      </div>
      <div className={"icon-list-dashboard-header"}>
        <TicketCode
          content={props.name}
          href={
            config?.dataConfig?.url && props.hasPermission
              ? join(ROOT_ROUTE, config?.dataConfig?.url)
              : "#"
          }
        />
      </div>
      <div className={"icon-list-dashboard-content"}>{renderContent()}</div>
    </Card>
  );
};
export default IconListDashboard;
