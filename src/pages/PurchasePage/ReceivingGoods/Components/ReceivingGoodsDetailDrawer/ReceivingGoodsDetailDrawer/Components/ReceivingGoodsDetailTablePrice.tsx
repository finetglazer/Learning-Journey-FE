import { uniqueId } from "lodash";
import { useTranslation } from "react-i18next";
import { ItemTableUnit } from "../../../ItemTable/ItemTable";
import { useReceivingGoodsDetailDrawerContext } from "../ReceivingGoodsDetailContext";
import styles from "../ReceivingGoodsDetailDrawer.module.scss";
export const ReceivingGoodsDetailTablePrice = () => {
  const [translate] = useTranslation();

  const { goodsReceiptRequestItem: data, currency } =
    useReceivingGoodsDetailDrawerContext();

  const columns = [
    {
      title: translate("RG.txt_amount_before_tax"),
      price: data?.amountBeforeTax,
      priceExchange: data?.convertedAmountBeforeTax,
    },
    {
      title: translate("RG.txt_tax_amount"),
      price: data?.taxAmount,
      priceExchange: data?.convertedTaxAmount,
    },
    {
      title: translate("RG.txt_total_amount"),
      price: data?.totalAmount,
      priceExchange: data?.convertedTotalAmount,
    },
  ];
  return (
    <table className={styles["table__blue"]}>
      <tbody>
        <tr className={styles["bg-blue"]}>
          {columns.map((props) => (
            <ItemTableUnit key={uniqueId()} {...props} currency={currency} />
          ))}
        </tr>
      </tbody>
    </table>
  );
};
