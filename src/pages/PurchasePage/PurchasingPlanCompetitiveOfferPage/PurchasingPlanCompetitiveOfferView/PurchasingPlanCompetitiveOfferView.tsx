/* eslint-disable import/no-unresolved */
import {
  NegotiationRoundType,
  ParamsConfirmAddingNegotiationRound,
  ParamsConfirmCreateRound,
  ParamsSelectSupplierPrioritize,
  PurchasingPlanModel,
  SupplierModel,
  SupplierQuotationAction,
} from "models/PurchasingPlan";
import { Tag } from "react-components-design-system";

import { LoadingCM } from "components";
import { listPurchasingPlanStatusEnum } from "config/const";
import { isEmpty, isEqual, isNull } from "lodash";
import { RepoStateDetail } from "models/Payment";
import React, { useEffect } from "react";
import { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import {
  PurchasingPlanCompetitiveOfferDetailHookContext,
  usePurchasingPlanCompetitiveOfferDetailHook,
} from "../PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";

import LayoutViewDetail from "components/layouts/ViewDetail/LayoutViewDetail";
import ModalSelectSupplierPurchasingPlan from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferView/Components/ReviewSummaryTab/Components/ModalSelectSupplier/ModalSelectSupplierPurchasingPlan";
import { PurchasingPlanConfirmModal } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/PurchasingPlanConfirmModal";
import GroupActionView from "./Components/GroupActionView";
import ModalNextRoundBid from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferView/Components/ReviewSummaryTab/Components/ModalNextRoundBid/ModalNextRoundBid";
import ModalAddSupplierQuote from "./Components/ModalAddSupplierQuote/ModalAddSupplierQuote";
import ModalProceedNegotiation from "./Components/ModalProceedNegotiation/ModalProceedNegotiation";
import PrioritySupplierModal from "./Components/PrioritySupplierModal/PrioritySupplierModal";
import ModalListSuppliers from "../PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/SupplierInformation/Components/ModalListSuppliers/ModalListSuppliers";
import ModalSubmitError from "components/ModalSubmitError/ModalSubmitError";
import "./PurchasingPlanCompetitiveOfferView.scss";
import DrawerQuoteReview from "./Components/DrawerQuoteReview/DrawerQuoteReview";

const PurchasingPlanCompetitiveOfferView = () => {
  const isDetail = true;
  const contextValue = usePurchasingPlanCompetitiveOfferDetailHook(isDetail);

  const {
    loading,
    breadcrumbs,
    tabRepositoriesView,
    loadingConfirm,
    isDrawerQuote,
    setIsOpenModalNextRoundBid,
    actionQuote,
    handleSubmitConfirmAddingNegotiationRound,
    errorsModal,
    setErrorsModal,
    handleSubmitCreateNextQuotationRound,
    handleSubmitSelectSupplierPriority,
  } = contextValue;

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositoriesView &&
      tabRepositoriesView.length > 0 &&
      tabRepositoriesView.map((tab: RepoStateDetail) => {
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: tab.children,
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
          isShowBorder={true}
        />
      </div>
    );
  };
  useEffect(() => {
    if (!contextValue.isOpenModalAddSupplierQuote) {
      contextValue.setIsOpenModalSupplierQuote(false);
    }
  }, [contextValue, contextValue.isOpenModalAddSupplierQuote]);

  const handleSelectSupplierProceedNegotiation = async (list: string[]) => {
    await contextValue?.handleSubmitSelectSupplierForNegotiation(list);
    contextValue.setIsOpenProceedNegotiationModal(false);
  };

  //Xác nhận thêm vòng đàm phán và xác nhận thêm nhà cung cấp chào giá
  const handleConfirmAddingNegotiationRound = async (data: any) => {
    const isAddNegotiationRound = isEqual(
      actionQuote,
      SupplierQuotationAction.AddNegotiationRound
    );

    const masterSupplierAddQuote = data?.masterSupplierAddQuote;

    if (isAddNegotiationRound) {
      const dataSubmit: ParamsConfirmCreateRound = {
        roundStartDate: masterSupplierAddQuote?.bidStartDate,
        roundEndDate: masterSupplierAddQuote?.bidEndDate,
        type: NegotiationRoundType.NegotiationRound,
        purchasePlanId: contextValue?.model?.id,
        suppliers: masterSupplierAddQuote?.listSupplierAddQuote?.map(
          (item: any) => ({
            supplierId: item?.supplierId,
            quoteName: item?.quoteName,
            quoteEmail: item?.quoteEmail,
            emailRecipients: item?.emailReceiverInfo?.map((item: any) => ({
              email: item?.email,
              name: item?.name,
            })),
          })
        ),
      };
      await handleSubmitConfirmAddingNegotiationRound(dataSubmit);
    } else {
      const dataSubmit: ParamsConfirmCreateRound = {
        roundStartDate: masterSupplierAddQuote?.bidStartDate,
        roundEndDate: masterSupplierAddQuote?.bidEndDate,
        roundOpenDate: masterSupplierAddQuote?.openBidDate,
        type: NegotiationRoundType.CreateRound,
        purchasePlanId: contextValue?.model?.id,
        suppliers: masterSupplierAddQuote?.listSupplierAddQuote?.map(
          (item: any) => ({
            supplierId: item?.id,
            quoteName: item?.quoteName,
            quoteEmail: item?.quoteEmail,
            emailRecipients: item?.emailReceiverInfo?.map((item: any) => ({
              email: item?.email,
              name: item?.name,
            })),
          })
        ),
      };
      await handleSubmitCreateNextQuotationRound(dataSubmit);
    }
  };

  //Xác nhận chọn nhà cung cấp ưu tiên đàm phán
  const handleConfirmPrioritySupplier = async (data: any) => {
    const selectedIdSupplier = data?.masterPrioritySupplierSelectedKey;
    const dataSubmit: ParamsSelectSupplierPrioritize = {
      supplierId: selectedIdSupplier?.[0],
      id: contextValue?.model?.id,
      isPriority: true,
    };
    await handleSubmitSelectSupplierPriority(dataSubmit);
    contextValue.setIsOpenPrioritySupplier(false);
  };

  return (
    <PurchasingPlanCompetitiveOfferDetailHookContext.Provider
      value={{ ...contextValue } as PurchasingPlanModel}
    >
      <LayoutViewDetail
        title={
          isEmpty(contextValue?.model?.idDetail)
            ? contextValue.translate("PL.purchasing_plan_title_create")
            : `${contextValue.translate("PL.purchase_plan")} ${
                contextValue?.model?.code
              }`
        }
        breadcrumbs={breadcrumbs}
        tabItems={tabItems}
        rightComponentTitle={renderTag()}
        hasTabs={true}
        containerClassName="layout-bidding-view"
        childrenPageHeader={<GroupActionView />}
        activeKey={contextValue?.tabKey}
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
          isRejectCancel={true}
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
        <ModalSelectSupplierPurchasingPlan
          open={contextValue.isOpenModalSelectSupplier}
          handleCancel={() => contextValue.setIsOpenModalSelectSupplier(false)}
          onPressSave={() => {
            // code on press save
          }}
        />
      )}

      {contextValue.isOpenModalNextRoundBid && (
        <ModalNextRoundBid
          open={contextValue.isOpenModalNextRoundBid}
          handleCancel={() => setIsOpenModalNextRoundBid(false)}
          onPressConfirm={() => setIsOpenModalNextRoundBid(false)}
        />
      )}

      {/* Modal thêm vòng đàm phán và thêm NCC Chào giá */}
      <ModalAddSupplierQuote
        open={contextValue.isOpenModalAddSupplierQuote}
        contextValue={contextValue}
        handleCancel={() => {
          contextValue.setIsOpenModalAddSupplierQuote(false);
          contextValue?.handleChangeAllField({
            ...contextValue?.model,
            masterSupplierAddQuote: null,
            errors: {
              ...contextValue?.model?.errors,
              roundStartDate: null,
              roundEndDate: null,
              roundOpenDate: null,
              suppliers: null,
            },
          });
        }}
        onPressConfirm={(modelPass) => {
          handleConfirmAddingNegotiationRound(modelPass);
        }}
        titleModel={
          isEqual(actionQuote, SupplierQuotationAction.AddSupplierQuotation)
            ? "PL.txt_next_bidding_opening_time"
            : "PL.txt_confirm_adding_negotiation_round"
        }
        titleList={
          isEqual(actionQuote, SupplierQuotationAction.AddSupplierQuotation)
            ? "PL.invited_supplier_list_for_next_round"
            : "PL.txt_suppliers_required_to_resubmit_quotation"
        }
        idContainer={"modal-add-supplier-quote"}
        isNotConfirmDelete={true}
        actionQuote={actionQuote}
        loading={loading}
      />

      {/* Modal chọn NCC tiến hành đàm phán */}
      {contextValue.isOpenProceedNegotiationModal && (
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
          actionQuote={actionQuote}
        />
      )}

      {/*modal chọn nhà cung cấp ưu tiên đàm phán*/}
      {contextValue.isOpenPrioritySupplier && (
        <PrioritySupplierModal
          open={contextValue.isOpenPrioritySupplier}
          handleCancel={() => contextValue.setIsOpenPrioritySupplier(false)}
          onPressConfirm={(modelPass) => {
            handleConfirmPrioritySupplier(modelPass);
          }}
          titleModel={
            "PL.txt_confirm_prioritized_supplier_for_negotiation_title"
          }
          titleList={
            "PL.txt_confirm_prioritized_supplier_for_negotiation_subtitle"
          }
          idContainer={"modal-proceedNegotiation"}
          isNotConfirmDelete={true}
          actionQuote={actionQuote}
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
          contextValue={contextValue}
          isModalAddSupplierQuote={true}
          actionQuote={actionQuote}
        />
      )}

      {isEqual(errorsModal.type, "SUBMIT_FAIL") && (
        <ModalSubmitError
          errors={errorsModal?.errors}
          onClose={() => setErrorsModal({ type: "NONE" })}
        />
      )}

      {loading && <LoadingCM />}
    </PurchasingPlanCompetitiveOfferDetailHookContext.Provider>
  );
};

export default PurchasingPlanCompetitiveOfferView;
