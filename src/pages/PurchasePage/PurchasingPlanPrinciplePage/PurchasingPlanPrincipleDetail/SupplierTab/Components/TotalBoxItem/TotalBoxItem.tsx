import { isEqual } from "lodash";
import { VND_CURRENCY_UNIT } from "core/config/consts";

import styles from "./TotalBoxItem.module.scss";

export interface TotalBoxItemProps {
  title: string;
  price: string;
  covertPrice?: string;
  currency: string;
}

const TotalBoxItem = ({
  title,
  price,
  covertPrice,
  currency,
}: TotalBoxItemProps) => {
  return (
    <div className={styles["total-amount-item"]}>
      <span className={styles["title"]}>{title}</span>
      <div className="d-flex gap-1 align-items-baseline">
        <strong className={styles["primary-number"]}>{price}</strong>
        <span className={styles["currency"]}>{currency}</span>
      </div>
      {covertPrice &&
        !isEqual(currency?.toLowerCase(), VND_CURRENCY_UNIT.toLowerCase()) && (
          <div className="d-flex gap-1 align-items-baseline">
            <span className={styles["secondary-number"]}>{covertPrice}</span>
            <span className={styles["currency"]}>{VND_CURRENCY_UNIT}</span>
          </div>
        )}
    </div>
  );
};

export default TotalBoxItem;
