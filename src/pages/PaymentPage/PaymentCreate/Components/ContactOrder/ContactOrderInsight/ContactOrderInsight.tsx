import React from "react";
import { Col, Row, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SETTLEMENT_VIEW_ROUTE } from "config/route-const";
import { ContractSettlementInfo, VND_CURRENCY } from "models/Payment";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatNumber } from "core/helpers/number";

type Props = {
  contractSettlement: ContractSettlementInfo;
};
const ContactOrderInsight = ({ contractSettlement }: Props) => {
  const [translate] = useTranslation();
  return (
    <div>
      <div className="PurchaseInformationData">
        <div className="PurchaseInformationData-body mt-0">
          <div className="purchase_proposal_data_wrapper">
            <Row className="item_row">
              <Col span={8} className="item_col bg_grey">
                <span className="label">
                  {translate("PM.contract_settlement_code")}
                </span>
                <div>
                  <Link
                    to={`${SETTLEMENT_VIEW_ROUTE}/${contractSettlement?.id}`}
                    target="_blank"
                    className={"text-decoration-none"}
                  >
                    <div className="fw-medium text-truncate">
                      {contractSettlement?.code}
                    </div>
                  </Link>
                </div>
              </Col>
              <Col span={8} className="item_col bg_grey">
                <span className="label">
                  {translate("settlement.settlement_description")}
                </span>
                <div>
                  <div className="value  text-truncate fw-medium">
                    <Tooltip placement={"top"} title={contractSettlement?.name}>
                      {contractSettlement?.name}
                    </Tooltip>
                  </div>
                </div>
              </Col>
              <Col span={8} className="item_col bg_grey">
                <span className="label">
                  {translate("settlement.effective_date_settlement")}
                </span>
                <div>
                  <div className="value text-truncate fw-medium">
                    {formatDate(
                      contractSettlement?.effectiveDate,
                      STANDARD_DATE_FORMAT_SLASH
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="item_row">
              <Col span={8} className="item_col">
                <span className="label">
                  {translate("settlement.filter_value_settlement")}
                </span>
                <span className="value">
                  <div className="value  text-truncate fw-medium  d-flex gap-1">
                    <span>{formatNumber(contractSettlement?.total || 0)}</span>
                    <span>{contractSettlement?.currency || VND_CURRENCY}</span>
                  </div>
                </span>
              </Col>
              <Col span={8} className="item_col">
                <span className="label">
                  {translate(
                    "settlement.paymentSpreadSheet.title.convertedSettlementValue"
                  )}
                </span>
                <div className="value text-truncate fw-medium  d-flex gap-1">
                  <span>
                    {formatNumber(contractSettlement?.exchangeTotal || 0)}
                  </span>
                  <span>{VND_CURRENCY}</span>
                </div>
              </Col>
              <Col span={8} className="item_col">
                <span className="label">
                  {translate("settlement.exchange_rate")}
                </span>
                <div>
                  <div className="value text-truncate fw-medium  d-flex gap-1">
                    <span>{formatNumber(contractSettlement?.rate || 0)}</span>
                  </div>
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
