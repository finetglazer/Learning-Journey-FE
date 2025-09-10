import classNames from "classnames";
import { numberConstants, VND_CURRENCY_UNIT } from "core/config/consts";
import { toFixedByCurrency } from "core/helpers/calculator";
import { formatNumber } from "core/helpers/number";
import { ReactElement } from "react";
import { OneLineText } from "react-components-design-system";
import styles from "./ItemTableView.module.scss";

interface ItemTableViewProps {
  title: string;
  content: string | ReactElement;
  colSpan?: number;
}

export const ItemTableView = ({
  title,
  content,
  colSpan,
}: ItemTableViewProps) => {
  return (
    <th colSpan={colSpan}>
      <div className={styles["item"]}>
        <span className={styles["item__label"]}>{title}</span>
        <div className={styles["item__content"]}>{content}</div>
      </div>
    </th>
  );
};

interface ItemTableViewCurrencyProps {
  title: string;
  price: number;
  priceExchange: number;
  currency?: string;
  exchangeRate?: number;
  hasUseTooltip?: boolean;
}

export const ItemTableViewCurrency = ({
  title,
  price = numberConstants.ZERO,
  priceExchange = numberConstants.ZERO,
  currency = VND_CURRENCY_UNIT,
  exchangeRate = numberConstants?.ONE,
  hasUseTooltip,
}: ItemTableViewCurrencyProps) => {
  const exchange = formatNumber(
    toFixedByCurrency(priceExchange * exchangeRate, VND_CURRENCY_UNIT)
  );
  const priceFormat = formatNumber(price);

  return (
    <th>
      <div className={styles["item"]}>
        <span className={styles["item__label"]}>{title}</span>
        <div
          className={classNames(styles["item__content"], {
            "d-flex align-items-end": hasUseTooltip,
          })}
        >
          {hasUseTooltip ? (
            <OneLineText value={priceFormat} />
          ) : (
            <span>{priceFormat}</span>
          )}
          <span className={styles["unit"]}>{currency}</span>
        </div>
        {currency !== VND_CURRENCY_UNIT && (
          <>
            <div
              className={classNames(styles["price-exchange"], {
                "d-flex align-items-end": hasUseTooltip,
              })}
            >
              {hasUseTooltip ? (
                <OneLineText value={exchange} className="text-neutral-7" />
              ) : (
                <span>{exchange}</span>
              )}
              <span className={styles["unit"]}>{VND_CURRENCY_UNIT}</span>
            </div>
          </>
        )}
      </div>
    </th>
  );
};
