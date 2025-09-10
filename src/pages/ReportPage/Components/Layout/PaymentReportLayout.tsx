import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import ReportLayout from "components/layouts/ReportLayout/ReportLayout";
import { LayoutViewDetailProps } from "components/layouts/ViewDetail/LayoutViewDetail";
import { APP_OVERVIEW } from "config/route-const";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import "./ReportLayoutContainer.scss";

interface PaymentReportLayoutProps
  extends Pick<LayoutViewDetailProps, "children" | "title"> {
  filterComponent?: ReactNode;
}

export default function PaymentReportLayout({
  children,
  filterComponent,
  ...props
}: PaymentReportLayoutProps) {
  const { title } = props;
  const [translate] = useTranslation();
  const itemsCollapse = [
    {
      key: "filter",
      label: translate("CM.txt_filter"),
      children: filterComponent,
    },
  ];

  const breadcrumbs = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_report.master"),
    },
    {
      name: translate("CM.menu_title_report.payment.master"),
    },
    {
      name: title,
    },
  ];

  return (
    <ReportLayout
      {...props}
      breadcrumbs={breadcrumbs}
      containerClassName="report-layout-container"
    >
      <AdvancedCollapseView items={itemsCollapse} />
      {children}
    </ReportLayout>
  );
}
