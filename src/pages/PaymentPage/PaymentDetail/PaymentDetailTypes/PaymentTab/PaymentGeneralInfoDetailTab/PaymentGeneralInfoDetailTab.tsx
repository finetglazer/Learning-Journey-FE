import { IcArrowDown } from "assets/icons";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import { Comments } from "components/Comment/Comment.stories";
import PaymentOpinion from "components/OpinionBase/Payment";
import { TopicType } from "core/models/History";
import { isEmpty, isNil } from "lodash";
import {
  CODE_TYPE_PAYMENT_REQUEST_CORP,
  PAYMENT_METHOD,
} from "models/Payment/PaymentRequestConstant";
import { useContext } from "react";
import "../../../PaymentDetail.scss";
import { PaymentDetailHookContext } from "../../../PaymentDetailHook";
import ProposedValue from "./Components/ProposedValue/ProposedValue";
import PurchasingInfo from "./Components/PurchasingInfo/PurchasingInfo";
import RetainInfo from "./Components/RetainInfo/RetainInfo";
import SupplierInfo from "./Components/SupplierInfo/SupplierInfo";
import TransferInfo from "./Components/TransferInfo/TransferInfo";
// eslint-disable-next-line import/named
import { Collapse, CollapseProps } from "antd";
import { numberConstants } from "core/config/consts";
import AttachDocumentTable from "pages/PaymentPage/PaymentDetail/Components/AttachDocumentTable/AttachDocumentTable";
import PurchasingDocumentsTable from "pages/PaymentPage/PaymentDetail/Components/PurchasingDocumentsTable/PurchasingDocumentsTable";
import { useParams } from "react-router-dom";
import ProposerPeople from "../../Components/ProposerPeople/ProposerPeople";

const GeneralInfoTab = () => {
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
              {/*Thông tin nhà cung cấp*/}
              {model?.paymentDetailInfomation?.paymentRequestType?.code ===
                CODE_TYPE_PAYMENT_REQUEST_CORP && <SupplierInfo />}
            </div>
            <div className="m-t--lg">
              {/*Thông tin chuyển khoản*/}
              {(model?.paymentDetailInfomation?.paymentMethod ==
                PAYMENT_METHOD.BANK_TRANSFER ||
                model?.paymentDetailInfomation?.paymentMethod ==
                  PAYMENT_METHOD.BANK_TRANSFER_REIMBURSEMENT) && (
                <TransferInfo />
              )}
            </div>
            <div className="m-t--lg">
              {/*Thông tin giữ lại/không thanh toán*/}
              <RetainInfo />
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
          {!isNil(model?.paymentDetailInfomation?.paymentInheritanceType) && (
            <div className="">
              <PurchasingDocumentsTable />
            </div>
          )}

          <div className="border-bottom m-t--sm"></div>
          <div className="">
            <AttachDocumentTable />
          </div>
          <div className="p-x--md p-y--sm payment-mb-100">
            <PaymentOpinion
              topicId={id}
              status={model?.paymentDetailInfomation?.status}
              topicType={numberConstants.TWO}
              processAfterFeedbackSubmission={processAfterFeedbackSubmission}
            />
          </div>
          <div className="p-x--md p-y--sm payment-mb-100">
            {isEmpty(id) ? null : (
              <ApprovalHistoryTable
                topicId={id}
                type={TopicType.PaymentRequest}
                hasBorder={false}
                useCollapse={false}
                model={model?.paymentDetailInfomation}
              />
            )}
          </div>
          <div className="p-x--md p-y--sm payment-mb-100">
            {!isEmpty(id) && <Comments topicType={TopicType.PaymentRequest} />}
          </div>
        </div>
      )}
    </>
  );
};

export default GeneralInfoTab;
