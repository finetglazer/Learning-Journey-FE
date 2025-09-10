import classNames from "classnames";
import { formatNumber, roundNumber } from "core/helpers/number";
import { uniqueId } from "lodash";
import { useTranslation } from "react-i18next";
import { ItemTable, ItemTableUnit } from "../../../ItemTable/ItemTable";
import { useReceivingGoodsDetailDrawerContext } from "../ReceivingGoodsDetailContext";
import styles from "../ReceivingGoodsDetailDrawer.module.scss";
export const ReceivingGoodsDetailTableTotal = () => {
  const [translate] = useTranslation();

  const { goodsReceiptRequestItem: data, currency } =
    useReceivingGoodsDetailDrawerContext();

  const totalReceivedQuantity =
    data?.qualityByContract - data?.alreadyReceivedQuantity;

  const columnsHeader = [
    {
      title: translate("RG.txt_quantity_contract_full_name"),
      content: formatNumber(data?.qualityByContract),
    },
    {
      title: translate("RG.txt_quantity_received_shorthand"),
      content: formatNumber(data?.alreadyReceivedQuantity),
    },
    {
      title: translate("RG.txt_remaining_quantity"),
      content: formatNumber(totalReceivedQuantity),
    },
  ];
  const columnsContent = [
    {
      title: translate("RG.txt_unit_price"),
      price: data?.unitPrice,
      priceExchange: roundNumber(data?.convertedUnitPrice),
    },
    {
      title: translate("RG.txt_tax_amount_per_item"),
      price: data?.taxAmountPerOne,
      priceExchange: roundNumber(data?.convertedTaxAmountPerOne),
    },
    {
      title: translate("RG.txt_total_amount_per_item"),
      price: data?.totalAmountPerOne,
      priceExchange: roundNumber(data?.convertedTotalAmountPerOne),
    },
  ];
  return (
    <table className={styles["table__col-4"]}>
      <tbody>
        <tr className={classNames(styles["bg-grey"])}>
          {columnsHeader.map((props) => (
            <ItemTable key={uniqueId()} {...props} />
          ))}
        </tr>
        <tr>
          {columnsContent.map((props) => (
            <ItemTableUnit key={uniqueId()} {...props} currency={currency} />
          ))}
        </tr>
      </tbody>
    </table>
  );
};
