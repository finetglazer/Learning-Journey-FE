/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import { LoadingCM, StepProgressBarFooter } from "components";
import ModalSubmitError from "components/ModalSubmitError/ModalSubmitError";
import PageHeader from "components/PageHeader/PageHeader";
import { listPurchasingPlanStatusEnum } from "config/const";
import { PHONE_NUMBER_REGEX } from "core/config/consts";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import dayjs from "dayjs";
import { isEmpty, isEqual, isNull } from "lodash";
import { RepoStateDetail } from "models/Payment";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { useSignFormHook } from "pages/SignProcess/useSignFormHook";
import React, { useState } from "react";
import { Tabs, Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useHistory } from "react-router-dom";
import { finalize } from "rxjs";
import { PurchasingPlanConfirmModal } from "../PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import { purchasingPlanRepository } from "../PurchasingPlanRepository";
import GroupAction from "./Components/GroupAction/GroupAction";
import NextRoundBidDrawer from "./Components/NextRoundBidDrawer/NextRoundBidDrawer";
import {
  PurchasingPlanDetailHookContext,
  usePurchasingPlanDetailHook,
} from "./PurchasingPlanDetailHook";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

const PurchasingPlanDetail = () => {
  const purchasingPlanByContext = usePurchasingPlanDetailHook(undefined);
  const {
    loading,
    breadcrumbs,
    tabRepositories,
    errorsModal,
    loadingConfirm,
    title,
    setErrorsModal,
    setTabKey,
    tabKey,
    ...contextValue
  } = purchasingPlanByContext;
  const history = useHistory();
  const [isOpenDrawerNextRoundBid, setIsOpenDrawerNextRoundBid] =
    useState<boolean>(false);
  const [isLoadingButtonNextRound, setIsLoadingButtonNextRound] =
    useState<boolean>(false);

  const { model, translate, mappingStatusToProcess } = contextValue;

  const status = mappingStatusToProcess(model?.status);

  const handleChangeTabs = (key: string) => {
    setTabKey(key);
    const url = history.location.pathname + `?tabKey=${key}`;
    history.replace(url, contextValue?.purchaseRequest);
  };

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

  const renderTag = () => {
    let status = -1; //is init status
    const isNotInit = isEmpty(contextValue?.model?.status);
    if (isNotInit) {
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

  const handleOpenDrawerNextRoundBid = () => {
    setIsOpenDrawerNextRoundBid(true);
  };

  const handleCloseDrawerNextRoundBid = () => {
    setIsOpenDrawerNextRoundBid(false);
    contextValue.handleChangeAllField({
      ...contextValue.model,
      roundStartDate: null,
      roundEndDate: null,
      emailRecipients: [],
      phoneNumber: null,
      content: null,
      quoteEmail: null,
      quoteName: null,
      errors: {
        taxCode: null,
        roundStartDate: null,
        roundEndDate: null,
        emailRecipients: null,
        phoneNumber: null,
        content: null,
        quoteEmail: null,
        quoteName: null,
      },
    });
  };

  const handleSaveDrawerNextRoundBid = () => {
    setIsLoadingButtonNextRound(true);
    const newModel = convertDataToHaveIndexBeforeValidate(
      contextValue.model,
      [],
      contextValue.model
    );

    const requestBody = {
      id: contextValue?.model?.id,
      supplierId: contextValue?.model?.supplierId,
      name: contextValue?.model?.supplierName,
      taxCode: contextValue?.model?.taxCode?.code,
      address: contextValue?.model?.supplierAddress,
      type: contextValue?.model?.supplierType,
      quoteEmail: contextValue?.model?.quoteEmail,
      quoteName: contextValue?.model?.quoteName,
      phoneNumber: contextValue?.model?.phoneNumber,
      content: contextValue?.model?.content,
      emailRecipients: contextValue?.model.emailRecipients,
      purchasePlanId: contextValue?.model?.id,
      roundStartDate:
        contextValue?.model?.roundStartDate &&
        dayjs(contextValue?.model?.roundStartDate).format(),
      roundEndDate:
        contextValue?.model?.roundEndDate &&
        dayjs(contextValue?.model?.roundEndDate).format(),
    };

    if (
      contextValue?.model?.phoneNumber &&
      PHONE_NUMBER_REGEX.test(contextValue?.model?.phoneNumber) == true
    ) {
      purchasingPlanRepository
        .updateNextRoundBid(requestBody)
        .pipe(finalize(() => setIsLoadingButtonNextRound(false)))
        .subscribe({
          next: () => {
            setIsOpenDrawerNextRoundBid(false);
            contextValue.handleChangeAllField({
              ...contextValue.model,
              roundStartDate: null,
              roundEndDate: null,
              emailRecipients: [],
              phoneNumber: null,
              content: null,
              quoteEmail: null,
              quoteName: null,
            });
            const isLoadData = contextValue.model.isLoadDataDetail
              ? !contextValue.model.isLoadDataDetail
              : true;
            contextValue.handleChangeSingleField({
              fieldName: "isLoadDataDetail",
            })(isLoadData);
          },
          error: (error) => {
            if (error.response?.data?.type === "Validate") {
              contextValue.handleChangeAllField({
                ...newModel,
                errors: error.response?.data?.errors,
              });
            }
          },
        });
    } else if (!contextValue?.model?.phoneNumber) {
      purchasingPlanRepository
        .updateNextRoundBid(requestBody)
        .pipe(finalize(() => setIsLoadingButtonNextRound(false)))
        .subscribe({
          next: () => {
            setIsOpenDrawerNextRoundBid(false);
            contextValue.handleChangeAllField({
              ...contextValue.model,
              roundStartDate: null,
              roundEndDate: null,
              emailRecipients: [],
              phoneNumber: null,
              content: null,
              quoteEmail: null,
              quoteName: null,
            });
            const isLoadData = contextValue.model.isLoadDataDetail
              ? !contextValue.model.isLoadDataDetail
              : true;
            contextValue.handleChangeSingleField({
              fieldName: "isLoadDataDetail",
            })(isLoadData);
          },
          error: (error) => {
            if (error.response?.data?.type === "Validate") {
              contextValue.handleChangeAllField({
                ...newModel,
                errors: error.response?.data?.errors,
              });
            }
          },
        });
    }
    setIsLoadingButtonNextRound(false);
  };

  const { openSigningForm, handleCancelSigningForm, handleOpenSigningForm } =
    useSignFormHook();

  const handleSendRequest = React.useCallback(() => {
    contextValue.handleSubmitApproval(false);
  }, [contextValue]);

  return (
    <>
      <PurchasingPlanDetailHookContext.Provider
        value={{ ...contextValue } as PurchasingPlanModel}
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
            <GroupAction
              handleOpenDrawerNextRoundBid={handleOpenDrawerNextRoundBid}
            />
          </PageHeader>
          <div className="tab__master">
            <Tabs
              className=""
              tabPosition="top"
              mode="line"
              items={tabItems}
              destroyInactiveTabPane={true}
              onChange={(key) => handleChangeTabs(key)}
              activeKey={tabKey}
            />
            <StepProgressBarFooter
              steps={[
                { title: translate("PL.initial_step_text") },
                { title: translate("PL.quotation_step_text") },
                {
                  title: translate("PL.select_supplier_step_text"),
                },
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

          {isOpenDrawerNextRoundBid && (
            <NextRoundBidDrawer
              isLoadingButtonNextRound={isLoadingButtonNextRound}
              visible={isOpenDrawerNextRoundBid}
              handleClose={handleCloseDrawerNextRoundBid}
              handleSave={handleSaveDrawerNextRoundBid}
              contextValue={purchasingPlanByContext}
            />
          )}
        </div>
        {!isNull(contextValue?.modelSelected) ? (
          <PurchasingPlanConfirmModal
            loadingButton={loadingConfirm}
            type={contextValue?.modelSelected.type}
            model={contextValue?.modelSelected.model}
            errorMessage={contextValue?.modelSelected.errorMessage}
            isLoading={false}
            onApply={contextValue?.handleApplyButtonInConfirmModal}
            handleOpenSignFormModal={handleOpenSigningForm}
            onCancel={() => contextValue?.setModelSelected(null)}
            setModelSelected={contextValue?.setModelSelected}
          />
        ) : null}
        {contextValue.model?.id && (
          <SignProcessModal
            isOpen={openSigningForm}
            loadingSend={loading}
            onCancel={handleCancelSigningForm}
            sendRequest={handleSendRequest}
            requestId={contextValue.model?.id}
            requestField={"id"}
            repository={purchasingPlanRepository}
            tempateType={SIGN_PROCESS_TYPE.PURCHASE_PLAN}
          />
        )}
        {loading && <LoadingCM />}
      </PurchasingPlanDetailHookContext.Provider>
    </>
  );
};

export default PurchasingPlanDetail;
