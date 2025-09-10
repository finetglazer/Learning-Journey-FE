import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import classNames from "classnames";
import AssetEmpty from "components/EmptyTable/AssetEmpty";
import { numberConstants } from "core/config/consts";
import { formatCurrency } from "core/helpers/currency";
import { gt, isEmpty, isEqual, isNil, isNull } from "lodash";
import { Goods } from "models/ProjectSettlement";
import { useProjectSettlementViewContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementView/context";
import styles from "../../GoodsServices.module.scss";
import { DrawerInformation } from "../Drawer/DrawerInformation";
import { CollapseRow } from "./CollapseRow";
import { ModelData } from "./Model";

const groupDataByCategory = (data: Goods[]): ModelData[] => {
  const grouped = data?.reduce(
    (accumulator: Record<string, ModelData>, item: Goods) => {
      const categoryId = item.goodsServicesCategory?.id;
      const categoryName = item.goodsServicesCategory?.name;
      const categoryCode = item.goodsServicesCategory?.code;

      if (!categoryId) return accumulator;

      // If category already exists, push the item
      if (accumulator[categoryId]) {
        accumulator[categoryId].items?.push(item);
      } else {
        // Create a new category group
        accumulator[categoryId] = {
          category: {
            id: categoryId,
            name: categoryName,
            code: categoryCode,
          },
          items: [item],
        };
      }

      return accumulator;
    },
    {}
  );

  if (isNil(grouped)) return [];

  // Convert the grouped object to an array
  return Object.values(grouped);
};

const Title = () => {
  const [translate] = useTranslation();

  const makeTitle = (value: string | ReactElement, style: string) => {
    return (
      <th className={classNames(styles["title"], styles[style])}>{value}</th>
    );
  };

  const makeSecondsTitle = (titleKey: string) => {
    return (
      <th className={styles["title2"]}>
        <div className={styles["text"]}>{translate(titleKey)}</div>
        <div className={styles["second-title"]}>
          <div className={styles["first"]}>
            <UnitTitle
              title={translate("PS.table_asset_value_before_tax")}
              className="align-items-end"
            />
          </div>
          <div className={styles["seconds"]}>
            <UnitTitle
              title={translate("PS.table_asset_tax")}
              className="align-items-end"
            />
          </div>
          <div className={styles["last"]}>
            <UnitTitle
              title={translate("PS.table_asset_sum")}
              className="align-items-end"
            />
          </div>
        </div>
      </th>
    );
  };

  return (
    <thead>
      <tr>
        {makeTitle(translate("PS.table_asset_good_service"), "w_240")}
        {makeTitle(
          translate("PS.table_asset_description_good_service"),
          "w_240"
        )}
        {makeTitle(translate("PS.table_asset_unit"), "w_100")}

        {makeSecondsTitle("PS.table_asset_investment_value")}

        {makeSecondsTitle("PS.table_asset_settlement_value")}

        {makeTitle(
          <UnitTitle
            title={translate("PS.table_asset_difference_value")}
            className="align-items-end"
          />,
          "w_145"
        )}
        {makeTitle(translate("PS.table_asset_manufacturer"), "w_140")}
        {makeTitle(translate("PS.table_asset_note"), "w_200")}
      </tr>
    </thead>
  );
};

const Body = ({
  data,
  onRowClick,
}: {
  data: ModelData[];
  onRowClick: (item: Goods) => void;
}) => {
  const [translate] = useTranslation();

  const calculateTotals = () => {
    return data.reduce(
      (totals, category) => {
        category.items.forEach((item) => {
          totals.totalInvestmentBeforeTax += item.investmentBeforeTax;
          totals.totalInvestmentTax += item.investmentTax;
          totals.totalInvestmentSum += item.investmentSum;

          totals.totalSettlementBeforeTax += item.settlementBeforeTax;
          totals.totalSettlementTax += item.settlementTax;
          totals.totalSettlementSum += item.settlementSum;

          totals.totalDifferenceValue += item.differenceValue;
        });
        return totals;
      },
      {
        totalInvestmentBeforeTax: numberConstants.ZERO,
        totalInvestmentTax: numberConstants.ZERO,
        totalInvestmentSum: numberConstants.ZERO,
        totalSettlementBeforeTax: numberConstants.ZERO,
        totalSettlementTax: numberConstants.ZERO,
        totalSettlementSum: numberConstants.ZERO,
        totalDifferenceValue: numberConstants.ZERO,
      }
    );
  };

  const makeSumRow = () => {
    const {
      totalInvestmentBeforeTax,
      totalInvestmentTax,
      totalInvestmentSum,
      totalSettlementBeforeTax,
      totalSettlementTax,
      totalSettlementSum,
      totalDifferenceValue,
    } = calculateTotals();

    return (
      <tr className={styles["sum-wrapper"]}>
        <td>
          <div className={styles["text"]}>{translate("PS.txt_sum")}</div>
        </td>
        <td />
        <td />
        <td>
          {makeSectionRow([
            totalInvestmentBeforeTax,
            totalInvestmentTax,
            totalInvestmentSum,
          ])}
        </td>
        <td>
          {makeSectionRow([
            totalSettlementBeforeTax,
            totalSettlementTax,
            totalSettlementSum,
          ])}
        </td>
        <td>{makeSpecialText(totalDifferenceValue)}</td>
        <td />
        <td />
        <td />
        <td />
      </tr>
    );
  };

  const makeTextBold = (value: number) => {
    return <div className={styles["text-bold"]}>{formatCurrency(value)}</div>;
  };

  const makeSectionRow = (values: number[]) => {
    return (
      <div className={styles["section"]}>
        {values.map((value, index) => (
          <div className={styles["first"]} key={index}>
            {makeTextBold(value)}
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
      ? `+${formatCurrency(value)}`
      : formatCurrency(value);

    return (
      <div className={`${styles.number} ${className}`}>{displayValue}</div>
    );
  };

  return (
    <tbody>
      {/* Sum */}
      {makeSumRow()}
      <CollapseRow data={data} onRowClick={onRowClick} />
    </tbody>
  );
};

interface TableState {
  itemSelected: Goods | null;
}

export const Table = () => {
  const { model } = useProjectSettlementViewContext();
  const [state, setState] = useState<TableState>({ itemSelected: null });

  const data: ModelData[] = useMemo(
    () => groupDataByCategory(model?.projectSettlementGoodsItems),
    [model]
  );

  if (isEmpty(data)) {
    return <AssetEmpty />;
  }

  const onRowClick = (item: Goods) => {
    setState({ ...state, itemSelected: item });
  };

  const onDismissDrawer = () => setState({ ...state, itemSelected: null });

  return (
    <>
      <div className={styles["table-data"]}>
        <div className={styles["wrapper"]}>
          <table>
            <Title />
            <Body data={data} onRowClick={onRowClick} />
          </table>
        </div>
      </div>

      {/* Drawer */}
      <DrawerInformation
        visible={!isNull(state?.itemSelected)}
        item={state?.itemSelected}
        onDismiss={onDismissDrawer}
      />
    </>
  );
};
