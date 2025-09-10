import { Col, Row } from "antd";
import { IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { formatNumber } from "core/helpers/number";
import { VND_CURRENCY } from "models/Payment";
import { ProposalCreateModel } from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import FundamentalInfo from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalGoodServices/Components/FundamentalInfo/FundamentalInfo";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import "./FundamentalInfoDetail.scss";

export function FundamentalInfoDetail() {
  const [translate] = useTranslation();
  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const isVND = model?.currency?.code === VND_CURRENCY;
  return (
    <div className="body">
      <Row className="item_row">
        <Col span={8} className="item_col">
          <span className="label">{translate("PR.currency_type")}</span>
          <span className="value text_blue">
            {model?.currency?.code || "---"}
          </span>
        </Col>
        {!isVND && (
          <>
            <Col span={8} className="item_col">
              <span className="label">{translate("PR.exchange_rate")}</span>
              <span className="value ">
                {!isVND ? formatNumber(model?.rateInfo?.rate) : "---"}
              </span>
            </Col>
            <Col span={8} className="item_col">
              <span className="label">
                {translate("PR.exchange_rate_source")}
              </span>
              <span className="value">{model?.rateInfo?.source || "---"}</span>
            </Col>
          </>
        )}
      </Row>
      <Row className="item_row">
        <Col span={8} className="item_col">
          <span className="label">{translate("PR.cost_type")}</span>
          <span className="value text_blue">
            {`${model?.costType?.code} - ${model?.costType?.name}` || "---"}
          </span>
        </Col>
        <Col span={16} className="item_col">
          <span className="label">{translate("PR.cost_item")}</span>
          <span className="value ">{model?.costGroup?.name || "---"}</span>
        </Col>
      </Row>
    </div>
  );
}

type FundamentalWrapProps = {
  isShow?: boolean;
  isShowHeader?: boolean;
};

export function FundamentalWrap({
  isShow,
  isShowHeader,
}: FundamentalWrapProps) {
  const [translate] = useTranslation();

  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const [collapse, setCollapse] = useState<boolean>(true);

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  if (!isShow) return null;

  return (
    <div
      className={classNames(
        "Fundamental_info_detail_wrapper",
        isShowHeader && "Fundamental_info_detail_wrapper-padding"
      )}
    >
      {isShowHeader && (
        <div className="header" onClick={handleChangeCollapse}>
          <div className="title">
            {translate("PP.title_fundamental_information")}
          </div>
          <div>
            <img
              className={classNames("cursor-pointer", {
                "rotate-180": collapse,
                "rotate-0": !collapse,
              })}
              src={IcArrowDown}
              alt="img"
              width={16}
              height={16}
            />
          </div>
        </div>
      )}
      {collapse && (
        <div
          className={classNames(
            !isShowHeader && "p-3 Fundamental_info_detail_wrapper-bg_color"
          )}
        >
          {model?.isDetail ? <FundamentalInfoDetail /> : <FundamentalInfo />}
        </div>
      )}
    </div>
  );
}
