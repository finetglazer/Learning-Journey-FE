import classNames from "classnames";
import { isEmpty, isEqual, isNull } from "lodash";
import React, { useMemo } from "react";
import { Tag } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";

import { LoadingCM } from "components";
import ModalSubmitError from "components/ModalSubmitError/ModalSubmitError";
import { listPurchasingPlanStatusEnum } from "config/const";
import { RepoStateDetail } from "models/Payment";
import { PurchasePlanAdjustBidDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustBid";
import { PurchasingPlanConfirmModal } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import GroupAction from "./Components/GroupAction/GroupAction";
import {
  PurchasePlanAdjustBidDetailHookContext,
  usePurchasePlanAdjustBidDetailHook,
} from "./PurchasePlanAdjustBidDetailHook";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import styles from "./PurchasePlanAdjustBidDetail.module.scss";

const PurchasePlanAdjustBidDetail = () => {
  const {
    loading,
    breadcrumbs,
    tabRepositories,
    titlePageHeader,
    loadingConfirm,
    ...contextValue
  } = usePurchasePlanAdjustBidDetailHook();
  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      !isEmpty(tabRepositories) &&
      tabRepositories.map((tab: RepoStateDetail) => {
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: tab.children,
        };
      })
    );
  }, [tabRepositories]);

  const renderTag = useMemo(() => {
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
  }, [contextValue]);

  return (
    <>
      <PurchasePlanAdjustBidDetailHookContext.Provider
        value={
          { ...contextValue } as PurchasePlanAdjustBidDetailHookContextProps
        }
      >
        <LayoutViewDetail
          title={titlePageHeader}
          breadcrumbs={breadcrumbs}
          tabItems={tabItems}
          rightComponentTitle={renderTag}
          containerClassName={classNames(
            "layout-bidding-view",
            styles["scroll"],
            {
              [styles["no-tabs"]]: contextValue?.isCreatePage,
            }
          )}
          childrenPageHeader={<GroupAction />}
          setTabKey={contextValue?.setTabKey}
          hasTabs
        />
        {isEqual(contextValue.errorsModal?.type, "SUBMIT_FAIL") && (
          <ModalSubmitError
            errors={contextValue.errorsModal?.errors}
            onClose={() => contextValue.setErrorsModal({ type: "NONE" })}
          />
        )}
        {contextValue && !isNull(contextValue.modelSelected) ? (
          <PurchasingPlanConfirmModal
            loadingButton={loadingConfirm}
            type={contextValue.modelSelected.type}
            model={contextValue.model}
            isLoading={loading}
            errorMessage={contextValue.modelSelected.errorMessage}
            onApply={contextValue.handleApplyButtonInConfirmModal}
            onCancel={() => contextValue.setModelSelected(null)}
            setModelSelected={contextValue.setModelSelected}
          />
        ) : null}
      </PurchasePlanAdjustBidDetailHookContext.Provider>
      {loading && <LoadingCM />}
    </>
  );
};

export default PurchasePlanAdjustBidDetail;
