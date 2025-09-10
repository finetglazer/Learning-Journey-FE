/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { RepoStateDetail } from "models/Payment";
import React from "react";
import { Tabs, Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";

import { useTranslation } from "react-i18next";

import {
  listPurchaseRequestStatusEnum,
  PurchaseRequestStatus,
} from "config/const";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import {
  PurchaseRequestDetailHookContext,
  usePurchaseRequestDetailHook,
} from "../PurchaseRequestDetail/PurchaseRequestDetailHook";
import GroupAction from "./Components/GroupAction/GroupAction";

const PurchaseRequestView = () => {
  const [translate] = useTranslation();
  const {
    tabRepositories,
    //contextValue
    breadcrumbs,
    loading,
    title,
    ...contextValue
  } = usePurchaseRequestDetailHook({
    isDetail: true,
  });

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories &&
      tabRepositories.length > 0 &&
      tabRepositories.map((tab: RepoStateDetail) => {
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: tab.children,
        };
      })
    );
  }, [tabRepositories]);

  const renderStatusDetail = () => {
    const status = contextValue.model?.status;
    const item = listPurchaseRequestStatusEnum.find(
      (type) => type.id === status
    );
    return (
      <Tag
        value={item?.name || translate("BG.newly_created")}
        status={item?.code}
        className="m-l--2xs"
        size="sm"
        isShowBorder
        isShowDot={false}
      />
    );
  };

  return (
    <>
      <PurchaseRequestDetailHookContext.Provider
        value={contextValue as PurchaseRequestDetailModel}
      >
        <div className={classNames("page-content")}>
          <PageHeader
            title={title}
            breadcrumbs={breadcrumbs}
            className="page-header"
            isShowBackButton
            rightComponentTitle={renderStatusDetail()}
            hasTabs={true}
          >
            <GroupAction />
          </PageHeader>
          <div className="tab__master">
            <Tabs
              className="payment_custom_form"
              tabPosition="top"
              mode="line"
              items={tabItems}
              destroyInactiveTabPane={true}
            />
          </div>
        </div>
        {loading && <LoadingCM />}
      </PurchaseRequestDetailHookContext.Provider>
    </>
  );
};

export default PurchaseRequestView;
