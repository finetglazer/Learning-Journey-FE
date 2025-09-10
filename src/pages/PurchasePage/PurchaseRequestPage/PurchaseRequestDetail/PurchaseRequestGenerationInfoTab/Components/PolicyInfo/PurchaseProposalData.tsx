import { Col, Row } from "antd";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import {
  PurchaseProposal,
  PurchaseRequestDetailModel,
} from "models/PurchaseRequest";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";

const PurchaseProposalData = () => {
  const [translate] = useTranslation();

  const { model, handleViewPurchaseProposal } =
    useContext<PurchaseRequestDetailModel>(PurchaseRequestDetailHookContext);

  const purchaseProposal =
    model?.purchaseProposalId || ({} as PurchaseProposal);

  return (
    <div className="purchase_proposal_data_wrapper">
      <Row className="item_row">
        <Col span={8} className="item_col bg_grey">
          <span className="label">{translate("PR.table_proposal_code")}</span>
          <div
            onClick={handleViewPurchaseProposal}
            style={{ cursor: "pointer" }}
          >
            <span className="value text_blue">{purchaseProposal?.code}</span>
          </div>
        </Col>
        <Col span={model?.isAdjust ? 16 : 8} className="item_col bg_grey">
          <span className="label">{translate("PR.table_name")}</span>
          <span className="value ">{purchaseProposal?.name}</span>
        </Col>
        {!model?.isAdjust && (
          <Col span={8} className="item_col bg_grey">
            <span className="label">{translate("PR.implementation_time")}</span>
            <span className="value">
              {formatDate(
                purchaseProposal?.startDate,
                STANDARD_DATE_FORMAT_SLASH
              )}
              {" - "}
              {formatDate(
                purchaseProposal?.endDate,
                STANDARD_DATE_FORMAT_SLASH
              )}
            </span>
          </Col>
        )}
      </Row>
      <Row className="item_row">
        <Col span={8} className="item_col">
          <span className="label">{translate("PR.total_estimate")}</span>
          <span className="value">
            {formatNumber(purchaseProposal?.totalEstimateAmount)}
            <span className="label"> {purchaseProposal?.currency?.code}</span>
          </span>
        </Col>
        <Col span={8} className="item_col">
          <span className="label">{translate("PR.total_reserve")}</span>
          <span className="value">
            {formatNumber(purchaseProposal?.totalContingencyAmount)}
            <span className="label"> {purchaseProposal?.currency?.code}</span>
          </span>
        </Col>
        <Col span={8} className="item_col">
          <span className="label">{translate("PR.used")}</span>
          <span className="value">
            {formatNumber(purchaseProposal?.usedAmount)}
            <span className="label"> {purchaseProposal?.currency?.code}</span>
          </span>
        </Col>
      </Row>
      <Row className="item_row">
        <Col span={16} className="item_col ">
          <span className="label">{translate("PR.purchase_description")}</span>
          <span className="value">
            {purchaseProposal?.description || "---"}
          </span>
        </Col>
        <Col span={8} className="item_col">
          <span className="label">{translate("PR.table_create_date")}</span>
          <span className="value">
            {formatDate(
              purchaseProposal?.createdDate || new Date(),
              STANDARD_DATE_FORMAT_SLASH
            )}
          </span>
        </Col>
      </Row>
      <Row className="item_row">
        <Col span={8} className="item_col">
          <span className="label">{translate("PR.user_create")}</span>
          <span className="value">
            {purchaseProposal?.user?.email} - {purchaseProposal?.user?.name}
          </span>
        </Col>
        <Col span={8} className="item_col">
          <span className="label">{translate("PR.creating_unit")}</span>
          <span className="value">
            {purchaseProposal?.organization?.name || "---"}
          </span>
        </Col>
        <Col span={8} className="item_col">
          <span className="label">{translate("PR.position")}</span>
          <span className="value">
            {purchaseProposal?.position?.name || "---"}
          </span>
        </Col>
      </Row>
    </div>
  );
};

export default PurchaseProposalData;
