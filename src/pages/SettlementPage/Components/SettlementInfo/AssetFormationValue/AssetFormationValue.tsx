import React, { useContext, useState } from "react";
import styles from "./AssetFormationValue.module.scss";
import { ChevronDown } from "@carbon/icons-react";
import { isArray, isEqual, isNil, toNumber } from "lodash";
import { useTranslation } from "react-i18next";
import { numberConstants } from "core/config/consts";
import classNames from "classnames";
import {
  AssetFormationModel,
  AssetFormationType,
  SettlementHookModel,
  VND_CURRENCY,
} from "models/Settlement";
import { SettlementHookContext } from "../../../SettlementDetail/SettlementDetailHook";
import { FormItem, InputNumber } from "react-components-design-system";
import { utilService } from "core/services/common-services/util-service";
import { NUMBER_MAX_13 } from "config/const";
import { formatCurrency } from "core/helpers/number";

type props = {
  isView?: boolean;
};
const AssetFormationValue = ({ isView }: props) => {
  const [translate] = useTranslation();
  const [expanded, setExpanded] = useState<number | null>(numberConstants.ONE);
  const { model, handleChangeAllField } = useContext<SettlementHookModel>(
    SettlementHookContext
  );
  const assetFormations = model?.assetFormations;
  const totalAssetFormation = assetFormations?.reduce((acc, cur) => {
    if (cur.type !== AssetFormationType.Fixed) {
      return acc + cur.amountExchange;
    }
    return acc;
  }, 0);

  const toggleExpand = (id: number) => {
    setExpanded(isEqual(expanded, id) ? null : id);
  };

  const getDataCell = (data: AssetFormationModel[], type: number) => {
    const dataCell = isArray(data)
      ? data.find((item) => isEqual(item?.type, type))
      : null;
    const value = formatCurrency({
      value: dataCell?.amountExchange,
      shouldRoundTwoNumber: false,
      code: VND_CURRENCY,
    });
    return value;
  };

  return (
    <div className={styles["summary-table__container"]}>
      <div className={styles["summary-table__left"]}>
        <span className={styles["summary-table__total"]}>
          {translate("CT.total")}
        </span>
        <div className={styles["summary-table__main"]}>
          <span
            className={`${styles["summary-table__value"]} text-wrap text-break`}
          >
            {formatCurrency({
              value: totalAssetFormation,
              shouldRoundTwoNumber: false,
              code: VND_CURRENCY,
            })}
          </span>
          <span className={styles["summary-table__unit"]}>{VND_CURRENCY}</span>
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
                {getDataCell(assetFormations, AssetFormationType.Fixed)}
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
                    {getDataCell(
                      assetFormations,
                      AssetFormationType.FixedTangible
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
                    {getDataCell(
                      assetFormations,
                      AssetFormationType.FixedIntangible
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
                {getDataCell(assetFormations, AssetFormationType.Tools)}
              </span>
              <span className={styles["unit"]}>{VND_CURRENCY}</span>
            </div>
          </div>
        </div>
        <div className={styles["summary-table__box"]}>
          <div
            className={`${styles["summary-table__asset"]} ${styles["custom-padding"]} border-bottom-0`}
          >
            <span className={styles["summary-table__asset__fixed"]}>
              {translate("PS.txt_asset_expense")}
            </span>
            <div className={styles["summary-table__sidebar"]}>
              <span className={styles["summary-value__expense"]}>
                {isView ? (
                  <span>
                    {getDataCell(assetFormations, AssetFormationType.Cost)}
                  </span>
                ) : (
                  <FormItem
                    validateObject={utilService.getValidateObj(
                      model,
                      "assetCost"
                    )}
                  >
                    <InputNumber
                      className={styles["input-number"]}
                      isRequired
                      allowClear={
                        getDataCell(
                          assetFormations,
                          AssetFormationType.Cost
                        ) !== "0"
                      }
                      placeHolder={translate(
                        "settlement.placeHolder.expenseEnter"
                      )}
                      value={toNumber(
                        getDataCell(
                          assetFormations,
                          AssetFormationType.Cost
                        ).replace(/\./g, "")
                      )}
                      onChange={(value) => {
                        value = isNil(value) ? 0 : value;
                        handleChangeAllField({
                          ...model,
                          assetCost: value,
                          assetFormations: assetFormations.map((item) => {
                            if (isEqual(item?.type, AssetFormationType.Cost)) {
                              return {
                                ...item,
                                amount: value,
                                amountExchange: value,
                              };
                            }
                            return item;
                          }),
                        });
                      }}
                      max={NUMBER_MAX_13}
                      isSmall={false}
                    />
                  </FormItem>
                )}
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
