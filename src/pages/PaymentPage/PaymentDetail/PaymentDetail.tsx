import classNames from "classnames";
import { LoadingCM } from "components";
import CommandGroupComponent from "components/CommandGroupComponent/CommandGroupComponent";
import { ButtonOpinion } from "components/OpinionBase/Button";
import { useOpinionFeedbackHooks } from "components/OpinionBase/opinionFeedbackHooks";
import PageHeader from "components/PageHeader/PageHeader";
import { listStatusEnum } from "config/const";
import { PAYMENT_MASTER_ROUTE } from "config/route-const";
import { isEqual } from "lodash";
import {
  PAYMENT_DETAIL_TAB,
  PaymentDetailModel,
  RepoStateDetail,
  TypeOfInvoice,
} from "models/Payment";
import React, { Fragment, useMemo, useState } from "react";
import { Button, Tabs, Tag } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useHistory } from "react-router";
import { paymentRepository } from "../PaymentRepository";
import ModalConfirmPaymentRequest, {
  EConfirmType,
} from "./Components/ModalConfirmPaymentRequest/ModalConfirmPaymentRequest";
import {
  PaymentDetailHookContext,
  usePaymentDetailHook,
} from "./PaymentDetailHook";
import InformationBankTransferModal from "./PaymentDetailTypes/PaymentTab/PaymentGeneralInfoDetailTab/Components/InfomationBankTransferModal/InfomationBankTransferModal";

const PaymentDetailTestWorkflow = () => {
  const {
    breadcrumbs,
    tabRepositories,
    loading,
    renderTitleHeader,
    ...contextValue
  } = usePaymentDetailHook({
    isDetail: true,
  });

  const {
    modal,
    model,
    setModalType,
    translate,
    handleDirectToEditPage,
    handleChangeSingleField,
  } = contextValue;

  const history = useHistory();
  const location = new URLSearchParams(window.location.search);
  const tabKeyParams = location.get("tabKey");
  const [tabKey, setTabKey] = useState<string>(
    tabKeyParams ? tabKeyParams : "0"
  );

  const cancelButtonType = useMemo(
    () =>
      model?.paymentDetailInfomation?.canCancel &&
      !model?.paymentDetailInfomation?.canDelete &&
      !model?.paymentDetailInfomation?.canEdit
        ? "primary"
        : "secondary",
    [
      model?.paymentDetailInfomation?.canCancel,
      model?.paymentDetailInfomation?.canDelete,
      model?.paymentDetailInfomation?.canEdit,
    ]
  );

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories &&
      tabRepositories.length > 0 &&
      tabRepositories.map((tab: RepoStateDetail) => {
        if (
          tab.tabKey === PAYMENT_DETAIL_TAB.COST_ALLOCATION_TAB &&
          contextValue?.model?.paymentDetailInfomation?.invoiceType ==
            TypeOfInvoice.OLD_INVOICE
        ) {
          return null;
        }
        return {
          label: tab.tabTitle,
          key: tab.tabKey,
          children: tab.children,
        };
      })
    );
  }, [
    tabRepositories,
    contextValue?.model?.paymentDetailInfomation?.invoiceType,
    contextValue?.model?.listERP,
  ]);

  const renderTag = () => {
    if (contextValue?.model?.paymentDetailInfomation) {
      const item = listStatusEnum.find(
        (type) =>
          type.id === contextValue?.model?.paymentDetailInfomation?.status
      );
      return (
        <div className="d-flex align-center m-l--2xs">
          <Tag
            size="md"
            value={item?.name}
            status={item?.code}
            isShowDot={false}
            isShowBorder={true}
          />
        </div>
      );
    }
  };

  const handleChangeTabs = (key: string) => {
    setTabKey(key);
    const searchParams = new URLSearchParams(history.location.search);

    searchParams.set("tabKey", key);

    const url = `${history.location.pathname}?${searchParams.toString()}`;

    history.replace(url);
  };

  const handleGoMaster = React.useCallback(() => {
    history.push(PAYMENT_MASTER_ROUTE);
  }, [history]);

  const renderApproveGroupButton = (
    <Fragment>
      <CommandGroupComponent
        model={model?.paymentDetailInfomation}
        handleChangeSingleField={handleChangeSingleField}
        handleActions={paymentRepository.actions}
        handleGoMaster={handleGoMaster}
        menu={translate("CM.menu_title_payment")}
        hideButtonApprove={!model?.paymentDetailInfomation?.isOpinionValid}
        reasonOutModel={model?.reason}
      />

      {model?.paymentDetailInfomation?.canDelete && (
        <Button
          type="secondary"
          size="lg"
          onClick={() => setModalType(EConfirmType.DELETE)}
        >
          {translate("CM.txt_delete")}
        </Button>
      )}
      {model?.paymentDetailInfomation?.canCancel && (
        <Button
          type={cancelButtonType}
          size="lg"
          onClick={() => setModalType(EConfirmType.CANCEL)}
        >
          {translate("CM.txt_cancel")}
        </Button>
      )}
      {model?.paymentDetailInfomation?.canEdit && (
        <Button type="primary" size="lg" onClick={handleDirectToEditPage}>
          {translate("CM.txt_editable")}
        </Button>
      )}
    </Fragment>
  );

  const { hasFeedBack } = useOpinionFeedbackHooks();

  return (
    <>
      <PaymentDetailHookContext.Provider
        value={{ ...contextValue } as PaymentDetailModel}
      >
        <div className={classNames("page-content")}>
          <PageHeader
            title={renderTitleHeader()}
            breadcrumbs={breadcrumbs}
            className="page-header"
            isShowBackButton
            rightComponentTitle={renderTag()}
            hasTabs={true}
          >
            <div className="group_action_button">
              {isEqual(hasFeedBack, true) ? (
                <ButtonOpinion />
              ) : (
                renderApproveGroupButton
              )}
            </div>
          </PageHeader>
          <div className="tab__master">
            <Tabs
              className="payment_custom_form"
              tabPosition="top"
              mode="line"
              items={tabItems}
              destroyInactiveTabPane={true}
              onChange={(key) => handleChangeTabs(key)}
              activeKey={tabKey}
            />
          </div>
        </div>
        {loading && <LoadingCM />}

        {(isEqual(modal, EConfirmType.CANCEL) ||
          isEqual(modal, EConfirmType.DELETE)) && (
          <ModalConfirmPaymentRequest confirmType={modal as EConfirmType} />
        )}
        <InformationBankTransferModal />
      </PaymentDetailHookContext.Provider>
    </>
  );
};

export default PaymentDetailTestWorkflow;
