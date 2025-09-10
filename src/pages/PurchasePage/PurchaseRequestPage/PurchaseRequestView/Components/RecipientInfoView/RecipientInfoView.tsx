import { Col, Row } from "antd";
import { PurchaseRequestDetailModel } from "models/PurchaseRequest";
import { PurchaseRequestDetailHookContext } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestDetail/PurchaseRequestDetailHook";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import "./RecipientInfoView.scss";

const RecipientInfoView = () => {
  const [translate] = useTranslation();

  const { model } = useContext<PurchaseRequestDetailModel>(
    PurchaseRequestDetailHookContext
  );

  return (
    <div className="purchase_request_recipient_info_wrapper ">
      <div className="header">
        <div className="title">{translate("PR.recipient_information")}</div>
      </div>
      <div className="recipient_info_view_wrapper">
        <Row className="item_row">
          <Col span={8} className="item_col">
            <span className="label">{translate("PR.receiving_unit")}</span>
            <span className="value text_blue">
              {model?.recipientInforJson?.receiveBusinessDepartment?.name}
            </span>
          </Col>
          <Col span={8} className="item_col">
            <span className="label">{translate("PR.receiver")}</span>
            {model?.recipientInforJson?.recipient?.email} -{" "}
            {model?.recipientInforJson?.recipient?.name}
            <span className="value "></span>
          </Col>
          <Col span={8} className="item_col">
            <span className="label">{translate("PR.telephone_number")}</span>
            {model?.recipientInforJson?.phoneNumber}
          </Col>
        </Row>
        <Row className="item_row">
          <Col span={8} className="item_col">
            <span className="label">{translate("PR.address")}</span>
            {model?.recipientInforJson?.address}
            <span className="value text_blue"></span>
          </Col>
          <Col span={16} className="item_col">
            <span className="label">{translate("PR.note")}</span>
            {model?.recipientInforJson?.note}
            <span className="value "></span>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RecipientInfoView;
