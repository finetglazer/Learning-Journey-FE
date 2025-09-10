import React, { useContext } from "react";
import styles from "./PaymentValueContract.module.scss";
import { useTranslation } from "react-i18next";
import { VND_CURRENCY } from "models/Settlement";
import { formatCurrency } from "core/helpers/number";
import { ContractTerminationDetailHookContext } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/ContractTerminationDetailHook";
import {
  ContractPaymentValueModel,
  ContractTerminationContextModel,
} from "models/ContractTermination/ContractTerminationModel";
import classNames from "classnames";
import { isEqual } from "lodash";

type Props = {
  isView?: boolean;
};

const PaymentValueContract = ({ isView }: Props) => {
  const [translate] = useTranslation();
  const { model } = useContext<ContractTerminationContextModel>(
    ContractTerminationDetailHookContext
  );

  const tableData = (
    contractPaymentValue: ContractPaymentValueModel,
    currency?: string
  ) => {
    return [
      {
        title: translate(
          "contractTermination.total_contract_value_includes_VAT"
        ),
        value: contractPaymentValue?.contractAmount,
        valueExchange: contractPaymentValue?.contractConvertedAmount,
        currency: currency,
        isShowVND: !isEqual(currency, VND_CURRENCY),
      },
      {
        title: translate(
          "contractTermination.total_contract_settlement_value_includes_VAT"
        ),
        value: contractPaymentValue?.contractSettlementAmount,
        valueExchange: contractPaymentValue?.contractSettlementConvertedAmount,
        currency: currency,
        isShowVND: !isEqual(currency, VND_CURRENCY),
      },
      {
        title: translate("contractTermination.advanced_paid"),
        value: contractPaymentValue?.paymentAmount,
        currency: currency,
        isShowVND: false,
      },
      {
        title: translate("contractTermination.remaining_payment"),
        value: contractPaymentValue?.remainAmount,
        currency: currency,
        highlight: true,
        isShowVND: false,
      },
    ];
  };

  return (
    <div className="container-custom">
      <table className={styles["table-custom"]}>
        <tbody>
          {tableData(
            model?.contactOrderInfo?.contractPaymentValue,
            model?.contactOrderInfo?.contract?.currency
          )?.map((row, index) => (
            <tr key={index} className={styles["row"]}>
              <td className={styles["cell"]}>
                <div
                  className={`${styles["label"]} ${
                    styles["color-text"]
                  } ${classNames({
                    "fw-bold": row.highlight,
                  })} `}
                >
                  {row.title}
                </div>
              </td>
              <td className={styles["cell"]}>
                <div>
                  <div className="d-flex gap-1 justify-content-end align-items-baseline">
                    <span
                      className={classNames({
                        "fw-medium": !row?.highlight,
                        "fw-bold": row?.highlight,
                      })}
                    >
                      {formatCurrency({
                        value: row.value,
                        code: row.currency,
                      })}
                    </span>
                    <span
                      className={`${styles["tertiary"]} ${styles["font-10"]}`}
                    >
                      {row.currency}
                    </span>
                  </div>
                  {row?.isShowVND && (
                    <div
                      className={`${styles["tertiary"]}} d-flex gap-1 justify-content-end align-items-baseline`}
                    >
                      <span
                        className={`${styles["font-12"]} ${styles["tertiary"]} fw-light`}
                      >
                        {formatCurrency({
                          value: row.valueExchange,
                          code: row.currency,
                        })}
                      </span>
                      <span
                        className={`${styles["font-10"]} ${styles["tertiary"]} fw-light`}
                      >{`${VND_CURRENCY}`}</span>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentValueContract;
