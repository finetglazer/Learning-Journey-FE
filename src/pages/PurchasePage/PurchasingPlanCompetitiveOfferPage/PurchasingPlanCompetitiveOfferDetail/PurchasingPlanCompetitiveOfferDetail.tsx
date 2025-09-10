/* eslint-disable import/no-unresolved */
import { PurchasingPlanModel } from "models/PurchasingPlan";
import { Tag } from "react-components-design-system";
import {
  PurchasingPlanCompetitiveOfferDetailHookContext,
  usePurchasingPlanCompetitiveOfferDetailHook,
} from "./PurchasingPlanCompetitiveOfferDetailHook";
import React, { useState } from "react";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { RepoStateDetail } from "models/Payment";
import ModalSubmitError from "components/ModalSubmitError/ModalSubmitError";
import { isEmpty, isEqual, isNull } from "lodash";
import { LoadingCM } from "components";
import GroupAction from "./Components/GroupAction/GroupAction";
import { listPurchasingPlanStatusEnum } from "config/const";
import dayjs from "dayjs";
import { PHONE_NUMBER_REGEX } from "core/config/consts";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import { finalize } from "rxjs";
import { PurchasingPlanConfirmModal } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import NextRoundBidDrawer from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/Components/NextRoundBidDrawer/NextRoundBidDrawer";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";

const PurchasingPlanCompetitiveOfferDetail = () => {
  const PurchasingPlanCompetitiveOfferContext =
    usePurchasingPlanCompetitiveOfferDetailHook();
  const {
    breadcrumbs,
    tabRepositories,
    errorsModal,
    titlePageHeader,
    loadingConfirm,
    ...contextValue
  } = PurchasingPlanCompetitiveOfferContext;

  const [isOpenDrawerNextRoundBid, setIsOpenDrawerNextRoundBid] =
    useState<boolean>(false);
  const [isLoadingButtonNextRound, setIsLoadingButtonNextRound] =
    useState<boolean>(false);

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

  return (
    <PurchasingPlanCompetitiveOfferDetailHookContext.Provider
      value={{ ...contextValue } as PurchasingPlanModel}
    >
      <LayoutViewDetail
        title={titlePageHeader}
        breadcrumbs={breadcrumbs}
        tabItems={tabItems}
        rightComponentTitle={renderTag()}
        childrenPageHeader={<GroupAction />}
      />

      {isEqual(errorsModal.type, "SUBMIT_FAIL") && (
        <ModalSubmitError
          errors={errorsModal?.errors}
          onClose={() => contextValue?.setErrorsModal({ type: "NONE" })}
        />
      )}

      {isOpenDrawerNextRoundBid && (
        <NextRoundBidDrawer
          isLoadingButtonNextRound={isLoadingButtonNextRound}
          visible={isOpenDrawerNextRoundBid}
          handleClose={handleCloseDrawerNextRoundBid}
          handleSave={handleSaveDrawerNextRoundBid}
          contextValue={PurchasingPlanCompetitiveOfferContext}
        />
      )}
      {contextValue && !isNull(contextValue.modelSelected) ? (
        <PurchasingPlanConfirmModal
          loadingButton={loadingConfirm}
          type={contextValue.modelSelected.type}
          model={contextValue.model}
          isLoading={contextValue.loading}
          errorMessage={contextValue.modelSelected.errorMessage}
          onApply={contextValue.handleApplyButtonInConfirmModal}
          onCancel={() => contextValue.setModelSelected(null)}
          setModelSelected={contextValue.setModelSelected}
        />
      ) : null}

      {contextValue.loading && <LoadingCM />}
    </PurchasingPlanCompetitiveOfferDetailHookContext.Provider>
  );
};

export default PurchasingPlanCompetitiveOfferDetail;
