import {
  ItemTableView,
  ItemTableViewCurrency,
} from "components/ItemTableView/ItemTableView";
import { numberConstants } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { gt, isEqual, lt, uniqueId } from "lodash";
import { useTranslation } from "react-i18next";
import styles from "../AcceptanceInformationDrawer.module.scss";
import { useAcceptanceInformationContext } from "pages/PurchasePage/Acceptance/AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";
import classNames from "classnames";

export const AcceptanceInformationTableGeneral = () => {
  const [translate] = useTranslation();
  const { goodsReceiptSelect, model } = useAcceptanceInformationContext();

  const columnsHeader = [
    {
      title: translate("AC.txt_product_code"),
      content: goodsReceiptSelect?.code,
    },
    {
      title: translate("AC.txt_product_name"),
      content: goodsReceiptSelect?.name,
    },
    {
      title: translate("AC.txt_manufacturer_or_type"),
      content: goodsReceiptSelect?.branch?.name,
    },
  ];

  const columnsMiddleTop = [
    {
      title: translate("AC.txt_unit_of_measure"),
      content: goodsReceiptSelect?.unit?.name,
    },
    {
      title: translate("AC.txt_product_description"),
      content: goodsReceiptSelect?.description,
    },
  ];

  const quantityDifference = goodsReceiptSelect?.quantityDifference;

  const columnsBottom = [
    {
      title: translate("AC.txt_actual_received_quantity"),
      content: formatNumber(goodsReceiptSelect?.quantity),
    },
    {
      title: translate("AC.txt_contract_quantity"),
      content: formatNumber(goodsReceiptSelect?.quantityConact),
    },
    {
      title: translate("AC.txt_quantity_difference"),
      content: (
        <span
          className={classNames({
            [styles["text-variance"]]: gt(
              quantityDifference,
              numberConstants.ZERO
            ),
            [styles["text-variance--incomplete"]]:
              lt(quantityDifference, numberConstants.ONE) &&
              !isEqual(quantityDifference, numberConstants.ZERO),
          })}
        >
          {formatNumber(quantityDifference)}
        </span>
      ),
    },
  ];

  return (
    <>
      <table className={styles["table"]}>
        <tbody>
          <tr className={styles["bg-grey"]}>
            {columnsHeader.map((props) => (
              <ItemTableView key={uniqueId()} {...props} />
            ))}
          </tr>
          <tr>
            {columnsMiddleTop.map((props, index) => (
              <ItemTableView
                key={uniqueId()}
                {...props}
                colSpan={index ? numberConstants.TWO : numberConstants.ONE}
              />
            ))}
          </tr>
          <tr>
            <ItemTableViewCurrency
              title={translate("AC.txt_unit_price")}
              price={goodsReceiptSelect?.unitPrice}
              currency={model?.currency}
              priceExchange={goodsReceiptSelect?.convertedUnitPrice}
            />
            <ItemTableView
              title={translate("AC.txt_product_notes")}
              content={goodsReceiptSelect?.contractNote}
              colSpan={numberConstants.TWO}
            />
          </tr>
          <tr>
            {columnsBottom.map((props) => (
              <ItemTableView key={uniqueId()} {...props} />
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
};
