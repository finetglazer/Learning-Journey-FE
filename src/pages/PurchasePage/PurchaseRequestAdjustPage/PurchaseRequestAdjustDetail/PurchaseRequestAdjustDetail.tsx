/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM, ModalSubmitError } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { listPurchaseRequestStatusEnum } from "config/const";
import { isEqual, isNull } from "lodash";
import { RepoStateDetail } from "models/Payment";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import GroupAction from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestDetail/Components/GroupAction/GroupAction";
import {
  PurchaseRequestDetailHookContext,
  usePurchaseRequestDetailHook,
} from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestDetail/PurchaseRequestDetailHook";
import { PurchaseRequestConfirmModal } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestMaster/PurchaseRequestConfirmModal/PurchaseRequestConfirmModal";
import React from "react";
import { Tabs, Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useTranslation } from "react-i18next";

const PurchaseRequestAdjustDetail = () => {
  const [translate] = useTranslation();
  const {
    tabRepositories,
    //contextValue
    breadcrumbs,
    loading,
    errorsModal,
    title,
    setErrorsModal,
    handleApplyButtonInConfirmModal,
    loadingModal,
    ...contextValue
  } = usePurchaseRequestDetailHook({
    isDetail: false,
    isAdjust: true,
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
        {isEqual(errorsModal.type, "SUBMIT_FAIL") && (
          <ModalSubmitError
            errors={errorsModal?.errors}
            onClose={() => setErrorsModal({ type: "NONE" })}
          />
        )}

        {!isNull(contextValue.modelSelected) ? (
          <PurchaseRequestConfirmModal
            type={contextValue?.modelSelected.type}
            model={contextValue?.modelSelected.model}
            errorMessage={contextValue?.modelSelected.errorMessage}
            onApply={handleApplyButtonInConfirmModal}
            onCancel={() => contextValue?.setModelSelected(null)}
            isLoading={loadingModal}
          />
        ) : null}
      </PurchaseRequestDetailHookContext.Provider>
    </>
  );
};

export default PurchaseRequestAdjustDetail;
