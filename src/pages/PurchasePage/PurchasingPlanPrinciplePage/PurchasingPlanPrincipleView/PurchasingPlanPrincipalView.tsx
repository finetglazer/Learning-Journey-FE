/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import PageHeader from "components/PageHeader/PageHeader";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { Tabs, Tag } from "react-components-design-system";

import React from "react";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { RepoStateDetail } from "models/Payment";
import { isEmpty, isNull } from "lodash";
import { LoadingCM } from "components";
import { listPurchasingPlanStatusEnum } from "config/const";
import {
  PurchasingPlanPrincipleDetailHookContext,
  usePurchasingPlanPrincipleDetailHook,
} from "../PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetailHook";
import GroupActionView from "./Components/GroupActionView/GroupActionView";
import { PurchasingPlanConfirmModal } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";

const PurchasingPlanPrincipleView = () => {
  const planIsView = true;
  const {
    loading,
    breadcrumbs,
    tabRepositoriesView,
    loadingConfirm,
    ...contextValue
  } = usePurchasingPlanPrincipleDetailHook(planIsView);

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositoriesView &&
      tabRepositoriesView.length > 0 &&
      tabRepositoriesView.map((tab: RepoStateDetail) => {
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: tab.children,
          forceRender: true,
          destroyInactiveTabPane: true,
        };
      })
    );
  }, [tabRepositoriesView]);

  const renderTag = () => {
    let status = -1;
    if (isEmpty(contextValue?.model?.status)) {
      status = contextValue?.model?.status;
    }
    const item = listPurchasingPlanStatusEnum.find(
      (type) => type.id === status
    );
    return (
      <div className="d-flex align-center m-l--2xs">
        <Tag
          size="sm"
          value={
            isEmpty(item) ? contextValue.translate("CM.txt_create") : item?.name
          }
          status={item?.code}
          isShowDot={false}
          isShowBorder={true}
        />
      </div>
    );
  };
  return (
    <>
      <PurchasingPlanPrincipleDetailHookContext.Provider
        value={{ ...contextValue } as PurchasingPlanModel}
      >
        <div className={classNames("page-content")}>
          <PageHeader
            title={
              isEmpty(contextValue?.model?.idDetail)
                ? contextValue.translate("PL.purchasing_plan_title_create")
                : `${contextValue.translate("PL.purchase_plan")} ${
                    contextValue?.model?.code
                  }`
            }
            breadcrumbs={breadcrumbs}
            className="page-header"
            isShowBackButton
            rightComponentTitle={renderTag()}
            hasTabs={true}
          >
            <GroupActionView />
          </PageHeader>
          <div className="tab__master">
            <Tabs
              className=""
              tabPosition="top"
              mode="line"
              size={"small"}
              items={tabItems}
              destroyInactiveTabPane={true}
            />
          </div>
        </div>
        {!isNull(contextValue?.modelSelected) ? (
          <PurchasingPlanConfirmModal
            loadingButton={loadingConfirm}
            type={contextValue?.modelSelected.type}
            model={contextValue?.modelSelected.model}
            isLoading={loading}
            errorMessage={contextValue?.modelSelected.errorMessage}
            onApply={contextValue?.handleApplyButtonInConfirmModal}
            onCancel={() => contextValue?.setModelSelected(null)}
            setModelSelected={contextValue?.setModelSelected}
          />
        ) : null}
        {loading && <LoadingCM />}
      </PurchasingPlanPrincipleDetailHookContext.Provider>
    </>
  );
};

export default PurchasingPlanPrincipleView;
