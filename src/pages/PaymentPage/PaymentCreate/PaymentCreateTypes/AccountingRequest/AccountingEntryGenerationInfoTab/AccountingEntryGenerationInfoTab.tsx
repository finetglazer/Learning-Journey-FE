import { Collapse } from "antd";
import { CollapseProps } from "antd/lib";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { CODE_TYPE_PAYMENT_REQUEST_CORP } from "models/Payment";
import AttachedDocumentsTable from "pages/PaymentPage/PaymentCreate/Components/AttachedDocumentsTable/AttachedDocumentsTable";
import Supplier from "pages/PaymentPage/PaymentCreate/Components/Supplier/Supplier";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { useContext } from "react";
import AccountingEntryProposalContent from "./Components/AccountingEntryProposalContent/AccountingEntryProposalContent";
import AccountingEntryProposedValue from "./Components/AccountingEntryProposedValue/AccountingEntryProposedValue";
import ProposerPeople from "../../../Components/ProposerPeople/ProposerPeople";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import { Comments } from "components/Comment/Comment.stories";
import PaymentOpinion from "components/OpinionBase/Payment";
import { numberConstants } from "core/config/consts";
import { TopicType } from "core/models/History";
import { useParams } from "react-router-dom";
import { isEmpty } from "lodash";

enum EAccountingEntryInformationSectionKey {
  REQUEST_GENERAL,
  ATTACHED_DOCUMENT,
}

function AccountingEntryGenerationInfoTab() {
  const { translate, model } = useContext(PaymentCreateHookContext);

  const renderRequestGeneral = () => (
    <div className="payment-custom_grid p-b--3xs">
      <div className="payment-custom_grid-col_10">
        <div className="payment-custom_grid-col_10">
          {/* Nội dung đề nghị */}
          <AccountingEntryProposalContent />
        </div>
        {/* Nhà cung cấp */}
        {model.paymentRequestType?.code === CODE_TYPE_PAYMENT_REQUEST_CORP && (
          <div className="payment-custom_grid-col_10 m-y--lg">
            <Supplier />
          </div>
        )}
      </div>
      <div className="payment-custom_grid-col_4 payment-min_w_360 pt-4">
        {/* Giá trị đề nghị */}
        <AccountingEntryProposedValue />
        <div className="m-t--2xl">
          {/* Người đề nghị */}
          <ProposerPeople />
        </div>
      </div>
    </div>
  );

  const collapseItems: CollapseProps["items"] = [
    {
      key: EAccountingEntryInformationSectionKey.REQUEST_GENERAL,
      label: (
        <div className="invoice-title">
          {translate("PM.payment_request_general_content")}
        </div>
      ),
      children: renderRequestGeneral(),
      className: "payment-border_title_collage",
    },
    {
      key: EAccountingEntryInformationSectionKey.ATTACHED_DOCUMENT,
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
    <div className="payment-scroll payment payment_collapse payment-custom_border_accounting">
      <Collapse
        ghost
        items={collapseItems}
        defaultActiveKey={[
          EAccountingEntryInformationSectionKey.REQUEST_GENERAL,
          EAccountingEntryInformationSectionKey.ATTACHED_DOCUMENT,
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
          topicType={numberConstants.EIGHT}
        />
      </div>
      <div className="p-x--md p-y--sm payment-mb-100">
        {isEmpty(id) ? null : (
          <ApprovalHistoryTable
            topicId={id}
            type={TopicType.PaymentAccountingRequest}
            useCollapse={false}
            model={model}
          />
        )}
      </div>
      <div className="p-x--md p-y--sm payment-mb-100">
        {isEmpty(id) ? null : (
          <Comments topicType={TopicType.PaymentAccountingRequest} />
        )}
      </div>
    </div>
  );
}

export default AccountingEntryGenerationInfoTab;
