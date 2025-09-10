import { Col, Row } from "antd";
import { formatNumber } from "core/helpers/number";
import { RateInfoJSON } from "models/Proposal";
import {
  PurchaseProposal,
  PurchaseRequestDetailModel,
} from "models/PurchaseRequest";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";
import "./Currency.scss";
import { VND_CURRENCY } from "models/Payment";

const Currency = () => {
  const [translate] = useTranslation();

  const { model } = useContext<PurchaseRequestDetailModel>(
    PurchaseRequestDetailHookContext
  );

  const purchaseProposal =
    model?.purchaseProposalId || ({} as PurchaseProposal);
  const rateInfoJson =
    model?.purchaseProposalId?.rateInfoJson || ({} as RateInfoJSON);
  const isVND = purchaseProposal?.currency?.code === VND_CURRENCY;

  return (
    <div className="goods_services_currency_wrapper">
      <Row className="item_row">
        <Col span={8} className="item_col">
          <span className="label">{translate("PR.currency_type")}</span>
          <span className="value text_blue">
            {purchaseProposal?.currency?.code || "---"}
          </span>
        </Col>
        {!isVND && (
          <>
            <Col span={8} className="item_col">
              <span className="label">{translate("PR.exchange_rate")}</span>
              <span className="value ">
                {!isVND ? formatNumber(rateInfoJson?.rate) : "---"}
              </span>
            </Col>
            <Col span={8} className="item_col">
              <span className="label">
                {translate("PR.exchange_rate_source")}
              </span>
              <span className="value">{rateInfoJson?.source || "---"}</span>
            </Col>
          </>
        )}
      </Row>
      <Row className="item_row">
        <Col span={8} className="item_col">
          <span className="label">{translate("PR.cost_type")}</span>
          <span className="value text_blue">
            {`${purchaseProposal?.costType?.code} - ${purchaseProposal?.costType?.name}` ||
              "---"}
          </span>
        </Col>
        <Col span={16} className="item_col">
          <span className="label">{translate("PR.cost_item")}</span>
          <span className="value ">
            {purchaseProposal?.costGroup?.name || "---"}
          </span>
        </Col>
      </Row>
    </div>
  );
};

export default Currency;
