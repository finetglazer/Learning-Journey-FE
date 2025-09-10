import classNames from "classnames";
import { numberConstants } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { gt, lt, isEqual } from "lodash";
import styles from "./ValueComparison.module.scss";
import { Tooltip } from "antd";

interface ValueComparisonProps {
  value: number;
  className?: string;
  isShowSigns?: boolean;
}

export default function ValueComparison({
  value,
  className,
  isShowSigns,
}: ValueComparisonProps) {
  return (
    <Tooltip
      className={classNames(
        styles["comparison"],
        {
          [styles["comparison--sign"]]: isShowSigns,
          [styles["comparison--blue"]]: gt(value, numberConstants.ZERO),
          [styles["comparison--red"]]:
            lt(value, numberConstants.ONE) &&
            !isEqual(value, numberConstants.ZERO),
        },
        className
      )}
      title={formatNumber(value)}
    >
      {formatNumber(Math.abs(value))}
    </Tooltip>
  );
}
