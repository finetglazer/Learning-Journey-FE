/* eslint-disable import/no-unresolved */
import { LoadingCM } from "components";
import ModalSubmitError from "components/ModalSubmitError/ModalSubmitError";
import { listPurchasingPlanStatusEnum } from "config/const";
import { PHONE_NUMBER_REGEX } from "core/config/consts";
import { convertDataToHaveIndexBeforeValidate } from "core/services/page-services/detail-service";
import dayjs from "dayjs";
import { isEmpty, isEqual, isNull } from "lodash";
import { RepoStateDetail } from "models/Payment";
import {
  NegotiationRoundType,
  ParamsConfirmCreateRound,
  PurchasingPlanModel,
  SupplierModel,
  SupplierQuotationAction,
} from "models/PurchasingPlan";
import NextRoundBidDrawer from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/Components/NextRoundBidDrawer/NextRoundBidDrawer";
import { PurchasingPlanConfirmModal } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import React, { useState } from "react";
import { Tabs, Tag } from "react-components-design-system";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useHistory } from "react-router-dom";
import { finalize } from "rxjs";
import GroupAction from "./Components/GroupAction/GroupAction";
import {
  PurchasingPlanBiddingDetailHookContext,
  usePurchasingPlanBiddingDetailHook,
} from "./PurchasingPlanBiddingDetailHook";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import DrawerQuoteReview from "../PurchasingPlanBiddingView/Components/ReviewSummaryTab/Components/DrawerQuoteReview/DrawerQuoteReview";
import ModalAddSupplierQuote from "../PurchasingPlanBiddingView/Components/ModalAddSupplierQuote/ModalAddSupplierQuote/ModalAddSupplierQuote";
import ModalListSuppliers from "../PurchasingPlanBiddingView/Components/ModalAddSupplierQuote/ModalListSuppliers/ModalListSuppliers";
import ModalProceedNegotiation from "../PurchasingPlanBiddingView/Components/ModalProceedNegotiation/ModalProceedNegotiation";
import PrioritySupplierModal from "../PurchasingPlanBiddingView/Components/PrioritySupplierModal/PrioritySupplierModal";

const PurchasingPlanBiddingDetail = () => {
  const contextValue = usePurchasingPlanBiddingDetailHook();
  const {
    model,
    breadcrumbs,
    tabRepositories,
    setTabKey,
    titlePageHeader,
    loadingConfirm,
    isDrawerQuote,
    handleCreateNextQuotationRound,
    handleConfirmSelectFinalSupplier,
    handleConfirmNextNegotiationRound,
  } = contextValue;

  const history = useHistory();
  const [isOpenDrawerNextRoundBid, setIsOpenDrawerNextRoundBid] =
    useState<boolean>(false);
  const [isLoadingButtonNextRound, setIsLoadingButtonNextRound] =
    useState<boolean>(false);

  const handleChangeTabs = (key: string) => {
    setTabKey(key);
    const searchParams = new URLSearchParams(history.location.search);

    searchParams.set("tabKey", key);

    const url = `${history.location.pathname}?${searchParams.toString()}`;

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
          children: <div className="scroll-page">{tab.children}</div>,
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

  // Thêm function để clear tất cả field values
  const clearAllFields = () => {
    contextValue.handleChangeAllField({
      ...contextValue?.model,
      errors: {},
      masterSupplierAddQuote: {
        releaseDate: null,
        roundStartDate: null,
        roundEndDate: null,
        roundOpenDate: null,
        evaluateStartDate: null,
        evaluateEndDate: null,
        // Thêm các field khác nếu cần clear
      },
    });
  };

  const isNegotiationRound =
    contextValue?.actionQuote === SupplierQuotationAction.AddNegotiationRound;

  const handleConfirmAddingNegotiationRound = async (data: any) => {
    try {
      const masterSupplierAddQuote = data?.masterSupplierAddQuote;

      // Chuẩn bị data suppliers chung cho cả 2 loại
      const commonSuppliers = masterSupplierAddQuote?.listSupplierAddQuote?.map(
        (item: any) => ({
          supplierId: isNegotiationRound ? item?.supplierId : item?.id,
          quoteName: item?.quoteName,
          quoteEmail: item?.quoteEmail,
          emailRecipients:
            item?.emailReceiverInfo?.map((recipient: any) => ({
              email: recipient?.email,
              name: recipient?.name,
            })) || [],
        })
      );

      if (isNegotiationRound) {
        // Thêm vòng đàm phán - chỉ cần roundStartDate và roundEndDate
        const dataSubmit: ParamsConfirmCreateRound = {
          roundStartDate: masterSupplierAddQuote?.roundStartDate,
          roundEndDate: masterSupplierAddQuote?.roundEndDate,
          type: NegotiationRoundType.NegotiationRound,
          purchasePlanId: contextValue?.model?.id,
          suppliers: commonSuppliers,
        };
        await contextValue.handleSubmitConfirmAddingNegotiationRound?.(
          dataSubmit
        );
      } else {
        // Tạo vòng chào giá mới - sử dụng tất cả các field từ modal
        const dataSubmit: ParamsConfirmCreateRound = {
          releaseDate: masterSupplierAddQuote?.releaseDate,
          roundStartDate: masterSupplierAddQuote?.roundStartDate,
          roundEndDate: masterSupplierAddQuote?.roundEndDate,
          roundOpenDate: masterSupplierAddQuote?.roundOpenDate,
          evaluateStartDate: masterSupplierAddQuote?.evaluateStartDate,
          evaluateEndDate: masterSupplierAddQuote?.evaluateEndDate,
          type: NegotiationRoundType.CreateRound,
          purchasePlanId: contextValue?.model?.id,
          suppliers: commonSuppliers,
        };
        await contextValue.handleSubmitCreateNextQuotationRound?.(dataSubmit);
      }
    } catch (error) {
      console.error("Error in handleConfirmAddingNegotiationRound:", error);
    }
  };

  // Thêm hàm xử lý select supplier proceed negotiation
  const handleSelectSupplierProceedNegotiation = async (list: string[]) => {
    await contextValue?.handleSubmitSelectSupplierForNegotiation?.(list);
    contextValue.setIsOpenProceedNegotiationModal?.(false);
  };

  // Thêm hàm xử lý confirm priority supplier
  const handleConfirmPrioritySupplier = async (data: any) => {
    const selectedIdSupplier = data?.masterPrioritySupplierSelectedKey;
    const dataSubmit = {
      supplierId: selectedIdSupplier?.[0],
      id: contextValue?.model?.id,
      isPriority: false,
    };
    await contextValue?.handleSubmitSelectSupplierPriority?.(dataSubmit);
    contextValue.setIsOpenPrioritySupplier?.(false);
  };

  return (
    <>
      <PurchasingPlanBiddingDetailHookContext.Provider value={contextValue}>
        <LayoutViewDetail
          title={titlePageHeader}
          breadcrumbs={breadcrumbs}
          tabItems={tabItems}
          rightComponentTitle={renderTag()}
          childrenPageHeader={
            <GroupAction
              onCreateNextQuotationRound={handleCreateNextQuotationRound}
              onConfirmNextNegotiationRound={handleConfirmNextNegotiationRound}
              onConfirmSelectFinalSupplier={handleConfirmSelectFinalSupplier}
            />
          }
        />
        {isEqual(contextValue.errorsModal.type, "SUBMIT_FAIL") && (
          <ModalSubmitError
            errors={contextValue.errorsModal?.errors}
            onClose={() => contextValue.setErrorsModal({ type: "NONE" })}
          />
        )}
        {isOpenDrawerNextRoundBid && (
          <NextRoundBidDrawer
            isLoadingButtonNextRound={isLoadingButtonNextRound}
            visible={isOpenDrawerNextRoundBid}
            handleClose={handleCloseDrawerNextRoundBid}
            handleSave={handleSaveDrawerNextRoundBid}
            contextValue={contextValue}
          />
        )}
        {contextValue && !isNull(contextValue.modelSelected) ? (
          <PurchasingPlanConfirmModal
            loadingButton={loadingConfirm}
            type={contextValue.modelSelected.type}
            model={contextValue.model as unknown as PurchasingPlanModel}
            isLoading={contextValue.loading}
            errorMessage={contextValue.modelSelected.errorMessage}
            onApply={contextValue.handleApplyButtonInConfirmModal}
            onCancel={() => contextValue.setModelSelected(null)}
            setModelSelected={contextValue.setModelSelected}
          />
        ) : null}
        {isDrawerQuote && (
          <DrawerQuoteReview
            onPressClose={() => contextValue.setIsDrawerQuote(false)}
          />
        )}
        {/* Modal thêm vòng đàm phán và thêm NCC Chào giá */}
        {contextValue?.isOpenModalAddSupplierQuote && (
          <ModalAddSupplierQuote
            open={contextValue?.isOpenModalAddSupplierQuote}
            handleCancel={() => {
              contextValue?.setIsOpenModalAddSupplierQuote(false);
              clearAllFields();
            }}
            onPressConfirm={handleConfirmAddingNegotiationRound}
            titleModel={
              isNegotiationRound
                ? "PL.txt_confirm_adding_negotiation_round"
                : "PL.txt_next_bidding_opening_time"
            }
            titleList={
              isNegotiationRound
                ? "PL.txt_suppliers_required_to_resubmit_quotation"
                : "PL.invited_supplier_list_for_next_round"
            }
            actionQuote={contextValue?.actionQuote}
            contextValue={contextValue as unknown as PurchasingPlanModel}
            loading={contextValue?.loading}
            isNotConfirmDelete={true}
            idContainer="modal-add-supplier-quote"
          />
        )}
        {contextValue.isOpenModalSupplierQuote && (
          <ModalListSuppliers
            open={contextValue.isOpenModalSupplierQuote}
            handleCancelModalSupplier={() => {
              contextValue.setIsOpenModalSupplierQuote(false);
            }}
            handleApplySupplier={(data: SupplierModel[]) => {
              contextValue.handleApplySupplier(data, contextValue.model);
            }}
            contextValue={contextValue as any}
            isModalAddSupplierQuote={true}
            actionQuote={contextValue?.actionQuote}
          />
        )}

        {/*chọn nhà cung cấp tiến hành đàm phán*/}
        {contextValue?.isOpenProceedNegotiationModal && (
          <ModalProceedNegotiation
            open={contextValue.isOpenProceedNegotiationModal}
            handleCancel={() =>
              contextValue.setIsOpenProceedNegotiationModal(false)
            }
            onPressConfirm={(_, idsSupplierSave) => {
              handleSelectSupplierProceedNegotiation(idsSupplierSave);
            }}
            titleModel={"PL.txt_proceedNegotiation_title"}
            titleList={"PL.txt_proceedNegotiation_subtitle"}
            idContainer={"modal-proceedNegotiation"}
            isNotConfirmDelete={true}
            actionQuote={contextValue?.actionQuote}
          />
        )}

        {/*chọn nhà cung nhấp ưu tiên chốt*/}
        {contextValue?.isOpenPrioritySupplier && (
          <PrioritySupplierModal
            open={contextValue.isOpenPrioritySupplier}
            handleCancel={() => contextValue.setIsOpenPrioritySupplier(false)}
            onPressConfirm={(modelPass) => {
              handleConfirmPrioritySupplier(modelPass);
            }}
            titleModel={"PL.confirm_select_final_supplier_for_plan"}
            titleList={"PL.final_supplier_list_for_plan"}
            idContainer={"modal-proceedNegotiation"}
            isNotConfirmDelete={true}
            actionQuote={contextValue.actionQuote}
          />
        )}
        {contextValue.loading && <LoadingCM />}
      </PurchasingPlanBiddingDetailHookContext.Provider>
    </>
  );
};

export default PurchasingPlanBiddingDetail;
