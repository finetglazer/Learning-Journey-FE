/* eslint-disable import/no-unresolved */
import { Tag } from "react-components-design-system";

import { LoadingCM } from "components";
import { listPurchasingPlanStatusEnum } from "config/const";
import { isEmpty, isNull } from "lodash";
import { RepoStateDetail } from "models/Payment";
import { PurchasingPlanConfirmModal } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import React from "react";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import {
  PurchasePlanAdjustCompetitiveOfferDetailHookContext,
  usePurchasePlanAdjustCompetitiveOfferDetailHook,
} from "../PurchasePlanAdjustCompetitiveOfferDetail/PurchasePlanAdjustCompetitiveOfferDetailHook";
import GroupActionView from "./Components/GroupActionView/GroupActionView";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import { PurchasePlanAdjustCompetitiveOfferDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustCompetitiveOffer";

import "../../ReceivingGoods/ReceivingGoodsView/ReceivingGoodsView.scss";

const PurchasePlanAdjustCompetitiveOfferView = () => {
  const {
    loading,
    breadcrumbs,
    tabRepositories,
    loadingConfirm,
    titlePageHeader,
    ...contextValue
  } = usePurchasePlanAdjustCompetitiveOfferDetailHook(true);

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      !isEmpty(tabRepositories) &&
      tabRepositories.map((tab: RepoStateDetail) => {
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: tab.children,
          forceRender: true,
          destroyInactiveTabPane: true,
        };
      })
    );
  }, [tabRepositories]);

  const renderTag = () => {
    const ticketStatus = contextValue?.model?.status;
    const ticketStatusData = listPurchasingPlanStatusEnum.find(
      (type) => type.id === ticketStatus
    );

    return (
      <div className="d-flex align-center m-l--2xs">
        <Tag
          size="sm"
          value={
            contextValue?.isCreatePage
              ? contextValue.translate("CM.txt_create")
              : ticketStatusData?.name
          }
          status={contextValue?.isCreatePage ? null : ticketStatusData?.code}
          isShowDot={false}
          isShowBorder={true}
        />
      </div>
    );
  };

  return (
    <>
      <PurchasePlanAdjustCompetitiveOfferDetailHookContext.Provider
        value={
          {
            ...contextValue,
          } as PurchasePlanAdjustCompetitiveOfferDetailHookContextProps
        }
      >
        <LayoutViewDetail
          title={titlePageHeader}
          breadcrumbs={breadcrumbs}
          tabItems={tabItems}
          rightComponentTitle={renderTag()}
          hasTabs={true}
          containerClassName="layout-bidding-view"
          childrenPageHeader={<GroupActionView />}
          setTabKey={contextValue.setTabKey}
        />

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
            isAdjust={true}
          />
        ) : null}
        {loading && <LoadingCM />}
      </PurchasePlanAdjustCompetitiveOfferDetailHookContext.Provider>
    </>
  );
};

export default PurchasePlanAdjustCompetitiveOfferView;
