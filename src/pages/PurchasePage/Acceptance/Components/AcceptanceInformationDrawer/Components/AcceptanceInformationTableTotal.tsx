import { ItemTableViewCurrency } from "components/ItemTableView/ItemTableView";
import { useAcceptanceInformationContext } from "pages/PurchasePage/Acceptance/AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";
import { useTranslation } from "react-i18next";
import styles from "../AcceptanceInformationDrawer.module.scss";
import { toFixedByCurrency } from "core/helpers/calculator";
import { VND_CURRENCY_UNIT } from "core/config/consts";

export const AcceptanceInformationTableTotal = () => {
  const [translate] = useTranslation();

  const { goodsReceiptSelect, model } = useAcceptanceInformationContext();

  const currency = model?.currency;

  const columns = [
    {
      title: translate("RG.txt_amount_before_tax"),
      price: toFixedByCurrency(goodsReceiptSelect?.amountBeforeTax, currency),
      priceExchange: toFixedByCurrency(
        goodsReceiptSelect?.convertedAmountBeforeTax,
        VND_CURRENCY_UNIT
      ),
    },
    {
      title: translate("RG.txt_tax_amount"),
      price: toFixedByCurrency(goodsReceiptSelect?.taxAmount, currency),
      priceExchange: toFixedByCurrency(
        goodsReceiptSelect?.taxConvertedAmount,
        VND_CURRENCY_UNIT
      ),
    },
    {
      title: translate("RG.txt_total_amount"),
      price: toFixedByCurrency(goodsReceiptSelect?.totalAmount, currency),
      priceExchange: toFixedByCurrency(
        goodsReceiptSelect?.totalConvertedAmount,
        VND_CURRENCY_UNIT
      ),
    },
  ];

  return (
    <table className={styles["table__blue"]}>
      <tbody>
        <tr className={styles["bg-blue"]}>
          {columns.map((props, index) => (
            <ItemTableViewCurrency
              key={index}
              {...props}
              currency={model?.currency}
            />
          ))}
        </tr>
      </tbody>
    </table>
  );
};
