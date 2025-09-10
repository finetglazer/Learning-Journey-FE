import React, { useState } from "react";
import styles from "./AssetFormationValue.module.scss";
import { ChevronDown } from "@carbon/icons-react";
import { isArray, isEqual } from "lodash";
import { useTranslation } from "react-i18next";
import { numberConstants } from "core/config/consts";
import { formatNumber } from "core/helpers/number";
import classNames from "classnames";
import {
  AssetFormationModel,
  AssetFormationType,
  VND_CURRENCY,
} from "models/Settlement";

type props = {
  assetFormations: AssetFormationModel[];
};
const AssetFormationValue = ({ assetFormations }: props) => {
  const [translate] = useTranslation();
  const [expanded, setExpanded] = useState<number | null>(numberConstants.ONE);

  const toggleExpand = (id: number) => {
    setExpanded(isEqual(expanded, id) ? null : id);
  };

  const getDataCell = (data: AssetFormationModel[], type: number) => {
    const dataCell = isArray(data)
      ? data.find((item) => isEqual(item?.type, type))
      : null;
    return dataCell?.amount || 0;
  };

  const totalAssetFormation = assetFormations.reduce((acc, cur) => {
    if (cur.type !== AssetFormationType.Fixed) {
      return acc + cur.amount;
    }
    return acc;
  }, 0);

  return (
    <div className={styles["summary-table__container"]}>
      <div className={styles["summary-table__right"]}>
        <div className={styles["summary-table__box"]}>
          <div
            className={`${styles["summary-table__asset"]} ${styles["custom-padding"]}`}
          >
            <span className={styles["summary-table__asset__fixed"]}>
              {translate("CT.total")}
            </span>
            <div className={styles["summary-table__sidebar"]}>
              <span
                className={`${styles["summary-value__expense"]} fw-semibold`}
              >
                <span>{formatNumber(totalAssetFormation)}</span>
              </span>
              <span className={styles["unit"]}>{VND_CURRENCY}</span>
            </div>
          </div>
        </div>
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
                {formatNumber(
                  getDataCell(assetFormations, AssetFormationType.Fixed)
                )}
              </span>
              <span className={styles["unit"]}>{VND_CURRENCY}</span>
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
                      getDataCell(
                        assetFormations,
                        AssetFormationType.FixedTangible
                      )
                    )}
                  </span>
                  <span className={styles["unit"]}>{VND_CURRENCY}</span>
                </div>
              </div>
              <div className={styles["summary-table__subitem"]}>
                <span className={styles["summary-table__title_expanded"]}>
                  {translate("PS.txt_asset_fixed_intangible")}
                </span>
                <div className={styles["summary-table__sidebar"]}>
                  <span className={styles["summary-value__expanded"]}>
                    {formatNumber(
                      getDataCell(
                        assetFormations,
                        AssetFormationType.FixedIntangible
                      )
                    )}
                  </span>
                  <span className={styles["unit"]}>{VND_CURRENCY}</span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles["summary-table__box"]}>
          <div
            className={`${styles["summary-table__asset"]} ${styles["custom-padding"]}`}
          >
            <span className={styles["summary-table__asset__fixed"]}>
              {translate("PS.txt_asset_aseful_tool")}
            </span>
            <div className={styles["summary-table__sidebar"]}>
              <span className={styles["summary-value"]}>
                {formatNumber(
                  getDataCell(assetFormations, AssetFormationType.Tools)
                )}
              </span>
              <span className={styles["unit"]}>{VND_CURRENCY}</span>
            </div>
          </div>
        </div>
        <div className={styles["summary-table__box"]}>
          <div
            className={`${styles["summary-table__asset"]} ${styles["custom-padding"]} border-bottom-0 ${styles["summary-height__76"]}`}
          >
            <span className={styles["summary-table__asset__fixed"]}>
              {translate("PS.txt_asset_expense")}
            </span>
            <div className={styles["summary-table__sidebar"]}>
              <span className={styles["summary-value__expense "]}>
                <span className="fw-semibold">
                  {formatNumber(
                    getDataCell(assetFormations, AssetFormationType.Cost)
                  )}
                </span>
              </span>
              <span className={styles["unit"]}>{VND_CURRENCY}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetFormationValue;
