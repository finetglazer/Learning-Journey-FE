import { Collapse } from "antd";
import { CollapseProps } from "antd/lib";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { CODE_TYPE_EXPENSE_DCNCC } from "models/Payment";
import AttachedDocumentsTable from "pages/PaymentPage/PaymentCreate/Components/AttachedDocumentsTable/AttachedDocumentsTable";
import ProposerPeople from "pages/PaymentPage/PaymentCreate/Components/ProposerPeople/ProposerPeople";
import PurchasingDocumentsTable from "pages/PaymentPage/PaymentCreate/Components/PurchasingDocumentsTable/PurchasingDocumentsTable";
import Supplier from "pages/PaymentPage/PaymentCreate/Components/Supplier/Supplier";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { useContext } from "react";
import ExpenseProposalContent from "./Components/ExpenseProposalContent/ExpenseProposalContent";
import ExpenseProposedValue from "./Components/ExpenseProposedValue/ExpenseProposedValue";
import { useParams } from "react-router-dom";
import PaymentOpinion from "components/OpinionBase/Payment";
import { numberConstants } from "core/config/consts";
import { TopicType } from "core/models/History";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import { Comments } from "components/Comment/Comment.stories";
import { isEmpty, isEqual } from "lodash";

enum EExpenseInformationSectionKey {
  REQUEST_GENERAL,
  PURCHASING_DOCUMENT,
  ATTACHED_DOCUMENT,
}

enum ItemsOfGeneralInformationSectionKey {
  SUPPLIER,
}

function ExpenseGenerationInfoTab() {
  const { translate, model } = useContext(PaymentCreateHookContext);

  const renderRequestGeneral = () => (
    <div className="payment-custom_grid p-b--3xs">
      <div className="payment-custom_grid-col_10">
        <div className="payment-custom_grid-col_10">
          {/* Nội dung đề nghị */}
          <ExpenseProposalContent />
        </div>
        {
          <div className="payment-custom_grid-col_10 m-y--lg payment-title_collage">
            <Collapse
              ghost
              className="collage_custom collage_custom_border"
              items={collapseItemsInGeneral}
              defaultActiveKey={[ItemsOfGeneralInformationSectionKey.SUPPLIER]}
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
      <div className="payment-custom_grid-col_4 payment-min_w_360">
        {/* Giá trị đề nghị */}
        <ExpenseProposedValue />
        <div className="m-t--2xl">
          {/* Người đề nghị */}
          <ProposerPeople />
        </div>
      </div>
    </div>
  );

  const collapseItemsInGeneral: CollapseProps["items"] = [
    isEqual(model.paymentRequestType?.code, CODE_TYPE_EXPENSE_DCNCC) && {
      key: ItemsOfGeneralInformationSectionKey.SUPPLIER,
      label: (
        <div className="fw-semibold">
          {translate("PM.payment_supplier_title")}
        </div>
      ),
      children: <Supplier />,
    },
  ].filter(Boolean);

  const collapseItems: CollapseProps["items"] = [
    {
      key: EExpenseInformationSectionKey.REQUEST_GENERAL,
      label: (
        <div className="invoice-title mb-2">
          {translate("PM.payment_request_general_content")}
        </div>
      ),
      children: renderRequestGeneral(),
    },
    model?.isShowPurchaseDocumentsAttached && {
      key: EExpenseInformationSectionKey.PURCHASING_DOCUMENT,
      label: (
        <div className="invoice-title">
          {translate("PM.payment_purchasing_title")}
        </div>
      ),
      children: <PurchasingDocumentsTable />,
    },
    {
      key: EExpenseInformationSectionKey.ATTACHED_DOCUMENT,
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
        defaultActiveKey={[
          EExpenseInformationSectionKey.REQUEST_GENERAL,
          EExpenseInformationSectionKey.PURCHASING_DOCUMENT,
          EExpenseInformationSectionKey.ATTACHED_DOCUMENT,
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
          topicType={numberConstants.SEVEN}
        />
      </div>
      <div className="p-x--md p-y--sm payment-mb-100">
        {isEmpty(id) ? null : (
          <ApprovalHistoryTable
            topicId={id}
            type={TopicType.PaymentExpenseRequest}
            useCollapse={false}
            model={model}
          />
        )}
      </div>
      <div className="p-x--md p-y--sm payment-mb-100">
        {isEmpty(id) ? null : (
          <Comments topicType={TopicType.PaymentExpenseRequest} />
        )}
      </div>
    </div>
  );
}

export default ExpenseGenerationInfoTab;
