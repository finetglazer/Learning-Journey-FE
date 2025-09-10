import { useTranslation } from "react-i18next";
import "./SettlementContractDetail.scss";
import { GoodsItemsType } from "models/Settlement";
import { Tooltip } from "antd";

interface Props {
  recordGoodServices: GoodsItemsType;
}

const SettlementContractDetail = ({ recordGoodServices }: Props) => {
  const [translate] = useTranslation();

  return (
    <div className="settlement-contract-info">
      <div className="info-grid">
        <div className="info-item">
          <p className="label">
            {translate("settlement.goods_and_services_code")}
          </p>
          <p className="value">{recordGoodServices?.contractGoodsItem?.code}</p>
        </div>
        <div className="info-item">
          <p className="label">
            {translate("settlement.goods_and_services_name")}
          </p>
          <Tooltip title={recordGoodServices?.contractGoodsItem?.name}>
            <span className="value">
              {recordGoodServices?.contractGoodsItem?.name}
            </span>
          </Tooltip>
        </div>
        <div className="info-item">
          <p className="label">
            {translate("settlement.settlement_manufacturer_generic")}
          </p>
          <p className="value">
            {recordGoodServices?.contractGoodsItem?.branch?.name}
          </p>
        </div>
        <div className="info-item">
          <p className="label">{translate("settlement.settlement_unit")}</p>
          <p className="value">
            {recordGoodServices?.contractGoodsItem?.unit?.name}
          </p>
        </div>
        <div className="info-item">
          <p className="label">
            {translate("settlement.settlement_description_goods_and_services")}
          </p>
          <Tooltip title={recordGoodServices?.contractGoodsItem?.description}>
            <span className="value">
              {recordGoodServices?.contractGoodsItem?.description}
            </span>
          </Tooltip>
        </div>
        <div className="info-item">
          <p className="label">{translate("settlement.note")}</p>
          <Tooltip title={recordGoodServices?.contractGoodsItem?.note}>
            <span className="value">
              {recordGoodServices?.contractGoodsItem?.note}
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default SettlementContractDetail;
