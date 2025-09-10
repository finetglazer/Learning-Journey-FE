import React, { useContext } from "react";
import { Col, Row, Tooltip } from "antd";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { SettlementHookModel } from "models/Settlement";
const empty = "--";

const BuyerServiceUserInfo = () => {
  const { translate, model } = useContext<SettlementHookModel>(
    SettlementHookContext
  );
  const legalEntity = model?.contactOrderInfo?.legalEntity;
  return (
    <div>
      <div className="PurchaseInformationData">
        <div className="PurchaseInformationData-body mt-0">
          <div className="purchase_proposal_data_wrapper">
            <Row className="item_row">
              <Col span={8} className="item_col bg_grey">
                <span className="label">
                  {translate("CT.create_contract.title.purchase_unit_name")}
                </span>
                <div>
                  <div className="value  text-truncate fw-medium">
                    {legalEntity?.name}
                  </div>
                </div>
              </Col>
              <Col span={8} className="item_col bg_grey">
                <span className="label">
                  {translate("PM.payment_tax_idenfication_number_input_label")}
                </span>
                <div>
                  <div className="value  text-truncate fw-medium">
                    {legalEntity?.taxCode}
                  </div>
                </div>
              </Col>
              <Col span={8} className="item_col bg_grey">
                <span className="label">{translate("CT.address")}</span>
                <div>
                  <Tooltip placement="top" title={legalEntity?.address}>
                    <div className="d-flex text-truncate">
                      <span className="value  text-truncate fw-medium">
                        {legalEntity?.address}
                      </span>
                    </div>
                  </Tooltip>
                </div>
              </Col>
            </Row>
            <Row className="item_row">
              <Col span={8} className="item_col">
                <span className="label">
                  {translate("CT.create_contract.title.legal_person")}
                </span>
                <span className="value">
                  <div className="value  text-truncate fw-medium">{empty}</div>
                </span>
              </Col>
              <Col span={16} className="item_col">
                <span className="label">{translate("AC.txt_position")}</span>
                <span className="value">{empty}</span>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerServiceUserInfo;
