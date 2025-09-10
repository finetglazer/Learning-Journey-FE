import { IcArrowDown } from "assets/icons";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import { Comments } from "components/Comment/Comment.stories";
import PaymentOpinion from "components/OpinionBase/Payment";
import { TopicType } from "core/models/History";
import { isEmpty } from "lodash";
import "pages/PaymentPage/PaymentDetail/PaymentDetail.scss";
import { PaymentDetailHookContext } from "pages/PaymentPage/PaymentDetail/PaymentDetailHook";
import { useContext } from "react";
import FinancicalInvoiceInfo from "./Components/FinancicalInvoiceInfo/FinancicalInvoiceInfo";
import ProposedValue from "./Components/ProposedValue/ProposedValue";
import PurchasingInfo from "./Components/PurchasingInfo/PurchasingInfo";
// eslint-disable-next-line import/named
import { Collapse, CollapseProps } from "antd";
import { numberConstants } from "core/config/consts";
import AttachDocumentTable from "pages/PaymentPage/PaymentDetail/Components/AttachDocumentTable/AttachDocumentTable";
import { useParams } from "react-router-dom";
import ProposerPeople from "../../Components/ProposerPeople/ProposerPeople";

const AccountingGeneralInfoTab = () => {
  const { model, translate, processAfterFeedbackSubmission } = useContext(
    PaymentDetailHookContext
  );

  const renderPurchasingInfo = () => {
    return (
      <div className="payment-custom_grid">
        <div className="payment-custom_grid-col_10">
          <div className="">
            <div className="">
              {/*Thông tin mua*/}
              <PurchasingInfo />
            </div>
            <div className="m-t--lg">
              {/* Thông tin xuất hóa đơn tài chính */}
              <FinancicalInvoiceInfo />
            </div>
          </div>
        </div>
        <div className="payment-custom_grid-col_4 payment-min_w_360">
          {/*Giá trị đề nghị*/}
          <div className="d-flex flex-justify-space-between">
            <div className="payment-detail__title m-b--xs">
              {translate("PM.payment_proposed_value_title")}
            </div>
          </div>
          <ProposedValue />

          <div className="m-t--2xl">
            {/*Người đề nghị*/}
            <ProposerPeople />
          </div>
        </div>
      </div>
    );
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: (
        <div className="invoice-title">
          {translate("PM.payment_request_general_content")}
        </div>
      ),
      children: renderPurchasingInfo(),
    },
  ];

  const { id } = useParams() as { id: string };

  return (
    <>
      {model?.paymentDetailInfomation && (
        <div className="payment-scroll payment_collapse">
          <Collapse
            items={items}
            ghost
            defaultActiveKey={["1", "2"]}
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <div>
                <img
                  src={IcArrowDown}
                  className="invoice-transition"
                  style={{ transform: isActive ? "rotate(180deg)" : "" }}
                  alt=""
                />
              </div>
            )}
          />

          <div className="border-bottom m-t--sm"></div>
          <div className="">
            <AttachDocumentTable />
          </div>
          <div className="p-x--md p-y--sm payment-mb-100">
            <PaymentOpinion
              topicId={id}
              status={model?.paymentDetailInfomation?.status}
              topicType={numberConstants.EIGHT}
              processAfterFeedbackSubmission={processAfterFeedbackSubmission}
            />
          </div>
          <div className="p-x--md p-y--sm payment-mb-100">
            {isEmpty(id) ? null : (
              <ApprovalHistoryTable
                topicId={id}
                type={TopicType.PaymentAccountingRequest}
                useCollapse={false}
                model={model?.paymentDetailInfomation}
              />
            )}
          </div>
          <div className="p-x--md p-y--sm payment-mb-100">
            {!isEmpty(id) && (
              <Comments topicType={TopicType.PaymentAccountingRequest} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AccountingGeneralInfoTab;
