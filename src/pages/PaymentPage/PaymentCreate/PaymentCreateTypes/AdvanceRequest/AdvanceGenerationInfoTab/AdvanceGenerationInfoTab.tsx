import { Collapse } from "antd";
import { CollapseProps } from "antd/lib";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { CODE_TYPE_ADVANCE_TUNCC, PAYMENT_METHOD_TYPES } from "models/Payment";
import AttachedDocumentsTable from "pages/PaymentPage/PaymentCreate/Components/AttachedDocumentsTable/AttachedDocumentsTable";
import InformationBankTransfer from "pages/PaymentPage/PaymentCreate/Components/InformationBankTransfer/InformationBankTransfer";
import ProposerPeople from "pages/PaymentPage/PaymentCreate/Components/ProposerPeople/ProposerPeople";
import PurchasingDocumentsTable from "pages/PaymentPage/PaymentCreate/Components/PurchasingDocumentsTable/PurchasingDocumentsTable";
import Supplier from "pages/PaymentPage/PaymentCreate/Components/Supplier/Supplier";
import WithHoldNotPay from "pages/PaymentPage/PaymentCreate/Components/WithHoldNotPay/WithHoldNotPay";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { useContext } from "react";
import AdvanceProposalContent from "./Components/AdvanceProposalContent/AdvanceProposalContent";
import AdvanceProposedValue from "./Components/AdvanceProposedValue/AdvanceProposedValue";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import { Comments } from "components/Comment/Comment.stories";
import { TopicType } from "core/models/History";
import PaymentOpinion from "components/OpinionBase/Payment";
import { numberConstants } from "core/config/consts";
import { useParams } from "react-router-dom";
import { isEmpty, isEqual } from "lodash";

enum EAdvanceInformationSectionKey {
  REQUEST_GENERAL,
  PURCHASING_DOCUMENT,
  ATTACHED_DOCUMENT,
}

enum ItemsOfGeneralInformationSectionKey {
  INFORMATION_TRANSFER,
  WITHHOLD_NOT_PAY,
  SUPPLIER,
}

function AdvanceGenerationInfoTab() {
  const { translate, model } = useContext(PaymentCreateHookContext);

  const renderRequestGeneral = () => (
    <div className="payment-custom_grid p-b--3xs">
      <div className="payment-custom_grid-col_10">
        <div className="payment-custom_grid-col_10">
          {/* Nội dung đề nghị */}
          <AdvanceProposalContent />
          {
            <div className="payment-custom_grid-col_10 m-y--lg payment-title_collage">
              <Collapse
                ghost
                className="collage_custom collage_custom_border"
                items={collapseItemsInGeneral}
                defaultActiveKey={[
                  ItemsOfGeneralInformationSectionKey.INFORMATION_TRANSFER,
                  ItemsOfGeneralInformationSectionKey.WITHHOLD_NOT_PAY,
                  ItemsOfGeneralInformationSectionKey.SUPPLIER,
                ]}
                expandIconPosition="end"
                expandIcon={({ isActive }) => (
                  <div>
                    <img
                      src={IcArrowDown}
                      className={classNames(
                        "invoice-transition",
                        isActive && "invoice-transition_expand"
                      )}
                      alt=""
                    />
                  </div>
                )}
              />
            </div>
          }
        </div>
      </div>

      <div className="payment-custom_grid-col_4 payment-min_w_360">
        {/* Giá trị đề nghị */}
        <AdvanceProposedValue />
        <div className="m-t--2xl">
          {/* Người đề nghị */}
          <ProposerPeople />
        </div>
      </div>
    </div>
  );

  const isShowBankTransfer =
    isEqual(
      model.paymentMethod?.id.toString(),
      PAYMENT_METHOD_TYPES[0].id.toString()
    ) ||
    isEqual(
      model.paymentMethod?.id.toString(),
      PAYMENT_METHOD_TYPES[1].id.toString()
    );
  const collapseItemsInGeneral: CollapseProps["items"] = [
    isEqual(model.paymentRequestType?.code, CODE_TYPE_ADVANCE_TUNCC) && {
      key: ItemsOfGeneralInformationSectionKey.SUPPLIER,
      label: (
        <div className="fw-semibold">
          {translate("PM.payment_supplier_title")}
        </div>
      ),
      children: <Supplier />,
    },
    isShowBankTransfer && {
      key: ItemsOfGeneralInformationSectionKey.INFORMATION_TRANSFER,
      label: (
        <div className="fw-semibold">
          {translate("PM.payment_bank_amount_title")}
        </div>
      ),
      children: <InformationBankTransfer />,
    },
    {
      key: ItemsOfGeneralInformationSectionKey.WITHHOLD_NOT_PAY,
      label: (
        <div className="invoice-title">
          {translate("PM.payment_bank_with_hold_not_pay_input_title")}
        </div>
      ),
      children: <WithHoldNotPay />,
    },
  ].filter(Boolean);

  const collapseItems: CollapseProps["items"] = [
    {
      key: EAdvanceInformationSectionKey.REQUEST_GENERAL,
      label: (
        <div className="invoice-title mb-2">
          {translate("PM.payment_request_general_content")}
        </div>
      ),
      children: renderRequestGeneral(),
    },
    model?.isShowPurchaseDocumentsAttached && {
      key: EAdvanceInformationSectionKey.PURCHASING_DOCUMENT,
      label: (
        <div className="invoice-title">
          {translate("PM.payment_purchasing_title")}
        </div>
      ),
      children: <PurchasingDocumentsTable />,
    },
    {
      key: EAdvanceInformationSectionKey.ATTACHED_DOCUMENT,
      label: (
        <div className="invoice-title">
          {translate("PM.payment_table_attached_document_reference_title")}
        </div>
      ),
      children: <AttachedDocumentsTable />,
    },
  ];

  const { id } = useParams() as { id: string };

  return (
    <div className="payment-scroll payment payment_collapse">
      <Collapse
        ghost
        items={collapseItems.filter(Boolean)}
        defaultActiveKey={Object.values(EAdvanceInformationSectionKey)}
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <div>
            <img
              src={IcArrowDown}
              className={classNames(
                "invoice-transition",
                isActive && "invoice-transition_expand"
              )}
              alt=""
            />
          </div>
        )}
      />
      <div className="p-x--md p-y--sm payment-mb-100">
        <PaymentOpinion
          topicId={id}
          status={model?.statusTopic}
          topicType={numberConstants.SIX}
        />
      </div>
      <div className="p-x--md p-y--sm payment-mb-100">
        {isEmpty(id) ? null : (
          <ApprovalHistoryTable
            topicId={id}
            type={TopicType.PaymentAdvanceRequest}
            useCollapse={false}
            model={model}
          />
        )}
      </div>
      <div className="p-x--md p-y--sm payment-mb-100">
        {isEmpty(id) ? null : (
          <Comments topicType={TopicType.PaymentAdvanceRequest} />
        )}
      </div>
    </div>
  );
}

export default AdvanceGenerationInfoTab;
