import { Col, Row } from "antd";
import "./AssetInfoView.scss";
import { useContext } from "react";
import {
  ContractTerminationContextModel,
  VND_CURRENCY,
} from "models/ContractTermination";
import { useTranslation } from "react-i18next";
import { ContractTerminationDetailHookContext } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/ContractTerminationDetailHook";
import { formatCurrency } from "core/helpers/number";

const CurrencyView = ({
  value1,
  value2,
  currency = VND_CURRENCY,
}: {
  value1?: number;
  value2?: number;
  currency?: string;
}) => {
  return (
    <div className="currency-item">
      {value1 >= 0 && (
        <div className="value-1">
          {formatCurrency({
            value: value1,
            shouldRoundTwoNumber: false,
            code: currency,
          })}
          <span>{currency}</span>
        </div>
      )}
      {value2 >= 0 && currency !== VND_CURRENCY && (
        <div className="value-2">
          {formatCurrency({
            value: value2,
            shouldRoundTwoNumber: false,
            code: VND_CURRENCY,
          })}
          <span>{VND_CURRENCY}</span>
        </div>
      )}
    </div>
  );
};

const AssetInfoView = () => {
  const [translate] = useTranslation();
  const { model } = useContext<ContractTerminationContextModel>(
    ContractTerminationDetailHookContext
  );
  const contractPaymentValue = model?.contractPaymentValue;

  const assets = [
    {
      title: translate(
        "contractTermination.total_contract_value_including_vat"
      ),
      value: (
        <CurrencyView
          value1={contractPaymentValue?.contractAmount || 0}
          value2={contractPaymentValue?.contractConvertedAmount || 0}
          currency={model?.currency}
        />
      ),
    },
    {
      title: translate(
        "contractTermination.total_finalized_contract_value_including_vat"
      ),
      value: (
        <CurrencyView
          value1={contractPaymentValue?.contractSettlementAmount || 0}
          value2={contractPaymentValue?.contractSettlementConvertedAmount || 0}
          currency={model?.currency}
        />
      ),
    },
    {
      title: translate("contractTermination.disbursed_paid"),
      value: (
        <CurrencyView
          value1={contractPaymentValue?.paymentAmount || 0}
          currency={model?.currency}
        />
      ),
    },
    {
      title: translate("contractTermination.remaining_amount_to_be_paid"),
      value: (
        <CurrencyView
          value1={contractPaymentValue?.remainAmount || 0}
          currency={model?.currency}
        />
      ),
    },
  ];
  return (
    <div className="asset-info-container">
      <Row gutter={16} className="asset-info-row">
        <Col className="gutter-row" span={12}>
          {assets?.map((p) => (
            <div key={p.title} className="asset-box">
              <div className="title">{p.title}</div>
              <div className="value">{p.value}</div>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default AssetInfoView;
