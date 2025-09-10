/* eslint-disable import/no-unresolved */
import classNames from "classnames";
import PageHeader from "components/PageHeader/PageHeader";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { Tabs, Tag } from "react-components-design-system";
import {
  PurchasingPlanPrincipleDetailHookContext,
  usePurchasingPlanPrincipleDetailHook,
} from "./PurchasingPlanPrincipleDetailHook";
import React, { useState } from "react";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { RepoStateDetail } from "models/Payment";
import ModalSubmitError from "components/ModalSubmitError/ModalSubmitError";
import { isEmpty, isEqual, isNull } from "lodash";
import { LoadingCM } from "components";
import GroupAction from "./Components/GroupAction/GroupAction";
import { listPurchasingPlanStatusEnum } from "config/const";
import NextRoundBidDrawer from "./Components/NextRoundBidDrawer/NextRoundBidDrawer";
import dayjs from "dayjs";
import { PHONE_NUMBER_REGEX } from "core/config/consts";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import { useHistory } from "react-router-dom";
import { finalize } from "rxjs";
import { PurchasingPlanConfirmModal } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import PurchasePlanPrincipleGenerationInfoTab from "./GenerationInfoTab/GenerationInfoTab";
import { PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE } from "config/route-const";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { usePurchasingPlanPrincipleSignFormHook } from "./PurchasingPlanPrincipleSignForm";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

const PurchasingPlanPrincipleDetail = () => {
  const {
    loading,
    breadcrumbs,
    tabRepositories,
    errorsModal,
    setErrorsModal,
    setTabKey,
    tabKey,
    titlePageHeader,
    loadingConfirm,
    ...contextValue
  } = usePurchasingPlanPrincipleDetailHook();

  const {
    openSigningForm,
    handleCancelSigningForm,
    handleOpenSigningForm,
    handleSendRequest,
  } = usePurchasingPlanPrincipleSignFormHook(
    contextValue.model,
    contextValue.handleChangeAllField,
    purchasingPlanRepository.approveContractSupplier,
    contextValue.getDataSubmit,
    contextValue.handleGoMaster,
    contextValue.setLoading,
    setErrorsModal
  );

  const history = useHistory();
  const [isOpenDrawerNextRoundBid, setIsOpenDrawerNextRoundBid] =
    useState<boolean>(false);
  const [isLoadingButtonNextRound, setIsLoadingButtonNextRound] =
    useState<boolean>(false);

  const handleChangeTabs = (key: string) => {
    setTabKey(key);
    const url = history.location.pathname + `?tabKey=${key}`;
    history.replace(url);
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
    if (!contextValue) return;
    setIsLoadingButtonNextRound(true);
    const newModel = convertDataToHaveIndexBeforeValidate(
      contextValue.model,
      [],
      contextValue.model
    );

    const requestBody = {
      id: contextValue.model?.id,
      supplierId: contextValue.model?.supplierId,
      name: contextValue.model?.supplierName,
      taxCode: contextValue.model?.taxCode?.code,
      address: contextValue.model?.supplierAddress,
      type: contextValue.model?.supplierType,
      quoteEmail: contextValue.model?.quoteEmail,
      quoteName: contextValue.model?.quoteName,
      phoneNumber: contextValue.model?.phoneNumber,
      content: contextValue.model?.content,
      emailRecipients: contextValue.model.emailRecipients,
      purchasePlanId: contextValue.model?.id,
      roundStartDate:
        contextValue.model?.roundStartDate &&
        dayjs(contextValue.model?.roundStartDate).format(),
      roundEndDate:
        contextValue.model?.roundEndDate &&
        dayjs(contextValue.model?.roundEndDate).format(),
    };

    if (
      contextValue.model?.phoneNumber &&
      PHONE_NUMBER_REGEX.test(contextValue.model?.phoneNumber) == true
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
      return;
    }

    if (!contextValue.model?.phoneNumber) {
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
  };

  const isCreate =
    history.location.pathname === PURCHASING_PLAN_PRINCIPLE_DETAIL_ROUTE;

  return (
    <>
      <PurchasingPlanPrincipleDetailHookContext.Provider
        value={{ ...contextValue } as PurchasingPlanModel}
      >
        <div className={classNames("page-content")}>
          <PageHeader
            title={titlePageHeader}
            breadcrumbs={breadcrumbs}
            className="page-header"
            isShowBackButton
            rightComponentTitle={renderTag()}
            hasTabs={!isCreate}
          >
            <GroupAction handleOpenSigningForm={handleOpenSigningForm} />
          </PageHeader>
          {!isCreate && (
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
            </div>
          )}
          {isCreate && <PurchasePlanPrincipleGenerationInfoTab />}
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
            />
          )}
        </div>
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
        {loading && <LoadingCM />}

        {contextValue.model?.id != null && contextValue.model?.id && (
          <SignProcessModal
            isOpen={openSigningForm}
            loadingSend={loading}
            onCancel={handleCancelSigningForm}
            sendRequest={handleSendRequest}
            requestId={contextValue.model?.id}
            requestField={"id"}
            repository={purchasingPlanRepository}
            haveDigitalSigining
            tempateType={SIGN_PROCESS_TYPE.PRINCIPLE_CONTRACT_PURCHASE_PLAN}
          />
        )}
      </PurchasingPlanPrincipleDetailHookContext.Provider>
    </>
  );
};

export default PurchasingPlanPrincipleDetail;
