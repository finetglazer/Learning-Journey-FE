import { ReactNode } from "react";
import type { TabsProps } from "antd";
import { PageHeader } from "components";
import { Tabs } from "react-components-design-system";
import {
  BreadcrumbInterface,
  PageHeaderProps,
} from "components/PageHeader/PageHeader";
import classNames from "classnames";
import styles from "./LayoutViewDetail.module.scss";

export interface LayoutViewDetailProps extends PageHeaderProps {
  title: string;
  tabItems: TabsProps["items"];
  breadcrumbs: BreadcrumbInterface[];
  containerClassName?: string;
  childrenPageHeader?: ReactNode;
  activeKey?: string;
  setTabKey?: (key: string) => void;
  isNotShowTab?: boolean;
  children?: ReactNode;
}

export default function LayoutViewDetail({
  title,
  tabItems,
  breadcrumbs,
  rightComponentTitle,
  containerClassName,
  childrenPageHeader,
  activeKey,
  children,
  setTabKey,
  isNotShowTab = false,
}: LayoutViewDetailProps) {
  return (
    <div className={classNames(styles["page-container"], containerClassName)}>
      <PageHeader
        title={title}
        breadcrumbs={breadcrumbs}
        className={styles["page-header"]}
        isShowBackButton
        rightComponentTitle={rightComponentTitle}
        hasTabs={true}
      >
        {childrenPageHeader}
      </PageHeader>
      <div className={styles["content-tab"]}>
        {isNotShowTab ? (
          children
        ) : (
          <Tabs
            tabPosition="top"
            mode="line"
            items={tabItems}
            destroyInactiveTabPane={false}
            activeKey={activeKey}
            onChange={(key) => {
              if (setTabKey) {
                setTabKey(key);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
