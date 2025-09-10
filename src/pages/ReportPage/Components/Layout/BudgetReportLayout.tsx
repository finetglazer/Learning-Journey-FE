import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import ReportLayout from "components/layouts/ReportLayout/ReportLayout";
import { LayoutViewDetailProps } from "components/layouts/ViewDetail/LayoutViewDetail";
import { APP_OVERVIEW } from "config/route-const";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface BudgetReportLayoutProps
  extends Pick<LayoutViewDetailProps, "children" | "title"> {
  filterComponent?: ReactNode;
}

export default function BudgetReportLayout({
  children,
  filterComponent,
  ...props
}: BudgetReportLayoutProps) {
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
      name: translate("CM.menu_title_report.budget.master"),
    },
    {
      name: title,
    },
  ];

  return (
    <ReportLayout {...props} breadcrumbs={breadcrumbs}>
      <AdvancedCollapseView items={itemsCollapse} />
      {children}
    </ReportLayout>
  );
}
