import classNames from "classnames";
import { isEqual, isNull } from "lodash";
import { useMemo } from "react";
import { Tag } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";

import { LoadingCM } from "components";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import ModalSubmitError from "components/ModalSubmitError/ModalSubmitError";
import { listPurchasingPlanStatusEnum } from "config/const";
import { RepoStateDetail } from "models/Payment";
import { PurchasePlanAdjustCompetitiveOfferDetailHookContextProps } from "models/PurchasingPlan/PurchasePlanAdjustCompetitiveOffer";
import { PurchasingPlanConfirmModal } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import GroupAction from "./Components/GroupAction/GroupAction";
import {
  PurchasePlanAdjustCompetitiveOfferDetailHookContext,
  usePurchasePlanAdjustCompetitiveOfferDetailHook,
} from "./PurchasePlanAdjustCompetitiveOfferDetailHook";

import styles from "./PurchasePlanAdjustCompetitiveOfferDetail.module.scss";

const PurchasePlanAdjustCompetitiveOfferDetail = () => {
  const {
    breadcrumbs,
    tabRepositories,
    errorsModal,
    titlePageHeader,
    loadingConfirm,
    ...contextValue
  } = usePurchasePlanAdjustCompetitiveOfferDetailHook(false);
  const {
    isCreatePage,
    model,
    translate,
    loading,
    modelSelected,
    setTabKey,
    handleApplyButtonInConfirmModal,
    setModelSelected,
  } = contextValue;
  const tabItems: TabsProps["items"] = useMemo(() => {
    return tabRepositories?.map((tab: RepoStateDetail) => ({
      label: tab.tabTitle,
      key: tab.tabKey,
      children: tab.children,
    }));
  }, [tabRepositories]);

  const renderTag = useMemo(() => {
    const ticketStatus = model?.status;
    const ticketStatusData = listPurchasingPlanStatusEnum.find(
      (type) => type.id === ticketStatus
    );

    return (
      <div className="d-flex align-center m-l--2xs">
        <Tag
          size="sm"
          value={
            isCreatePage ? translate("CM.txt_create") : ticketStatusData?.name
          }
          status={isCreatePage ? null : ticketStatusData?.code}
          isShowDot={false}
          isShowBorder
        />
      </div>
    );
  }, [isCreatePage, model?.status, translate]);

  return (
    <>
      <PurchasePlanAdjustCompetitiveOfferDetailHookContext.Provider
        value={
          contextValue as PurchasePlanAdjustCompetitiveOfferDetailHookContextProps
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
              [styles["no-tabs"]]: isCreatePage,
            }
          )}
          childrenPageHeader={<GroupAction />}
          setTabKey={setTabKey}
          hasTabs
        />
        {isEqual(errorsModal?.type, "SUBMIT_FAIL") && (
          <ModalSubmitError
            errors={errorsModal?.errors}
            onClose={() => contextValue?.setErrorsModal({ type: "NONE" })}
          />
        )}
        {contextValue && !isNull(modelSelected) && (
          <PurchasingPlanConfirmModal
            loadingButton={loadingConfirm}
            type={modelSelected.type}
            model={model}
            isLoading={loading}
            errorMessage={modelSelected.errorMessage}
            onApply={handleApplyButtonInConfirmModal}
            onCancel={() => setModelSelected(null)}
            setModelSelected={setModelSelected}
          />
        )}
      </PurchasePlanAdjustCompetitiveOfferDetailHookContext.Provider>
      {loading && <LoadingCM />}
    </>
  );
};

export default PurchasePlanAdjustCompetitiveOfferDetail;
