import classNames from "classnames";
import PageHeader from "components/PageHeader/PageHeader";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { Tabs, Tag } from "react-components-design-system";

import { LoadingCM, StepProgressBarFooter } from "components";
import ModalSubmitError from "components/ModalSubmitError/ModalSubmitError";
import { listPurchasingPlanStatusEnum } from "config/const";
import { isEmpty, isEqual, isNull } from "lodash";
import { RepoStateDetail } from "models/Payment";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import React from "react";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import {
  PurchasingPlanDetailHookContext,
  usePurchasingPlanDetailHook,
} from "../PurchasingPlanDetail/PurchasingPlanDetailHook";
import { PurchasingPlanConfirmModal } from "../PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import GroupActionView from "./Components/GroupActionView/GroupActionView";

const PurchasingPlanView = () => {
  const planIsView = true;
  const {
    loading,
    breadcrumbs,
    tabRepositoriesView,
    errorsModal,
    title,
    setErrorsModal,
    loadingConfirm,
    ...contextValue
  } = usePurchasingPlanDetailHook(planIsView);

  const { model, translate, mappingStatusToProcess } = contextValue;

  let status: number;
  if (
    isEqual(model?.status, PURCHASING_PLAN_STATUS.WAITING_CANCEL) ||
    isEqual(model?.status, PURCHASING_PLAN_STATUS.CANCELLED) ||
    isEqual(model?.status, PURCHASING_PLAN_STATUS.DECLINED)
  ) {
    status = mappingStatusToProcess(model?.preCancelStatus);
  } else {
    status = mappingStatusToProcess(model?.status);
  }

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
          isShowBorder
        />
      </div>
    );
  };
  return (
    <>
      <PurchasingPlanDetailHookContext.Provider
        value={contextValue as PurchasingPlanModel}
      >
        <div className={classNames("page-content")}>
          <PageHeader
            title={title}
            breadcrumbs={breadcrumbs}
            className="page-header"
            isShowBackButton
            rightComponentTitle={renderTag()}
            hasTabs={true}
          >
            <GroupActionView loading={loading} />
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
            <StepProgressBarFooter
              steps={[
                { title: translate("PL.initial_step_text") },
                { title: translate("PL.quotation_step_text") },
                { title: translate("PL.select_supplier_step_text") },
                { title: translate("PL.approve_step_text") },
              ]}
              currentStep={status}
            />
          </div>
          {isEqual(errorsModal.type, "SUBMIT_FAIL") && (
            <ModalSubmitError
              errors={errorsModal?.errors}
              onClose={() => setErrorsModal({ type: "NONE" })}
            />
          )}
        </div>
        {!isNull(contextValue?.modelSelected) ? (
          <PurchasingPlanConfirmModal
            loadingButton={loadingConfirm}
            type={contextValue?.modelSelected.type}
            model={contextValue?.modelSelected.model}
            isLoading={false}
            errorMessage={contextValue?.modelSelected.errorMessage}
            onApply={contextValue?.handleApplyButtonInConfirmModal}
            onCancel={() => contextValue?.setModelSelected(null)}
            setModelSelected={contextValue?.setModelSelected}
          />
        ) : null}
        {loading && <LoadingCM />}
      </PurchasingPlanDetailHookContext.Provider>
    </>
  );
};

export default PurchasingPlanView;
