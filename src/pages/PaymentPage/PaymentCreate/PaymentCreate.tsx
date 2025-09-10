import classNames from "classnames";
import { LoadingCM, ModalSubmitError } from "components";
import PageHeader from "components/PageHeader/PageHeader";
import { isEmpty, isEqual, isNil } from "lodash";
import {
  PaymentCreateModel,
  PaymentRequestModel,
  RepoStateDetail,
  TYPE_OF_PAYMENT_TYPE,
  TypeOfInvoice,
} from "models/Payment";
import React from "react";
import { Tabs } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useParams } from "react-router-dom";
import { PaymentConfirmModal } from "../PaymentConfirmModal/PaymentConfirmModal";
import GroupAction from "./Components/GroupAction/GroupAction";
import InformationBankTransferModal from "./Components/InformationBankTransfer/InformationBankTransferModal";
import StatusTag from "./Components/StatusTag/StatusTag";
import "./PaymentCreate.scss";
import {
  PaymentCreateHookContext,
  usePaymentCreateHook,
} from "./PaymentCreateHook";
import DepositGenerationInfoTab from "./PaymentCreateTypes/DepositRequest/DepositGenerationInfoTab/DepositGenerationInfoTab";
import { usePaymentSignFormHook } from "./PaymentSignFormHook";
import { paymentRepository } from "../PaymentRepository";
import SignProcessModal from "pages/SignProcess/SignProcessMaster";
import { SIGN_PROCESS_TYPE } from "pages/SignProcess/SignProcessConstanst";

const PaymentCreate = () => {
  const { id: idDetail } = useParams<{ id: string }>();
  const {
    tabRepositories,
    title,
    breadcrumbs,
    translate,
    loading,
    //contextValue
    ...contextValue
  } = usePaymentCreateHook({
    idDetail: idDetail,
  });

  const { errorsModal, path, getLastPath, setErrorsModal } = contextValue;

  const { openSigningForm, handleCancelSigningForm, handleOpenSigningForm } =
    usePaymentSignFormHook();

  const handleSendRequest = React.useCallback(() => {
    contextValue.handleSave(false, idDetail || contextValue.model?.id);
  }, [contextValue, idDetail]);

  const isDepositPaymentTicket = isEqual(
    getLastPath(path, idDetail),
    TYPE_OF_PAYMENT_TYPE.DEPOSIT
  );

  const getPaymentSignProcessType = () => {
    const path = window.location.pathname;
    if (path.includes("payment-detail")) {
      return SIGN_PROCESS_TYPE.PAYMENT_REQUEST;
    } else if (path.includes("payment-advance-detail")) {
      return SIGN_PROCESS_TYPE.PAYMENT_ADVANCE_REQUEST;
    } else if (path.includes("payment-expense-detail")) {
      return SIGN_PROCESS_TYPE.PAYMENT_EXPENSE_REQUEST;
    } else if (path.includes("payment-accounting-entry-detail")) {
      return SIGN_PROCESS_TYPE.PAYMENT_ACCOUNTING_REQUEST;
    } else if (path.includes("payment-deposit-detail")) {
      return SIGN_PROCESS_TYPE.PAYMENT_DEPOSIT_REQUEST;
    }
  };

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories &&
      tabRepositories.length > 0 &&
      tabRepositories.map((tab: RepoStateDetail) => {
        //c Thu update: Hoá đơn cũ cũng được nhìn phân bổ chi phí
        // if (
        //   tab.tabKey === "2" &&
        //   contextValue?.model?.invoiceType?.id == TypeOfInvoice.OLD_INVOICE
        // ) {
        //   return null;
        // }
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: tab.children,
        };
      })
    );
  }, [tabRepositories]);

  return (
    <>
      <PaymentCreateHookContext.Provider
        value={{ ...contextValue, translate } as PaymentCreateModel}
      >
        <div className={classNames("page-content")}>
          <PageHeader
            title={title}
            breadcrumbs={breadcrumbs}
            className="page-header"
            isShowBackButton
            rightComponentTitle={
              <StatusTag
                title={
                  isEmpty(idDetail) ? "" : translate("CM.txt_status_draft")
                }
              />
            }
            hasTabs={!isDepositPaymentTicket}
          >
            <GroupAction
              idDetail={idDetail || contextValue.model?.id}
              handleOpenSigningForm={handleOpenSigningForm}
            />
          </PageHeader>
          <div className="tab__master">
            {isDepositPaymentTicket ? (
              <DepositGenerationInfoTab />
            ) : (
              <Tabs
                className="payment_custom_form"
                tabPosition="top"
                mode="line"
                items={tabItems}
                destroyInactiveTabPane={true}
              />
            )}
          </div>
        </div>
        <InformationBankTransferModal key={contextValue.updateModal} />
        {isEqual(errorsModal.type, "SUBMIT_FAIL") && (
          <ModalSubmitError
            errors={errorsModal?.errors}
            onClose={() => setErrorsModal({ type: "NONE" })}
          />
        )}
        {loading && <LoadingCM />}
      </PaymentCreateHookContext.Provider>
      {!isNil(contextValue.modelSelected?.model) ? (
        <PaymentConfirmModal<PaymentRequestModel>
          model={contextValue.modelSelected.model}
          type={contextValue.modelSelected.type}
          errorMessage={contextValue.modelSelected?.errorMessage}
          isLoading={loading}
          onApply={contextValue.handleApplyButtonInConfirmModal}
          onCancel={() => {
            contextValue.setModelSelected(null);
            contextValue.setAcceptInvoiceWarning((pre) => {
              return { ...pre, acceptInvoiceWarning: false };
            });
          }}
        />
      ) : null}

      {(contextValue.model?.id || idDetail) && (
        <SignProcessModal
          isOpen={openSigningForm}
          loadingSend={loading}
          onCancel={handleCancelSigningForm}
          sendRequest={handleSendRequest}
          requestId={contextValue.model?.id}
          requestField={"id"}
          repository={paymentRepository}
          tempateType={getPaymentSignProcessType()}
        />
      )}
    </>
  );
};

export default PaymentCreate;
