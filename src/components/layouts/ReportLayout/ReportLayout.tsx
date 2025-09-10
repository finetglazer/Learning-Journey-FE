import classNames from "classnames";
import { PageHeader } from "components";
import {
  BreadcrumbInterface,
  PageHeaderProps,
} from "components/PageHeader/PageHeader";
import { ReactNode } from "react";
import styles from "./ReportLayout.module.scss";

export interface ReportLayoutProps extends PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbInterface[];
  containerClassName?: string;
  childrenPageHeader?: ReactNode;
}

export default function ReportLayout({
  title,
  breadcrumbs,
  rightComponentTitle,
  containerClassName,
  childrenPageHeader,
  children,
}: ReportLayoutProps) {
  return (
    <div className={classNames(styles["page-container"], containerClassName)}>
      <PageHeader
        title={title}
        breadcrumbs={breadcrumbs}
        className={styles["page-header"]}
        rightComponentTitle={rightComponentTitle}
      >
        {childrenPageHeader}
      </PageHeader>
      {children}
    </div>
  );
}
