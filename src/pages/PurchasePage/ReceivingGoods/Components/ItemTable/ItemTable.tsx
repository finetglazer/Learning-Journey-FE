import { numberConstants, VND_CURRENCY_UNIT } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { isEqual } from "lodash";
import { ReactElement } from "react";
import styles from "./ItemTable.module.scss";

interface ItemTableProps {
  title: string;
  content: string | ReactElement;
  colSpan?: number;
}

export const ItemTable = ({ title, content, colSpan }: ItemTableProps) => {
  return (
    <th colSpan={colSpan}>
      <div className={styles["item"]}>
        <span className={styles["item__label"]}>{title}</span>
        <div className={styles["item__content"]}>{content}</div>
      </div>
    </th>
  );
};

interface ItemTableUnitProps {
  title: string;
  price: number;
  priceExchange: number;
  currency?: string;
  exchangeRate?: number;
}

export const ItemTableUnit = ({
  title,
  price = numberConstants.ZERO,
  priceExchange = numberConstants.ZERO,
  currency = VND_CURRENCY_UNIT,
  exchangeRate = numberConstants?.ONE,
}: ItemTableUnitProps) => {
  return (
    <th>
      <div className={styles["item"]}>
        <span className={styles["item__label"]}>{title}</span>
        <div className={styles["item__content"]}>
          <span>{formatNumber(price)}</span>
          <span className={styles["unit"]}>{currency}</span>
          {isEqual(currency, VND_CURRENCY_UNIT) ? null : (
            <>
              <div className={styles["price-exchange"]}>
                <span>{formatNumber(priceExchange * exchangeRate)}</span>
                <span className={styles["unit"]}>{VND_CURRENCY_UNIT}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </th>
  );
};
