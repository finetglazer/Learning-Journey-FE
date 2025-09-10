import { gt, isEmpty, isEqual, isNil } from "lodash";
import { Fragment, useEffect, useState } from "react";

import { numberConstants } from "core/config/consts";
import { formatCurrency } from "core/helpers/currency";
import { Goods } from "models/ProjectSettlement/ProjectSettlementModel";
import { OneLineText } from "react-components-design-system";
import styles from "./CollapseRow.module.scss";
import { ChevronDownIcon, ChevronRightIcon } from "./Icons";
import { ModelData } from "./Model";

interface CollapseRowProps {
  data: ModelData[];
  onRowClick: (item: Goods) => void;
}

export const CollapseRow = ({ data, onRowClick }: CollapseRowProps) => {
  const [expandedRows, setExpandedRows] = useState<string[]>(
    data?.map((item) => item?.category?.id) || []
  );

  useEffect(() => {
    // Expand all rows
    const expandedRows = data?.map((item) => item?.category?.id);

    setExpandedRows(expandedRows);
  }, [data]);

  const toggleRow = (id: string) => {
    setExpandedRows((previousState) => {
      return previousState.includes(id)
        ? previousState?.filter((rowId) => !isEqual(rowId, id))
        : [...previousState, id];
    });
  };

  const calculateInvestmentTotal = (data: Goods[]) => {
    return data?.reduce(
      (total, item) => {
        total.investmentBeforeTax += item?.investmentBeforeTax;
        total.investmentTax += item?.investmentTax;
        total.investmentSum += item?.investmentSum;
        return total;
      },
      {
        investmentBeforeTax: numberConstants.ZERO,
        investmentTax: numberConstants.ZERO,
        investmentSum: numberConstants.ZERO,
      }
    );
  };

  const calculateSettlementTotal = (data: Goods[]) => {
    return data?.reduce(
      (total, item) => {
        total.settlementBeforeTax += item?.settlementBeforeTax;
        total.settlementTax += item?.settlementTax;
        total.settlementSum += item?.settlementSum;
        return total;
      },
      {
        settlementBeforeTax: numberConstants.ZERO,
        settlementTax: numberConstants.ZERO,
        settlementSum: numberConstants.ZERO,
      }
    );
  };

  const makeInvestmentRow = (data: Goods[]) => {
    const item = calculateInvestmentTotal(data);

    return makeSectionRow([
      item?.investmentBeforeTax,
      item?.investmentTax,
      item?.investmentSum,
    ]);
  };

  const makeSettlementRow = (data: Goods[]) => {
    const item = calculateSettlementTotal(data);

    return makeSectionRow([
      item?.settlementBeforeTax,
      item?.settlementTax,
      item?.settlementSum,
    ]);
  };

  const makeSectionRow = (values: number[], isBold?: boolean) => {
    const className =
      isNil(isBold) || isEqual(isBold, true) ? "" : styles["normal-text"];
    return (
      <div className={`${styles["currency-row"]} ${className}`}>
        {values.map((value, index) => (
          <div key={index}>
            {formatCurrency(value || numberConstants?.ZERO)}
          </div>
        ))}
      </div>
    );
  };

  const makeSpecialText = (value: number) => {
    let className = "";
    const isGreaterThanZero = gt(value, numberConstants.ZERO);

    if (isEqual(value, numberConstants.ZERO)) {
      className = styles.neutral;
    } else {
      className = isGreaterThanZero ? styles.positive : styles.negative;
    }

    const displayValue = isGreaterThanZero
      ? `+${formatCurrency(value || numberConstants?.ZERO)}`
      : formatCurrency(value || numberConstants?.ZERO);

    return (
      <div className={`${styles.number} ${className}`}>{displayValue}</div>
    );
  };

  const makeParentRow = (data: ModelData) => {
    const isExpanded = expandedRows.includes(data?.category?.id);
    const Icon = isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />;

    return (
      <tr className={styles["parent-wrapper"]} key={data?.category?.id}>
        {/* Button */}
        <td className={styles["parent-row"]}>
          <div onClick={() => toggleRow(data?.category?.id)}>
            {Icon}
            <span>{data?.category?.name}</span>
          </div>
        </td>
        <td />
        <td />
        <td>{makeInvestmentRow(data?.items)}</td>

        <td>{makeSettlementRow(data?.items)}</td>
        <td>
          <span>
            {makeSpecialText(
              data?.items?.reduce((total, item) => {
                total += item?.differenceValue;
                return total;
              }, numberConstants.ZERO) || numberConstants.ZERO
            )}
          </span>
        </td>
      </tr>
    );
  };

  const makeProductInformation = (item: Goods) => {
    return (
      <div className={styles["product-information"]}>
        <div className={styles["name"]} onClick={() => onRowClick(item)}>
          <OneLineText value={item.goodsName} className={styles["name"]} />
        </div>
        <div className={styles["code"]}>{item.goodsCode}</div>
      </div>
    );
  };

  const makeNormalText = (value: string, useTooltip?: boolean) => {
    return (
      <div className={styles["normal-text"]}>
        <OneLineText value={value} useTooltip={useTooltip} />
      </div>
    );
  };

  const makeChildRow = (item: Goods[], rowId: string) => {
    if (isEmpty(item) || !expandedRows?.includes(rowId)) return null;

    return item.map((item, index) => {
      return (
        <tr key={index} className={styles["children-wrapper"]}>
          <td>{makeProductInformation(item)}</td>
          <td>{makeNormalText(item?.goodsDescription, true)}</td>
          <td>{makeNormalText(item?.goodsServiceUnit?.name)}</td>
          <td>
            {makeSectionRow(
              [
                item?.investmentBeforeTax,
                item?.investmentTax,
                item?.investmentSum,
              ],
              false
            )}
          </td>
          <td>
            {makeSectionRow(
              [
                item?.settlementBeforeTax,
                item?.settlementTax,
                item?.settlementSum,
              ],
              false
            )}
          </td>
          <td>{makeSpecialText(item?.differenceValue)}</td>
          <td>{makeNormalText(item?.goodsManufacturer)}</td>
          <td>{makeNormalText(item?.goodsNote, true)}</td>
        </tr>
      );
    });
  };

  return (
    <>
      {data?.map((row, index) => {
        return (
          <Fragment key={index}>
            {/* Parent View */}
            {makeParentRow(row)}
            {/* Children */}
            {makeChildRow(row?.items, row?.category?.id)}
          </Fragment>
        );
      })}
    </>
  );
};
