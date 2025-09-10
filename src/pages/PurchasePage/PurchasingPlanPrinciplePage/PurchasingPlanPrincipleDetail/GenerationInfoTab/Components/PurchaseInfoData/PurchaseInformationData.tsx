import { Col, Row, Tooltip } from "antd";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { PurchasingPlanPrincipleDetailHookContext } from "../../../PurchasingPlanPrincipleDetailHook";
import {
  PurchasingPlanModel,
  PurchaseProposalModel,
} from "models/PurchasingPlan";
import "./PurchaseInformationData.scss";
import { OneLineText } from "react-components-design-system";
import { isEmpty } from "lodash";
import { VND_CURRENCY } from "models/Payment";

const PurchaseInformationData = () => {
  const [translate] = useTranslation();

  const {
    model,
    handleViewPurchaseProposal,
    handleViewOriginPurchaseProposal,
  } = useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);

  const purchaseProposal =
    model?.purchaseProposalId || ({} as PurchaseProposalModel);

  return (
    <div className="PurchaseInformationData">
      <div className="PurchaseInformationData-body mt-0">
        <div className="purchase_proposal_data_wrapper">
          <Row className="item_row">
            <Col
              span={8}
              className="item_col bg_grey purchase-plan-principle__table-item"
            >
              <span className="label">
                {translate("PR.table_proposal_code")}
              </span>
              <div
                onClick={handleViewOriginPurchaseProposal}
                style={{ cursor: "pointer" }}
                className="text-ellipsis"
              >
                <Tooltip
                  placement="topLeft"
                  title={`${purchaseProposal?.purchaseProposalCode} – ${purchaseProposal?.purchaseProposalName}`}
                >
                  <span className="value text_blue text-truncate fw-medium">
                    {purchaseProposal?.purchaseProposalCode}
                  </span>
                </Tooltip>
              </div>
            </Col>
            <Col
              span={8}
              className="item_col bg_grey bg_grey purchase-plan-principle__table-item"
            >
              <span className="label">
                {translate("PL.purchasing_plan_request_code")}
              </span>
              <div
                onClick={handleViewPurchaseProposal}
                style={{ cursor: "pointer" }}
              >
                <div className="value text_blue text-truncate fw-medium">
                  {purchaseProposal?.code}
                </div>
              </div>
            </Col>
            <Col
              span={8}
              className="item_col bg_grey bg_grey purchase-plan-principle__table-item"
            >
              <span className="label">
                {translate("PL.purchasing_plan_request_name")}
              </span>
              <div>
                <OneLineText value={purchaseProposal?.name} />
              </div>
            </Col>
          </Row>
          {/* Tổng giá trị */}
          <Row className="item_row">
            <Col
              span={8}
              className="item_col purchase-plan-principle__table-item"
            >
              <span className="label">
                {translate("PL.purchasing_plan_total_value")}
              </span>
              <div>
                <OneLineText
                  value={
                    formatNumber(purchaseProposal?.total) +
                    ` ${
                      isEmpty(purchaseProposal?.currency?.code)
                        ? VND_CURRENCY
                        : purchaseProposal?.currency?.code
                    }`
                  }
                  useTooltip={false}
                  className="fw-medium"
                />
              </div>
            </Col>
            <Col
              span={8}
              className="item_col purchase-plan-principle__table-item"
            >
              <span className="label">
                {translate("PL.purchasing_plan_creator")}
              </span>
              <span className="value">
                <OneLineText
                  value={
                    purchaseProposal?.createUser +
                    " – " +
                    purchaseProposal?.createUserName
                  }
                  className="fw-medium"
                />
              </span>
            </Col>
            <Col
              span={8}
              className="item_col purchase-plan-principle__table-item"
            >
              <span className="label">
                {translate("PL.purchasing_plan_creator_unit")}
              </span>
              <span className="value">
                {purchaseProposal?.organization?.name}
              </span>
            </Col>
          </Row>

          <Row className="item_row">
            <Col
              span={8}
              className="item_col purchase-plan-principle__table-item"
            >
              <span className="label">
                {translate("PL.purchasing_plan_title")}
              </span>
              <span className="value">{purchaseProposal?.position?.name}</span>
            </Col>
            <Col
              span={8}
              className="item_col purchase-plan-principle__table-item"
            >
              <span className="label">
                {translate("PL.purchasing_plan_request_sent_date")}
              </span>
              <span className="value">
                {formatDate(
                  purchaseProposal?.createdDate,
                  STANDARD_DATE_FORMAT_SLASH
                )}
              </span>
            </Col>
            <Col
              span={8}
              className="item_col purchase-plan-principle__table-item"
            ></Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default PurchaseInformationData;
