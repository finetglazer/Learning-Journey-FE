import React, { useContext } from "react";
import { Col, Row, Tooltip } from "antd";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { ContractRequestType } from "models/Settlement";
import { isEqual } from "lodash";
import { formatCurrency } from "core/helpers/number";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";

const ContactOrderInsight = () => {
  const { translate, model } = useContext(SettlementHookContext);
  const contractPOInfo = model?.contactOrderInfo;
  const isContract = isEqual(
    contractPOInfo?.contractRequestType,
    ContractRequestType.Contract
  );
  return (
    <div>
      <div className="PurchaseInformationData">
        <div className="PurchaseInformationData-body mt-0">
          <div className="purchase_proposal_data_wrapper">
            <Row className="item_row">
              <Col span={8} className="item_col bg_grey">
                <span className="label">
                  {isContract
                    ? translate("CT.txt_contract_principle_name")
                    : translate("settlement.purchase_order_txt")}
                </span>
                <div>
                  <Tooltip placement="top" title={contractPOInfo?.name}>
                    <span className="value  text-truncate fw-medium">
                      {contractPOInfo?.name}
                    </span>
                  </Tooltip>
                </div>
              </Col>
              <Col span={8} className="item_col bg_grey">
                <span className="label">
                  {isContract
                    ? translate("AC.txt_contract_number")
                    : translate("settlement.purchase_order_number_txt")}
                </span>
                <div>
                  <div className="value  text-truncate fw-medium">
                    {contractPOInfo?.contractNo}
                  </div>
                </div>
              </Col>
              <Col span={8} className="item_col bg_grey">
                <span className="label">
                  {isContract
                    ? translate("CT.txt_code_contract_principle")
                    : translate("settlement.purchase_order_code")}
                </span>
                <div>
                  <div className="value  text-truncate fw-medium">
                    {contractPOInfo?.code}
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="item_row">
              <Col span={8} className="item_col">
                <span className="label">
                  {isContract
                    ? translate("AC.txt_contract_total_value")
                    : translate("settlement.purchase_order_total_txt")}
                </span>
                <span className="value">
                  <div className="value  text-truncate fw-medium">
                    {formatCurrency({
                      value: contractPOInfo?.total,
                      code: contractPOInfo?.currency,
                    })}{" "}
                    {contractPOInfo?.currency}
                  </div>
                </span>
              </Col>
              <Col span={8} className="item_col">
                <span className="label">
                  {translate("AC.txt_contract_validity_period")}
                </span>
                <span className="value">
                  {formatDate(
                    contractPOInfo?.effectiveDate,
                    STANDARD_DATE_FORMAT_SLASH
                  )}{" "}
                  -{" "}
                  {formatDate(
                    contractPOInfo?.endDate,
                    STANDARD_DATE_FORMAT_SLASH
                  )}
                </span>
              </Col>
              <Col span={8} className="item_col">
                <span className="label">
                  {translate("AC.txt_contract_manager")}
                </span>
                <div>
                  <Tooltip
                    placement="top"
                    title={`${contractPOInfo?.managerEmail} - ${contractPOInfo?.managerName}`}
                  >
                    <div className="d-flex text-truncate">
                      <span className="value text-truncate fw-medium text-truncate">
                        {`${contractPOInfo?.managerEmail} - ${contractPOInfo?.managerName}`}
                      </span>
                    </div>
                  </Tooltip>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactOrderInsight;
