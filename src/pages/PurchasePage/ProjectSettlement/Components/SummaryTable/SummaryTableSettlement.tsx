import { ChevronDown } from "@carbon/icons-react";
import classNames from "classnames";
import { numberConstants, VND_CURRENCY_UNIT } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import { isEqual } from "lodash";
import { ProjectSettlementProposal } from "models/ProjectSettlement";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SummaryTableSettlement.module.scss";

interface SummaryTableSettlementProps {
  data?: ProjectSettlementProposal;
}

const SummaryTableSettlement = ({ data }: SummaryTableSettlementProps) => {
  const [translate] = useTranslation();
  const [expanded, setExpanded] = useState<number | null>(numberConstants.ONE);

  const toggleExpand = (id: number) => {
    setExpanded(isEqual(expanded, id) ? null : id);
  };

  return (
    <div className={styles["summary-table__container"]}>
      <div className={styles["summary-table__left"]}>
        <span className={styles["summary-table__total"]}>
          {translate("CT.total")}
        </span>
        <div className={styles["summary-table__main"]}>
          <span className={styles["summary-table__value"]}>
            {formatNumber(data?.contractSettlementAsset?.totalAmount)}
          </span>
          <span className={styles["summary-table__unit"]}>
            {VND_CURRENCY_UNIT}
          </span>
        </div>
      </div>

      <div className={styles["summary-table__right"]}>
        <div className={styles["summary-table__box"]}>
          <div
            className={styles["summary-table__asset"]}
            onClick={() => toggleExpand(numberConstants.ONE)}
          >
            <span className={styles["summary-table__asset__fixed"]}>
              <ChevronDown
                className={classNames(styles["dropdown-icon"], {
                  [styles["expanded"]]: isEqual(expanded, numberConstants.ONE),
                })}
              />
              {translate("PS.txt_asset_fixed")}
            </span>
            <div className={styles["summary-table__sidebar"]}>
              <span className={styles["summary-value"]}>
                {formatNumber(data?.contractSettlementAsset?.assetFixedAmount)}
              </span>
              <span className={styles["unit"]}>{VND_CURRENCY_UNIT}</span>
            </div>
          </div>
          {isEqual(expanded, numberConstants.ONE) && (
            <>
              <div className={styles["summary-table__subitem"]}>
                <span className={styles["summary-table__title_expanded"]}>
                  {translate("PS.txt_asset_fixed_tangible")}
                </span>
                <div className={styles["summary-table__sidebar"]}>
                  <span className={styles["summary-value__expanded"]}>
                    {formatNumber(
                      data?.contractSettlementAsset?.assetFixedTangibleAmount
                    )}
                  </span>
                  <span className={styles["unit"]}>{VND_CURRENCY_UNIT}</span>
                </div>
              </div>
              <div className={styles["summary-table__subitem"]}>
                <span className={styles["summary-table__title_expanded"]}>
                  {translate("PS.txt_asset_fixed_intangible")}
                </span>
                <div className={styles["summary-table__sidebar"]}>
                  <span className={styles["summary-value__expanded"]}>
                    {formatNumber(
                      data?.contractSettlementAsset?.assetFixedIntangibleAmount
                    )}
                  </span>
                  <span className={styles["unit"]}>{VND_CURRENCY_UNIT}</span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles["summary-table__box"]}>
          <div className={styles["summary-table__asset"]}>
            <span className={styles["summary-table__asset__fixed"]}>
              {translate("PS.txt_asset_aseful_tool")}
            </span>
            <div className={styles["summary-table__sidebar"]}>
              <span className={styles["summary-value"]}>
                {formatNumber(data?.contractSettlementAsset?.assetToolsAmount)}
              </span>
              <span className={styles["unit"]}>{VND_CURRENCY_UNIT}</span>
            </div>
          </div>
        </div>
        <div className={styles["summary-table__box"]}>
          <div className={styles["summary-table__asset"]}>
            <span className={styles["summary-table__asset__fixed"]}>
              {translate("PS.txt_asset_expense")}
            </span>
            <div className={styles["summary-table__sidebar"]}>
              <span className={styles["summary-value__expense"]}>
                {formatNumber(data?.contractSettlementAsset?.assetCostAmount)}
              </span>
              <span className={styles["unit"]}>{VND_CURRENCY_UNIT}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryTableSettlement;
