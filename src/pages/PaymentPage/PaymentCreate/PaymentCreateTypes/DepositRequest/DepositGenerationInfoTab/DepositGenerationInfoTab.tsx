import { Collapse } from "antd";
import { CollapseProps } from "antd/lib";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import { Comments } from "components/Comment/Comment.stories";
import PaymentOpinion from "components/OpinionBase/Payment";
import { numberConstants } from "core/config/consts";
import { TopicType } from "core/models/History";
import { isEmpty, isEqual } from "lodash";
import { PAYMENT_METHOD_TYPES } from "models/Payment";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import AttachedDocumentsTable from "../../../Components/AttachedDocumentsTable/AttachedDocumentsTable";
import ProposerPeople from "../../../Components/ProposerPeople/ProposerPeople";
import PurchasingDocumentsTable from "../../../Components/PurchasingDocumentsTable/PurchasingDocumentsTable";
import Supplier from "../../../Components/Supplier/Supplier";
import { PaymentCreateHookContext } from "../../../PaymentCreateHook";
import DepositInformationBankTransfer from "./Components/DepositInformationBankTransfer/DepositInformationBankTransfer";
import DepositProposalContent from "./Components/DepositProposalContent/DepositProposalContent";
import DepositProposedValue from "./Components/DepositProposedValue/DepositProposedValue";

enum EDepositInformationSectionKey {
  REQUEST_GENERAL,
  PURCHASING_DOCUMENT,
  ATTACHED_DOCUMENT,
}

enum ItemsOfGeneralInformationSectionKey {
  REQUEST_TYPE,
  SUPPLIER,
  BANK_ACCOUNT,
}

function DepositGenerationInfoTab() {
  const { translate, model } = useContext(PaymentCreateHookContext);
  const isShowBankTransfer =
    isEqual(
      model.paymentMethod?.id?.toString(),
      PAYMENT_METHOD_TYPES[0].id.toString()
    ) ||
    isEqual(
      model.paymentMethod?.id?.toString(),
      PAYMENT_METHOD_TYPES[1].id.toString()
    );
  const collapseItemsInGeneral: CollapseProps["items"] = [
    {
      key: ItemsOfGeneralInformationSectionKey.REQUEST_TYPE,
      label: (
        <div className="fw-semibold">{translate("PM.payment_type_txt")}</div>
      ),
      children: <DepositProposalContent />,
    },
    {
      key: ItemsOfGeneralInformationSectionKey.SUPPLIER,
      label: (
        <div className="fw-semibold">
          {translate("PM.payment_supplier_title")}
        </div>
      ),
      children: <Supplier />,
    },
    isShowBankTransfer && {
      key: ItemsOfGeneralInformationSectionKey.BANK_ACCOUNT,
      label: (
        <div className="fw-semibold">
          {translate("PM.payment_bank_amount_title")}
        </div>
      ),
      children: <DepositInformationBankTransfer />,
    },
  ].filter(Boolean);
  const renderRequestGeneral = () => (
    <div className="payment-custom_grid p-b--3xs">
      <div className="payment-custom_grid-col_10">
        <div className="payment-custom_grid_9-col_9 payment-title_collage payment-title_collage_accounting payment-title_collage">
          <Collapse
            ghost
            className="collage_custom collage_custom_border collage_custom_border_accounting"
            items={collapseItemsInGeneral}
            defaultActiveKey={[
              ItemsOfGeneralInformationSectionKey.REQUEST_TYPE,
              ItemsOfGeneralInformationSectionKey.SUPPLIER,
              ItemsOfGeneralInformationSectionKey.BANK_ACCOUNT,
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
      </div>
      <div className="payment-custom_grid-col_4 payment-min_w_360 pt-4">
        {/*Giá trị đề nghị*/}
        <DepositProposedValue />
        <div className="m-t--2xl">
          {/*Người đề nghị*/}
          <ProposerPeople />
        </div>
      </div>
    </div>
  );

  const collapseItems: CollapseProps["items"] = [
    {
      key: EDepositInformationSectionKey.REQUEST_GENERAL,
      label: (
        <div className="invoice-title">
          {translate("PM.payment_request_general_content")}
        </div>
      ),
      children: renderRequestGeneral(),
      className: "payment-border_title_collage",
    },
    model?.isShowPurchaseDocumentsAttached && {
      key: EDepositInformationSectionKey.PURCHASING_DOCUMENT,
      label: (
        <div className="invoice-title">
          {translate("PM.payment_purchasing_title")}
        </div>
      ),
      children: <PurchasingDocumentsTable />,
    },
    {
      key: EDepositInformationSectionKey.ATTACHED_DOCUMENT,
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
    <div className="payment-scroll payment payment_collapse mt-3">
      <Collapse
        ghost
        items={collapseItems?.filter(Boolean)}
        defaultActiveKey={[
          EDepositInformationSectionKey.REQUEST_GENERAL,
          EDepositInformationSectionKey.PURCHASING_DOCUMENT,
          EDepositInformationSectionKey.ATTACHED_DOCUMENT,
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
      <div className="p-x--md p-y--sm payment-mb-100">
        <PaymentOpinion
          topicId={id}
          status={model?.statusTopic}
          topicType={numberConstants.NINE}
        />
      </div>
      <div className="p-x--md p-y--sm payment-mb-100">
        {isEmpty(id) ? null : (
          <ApprovalHistoryTable
            topicId={id}
            type={TopicType.PaymentDepositRequest}
            useCollapse={false}
            model={model}
          />
        )}
      </div>
      <div className="p-x--md p-y--sm payment-mb-100">
        {isEmpty(id) ? null : (
          <Comments topicType={TopicType.PaymentDepositRequest} />
        )}
      </div>
    </div>
  );
}

export default DepositGenerationInfoTab;
