/* eslint-disable import/no-unresolved */
import {
  NegotiationRoundType,
  ParamsConfirmCreateRound,
  ParamsSelectSupplierPrioritize,
  PurchasingPlanModel,
  SupplierModel,
  SupplierQuotationAction,
} from "models/PurchasingPlan";
import { Tag } from "react-components-design-system";

import { LoadingCM, ModalSubmitError } from "components";
import { listPurchasingPlanStatusEnum } from "config/const";
import { isEmpty, isEqual, isNull } from "lodash";
import { RepoStateDetail } from "models/Payment";
import React, { useEffect } from "react";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import {
  PurchasingPlanBiddingDetailHookContext,
  usePurchasingPlanBiddingDetailHook,
} from "../PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import { PurchasingPlanConfirmModal } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import GroupActionView from "./Components/GroupActionView";
import ModalSelectSupplier from "./Components/ReviewSummaryTab/Components/ModalSelectSupplier/ModalSelectSupplier";
import "./PurchasingPlanBiddingView.scss";
import { useHistory } from "react-router";
import ModalNextRoundBid from "./Components/ReviewSummaryTab/Components/ModalNextRoundBid/ModalNextRoundBid";
import DrawerQuoteReview from "./Components/ReviewSummaryTab/Components/DrawerQuoteReview/DrawerQuoteReview";
import ModalListSuppliers from "./Components/ModalAddSupplierQuote/ModalListSuppliers/ModalListSuppliers";
import ModalAddSupplierQuote from "./Components/ModalAddSupplierQuote/ModalAddSupplierQuote/ModalAddSupplierQuote";
import ModalProceedNegotiation from "./Components/ModalProceedNegotiation/ModalProceedNegotiation";
import PrioritySupplierModal from "./Components/PrioritySupplierModal/PrioritySupplierModal";
import { getISOStringDate } from "core/helpers/date-time";
import dayjs from "dayjs";

const PurchasingPlanBiddingView = () => {
  const history = useHistory();
  const isDetail = true;
  const contextValue = usePurchasingPlanBiddingDetailHook(isDetail);

  const {
    loading,
    breadcrumbs,
    tabRepositoriesView,
    loadingConfirm,
    isDrawerQuote,
    isOpenModalNextRoundBid,
    titlePageHeader,
    tabKey,
    setTabKey,
    isOpenModalAddSupplierQuote,
  } = contextValue;

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositoriesView &&
      tabRepositoriesView.length > 0 &&
      tabRepositoriesView.map((tab: RepoStateDetail) => {
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: <div className="scroll-page">{tab.children}</div>,
        };
      })
    );
  }, [tabRepositoriesView]);

  const handleChangeTabs = (key: string) => {
    setTabKey(key);
    const searchParams = new URLSearchParams(history.location.search);

    searchParams.set("tabKey", key);

    const url = `${history.location.pathname}?${searchParams.toString()}`;

    history.replace(url);
  };

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

  const isNegotiationRound =
    contextValue?.actionQuote === SupplierQuotationAction.AddNegotiationRound;

  // Tối ưu hàm xác nhận thêm vòng đàm phán và chào giá với tất cả fields mới
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
          biddingProcedure: contextValue?.model?.biddingProcedure,
        };
        await contextValue.handleSubmitConfirmAddingNegotiationRound?.(
          dataSubmit
        );
      } else {
        // Tạo vòng chào giá mới - sử dụng tất cả các field từ modal
        const dataSubmit: ParamsConfirmCreateRound = {
          releaseDate: getISOStringDate(dayjs()),
          roundStartDate: masterSupplierAddQuote?.roundStartDate,
          roundEndDate: masterSupplierAddQuote?.roundEndDate,
          roundOpenDate: masterSupplierAddQuote?.roundOpenDate,
          evaluateStartDate: masterSupplierAddQuote?.evaluateStartDate,
          evaluateEndDate: masterSupplierAddQuote?.evaluateEndDate,
          type: NegotiationRoundType.CreateRound,
          purchasePlanId: contextValue?.model?.id,
          suppliers: commonSuppliers,
          biddingProcedure: contextValue?.model?.biddingProcedure,
        };
        await contextValue.handleSubmitCreateNextQuotationRound?.(dataSubmit);
      }
    } catch (error) {
      console.error("Error in handleConfirmAddingNegotiationRound:", error);
    }
  };

  useEffect(() => {
    if (!isOpenModalAddSupplierQuote) {
      contextValue?.setIsOpenModalAddSupplierQuote(false);
    }
  }, [isOpenModalAddSupplierQuote]);

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
      isPriority: true,
    };
    await contextValue?.handleSubmitSelectSupplierPriority?.(dataSubmit);
    contextValue.setIsOpenPrioritySupplier?.(false);
  };

  return (
    <PurchasingPlanBiddingDetailHookContext.Provider
      value={contextValue as unknown as PurchasingPlanModel}
    >
      <LayoutViewDetail
        title={titlePageHeader}
        breadcrumbs={breadcrumbs}
        tabItems={tabItems}
        rightComponentTitle={renderTag()}
        hasTabs={true}
        containerClassName="layout-bidding-view"
        childrenPageHeader={<GroupActionView />}
        activeKey={tabKey}
        setTabKey={handleChangeTabs}
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
        />
      ) : null}
      {isDrawerQuote && (
        <DrawerQuoteReview
          onPressClose={() => {
            contextValue.handleCloseDrawerQuote();
          }}
        />
      )}

      {contextValue.isOpenModalSelectSupplier && (
        <ModalSelectSupplier
          open={contextValue.isOpenModalSelectSupplier}
          handleCancel={() => contextValue.setIsOpenModalSelectSupplier(false)}
          onPressSave={() => {
            // code on press save
          }}
        />
      )}

      {isOpenModalNextRoundBid && (
        <ModalNextRoundBid
          open={isOpenModalNextRoundBid}
          handleCancel={() => contextValue.setIsOpenModalNextRoundBid(false)}
          onPressConfirm={() => contextValue.setIsOpenModalNextRoundBid(false)}
        />
      )}

      {/* Modal thêm vòng đàm phán và thêm NCC Chào giá */}
      {isOpenModalAddSupplierQuote && (
        <ModalAddSupplierQuote
          open={isOpenModalAddSupplierQuote}
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
          loading={loading}
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

      {isEqual(contextValue.errorsModal.type, "SUBMIT_FAIL") && (
        <ModalSubmitError
          errors={contextValue.errorsModal?.errors}
          onClose={() => contextValue.setErrorsModal({ type: "NONE" })}
        />
      )}

      {loading && <LoadingCM />}
    </PurchasingPlanBiddingDetailHookContext.Provider>
  );
};

export default PurchasingPlanBiddingView;
