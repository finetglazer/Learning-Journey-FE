import { useDebounceFn } from "ahooks";
import type { TableColumnsType } from "antd";
import classNames from "classnames";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import ValueComparison from "components/ValueComparison/ValueComparison";
import { MAX_LENGTH_500 } from "core/config/consts";
import { sumWithFixed } from "core/helpers/calculator";
import { formatNumber } from "core/helpers/number";
import { trimText } from "core/helpers/text";
import { utilService } from "core/services/common-services/util-service";
import { isEqual, isNil, isUndefined } from "lodash";
import { InvestmentCosts } from "models/ProjectSettlement";
import styles from "pages/PurchasePage/ProjectSettlement/Components/SettlementInformationComponents.module.scss";
import { ProjectSettlementDetailType } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/context";
import { useCallback, useMemo } from "react";
import { Model } from "react-3layer-common";
import {
  FormItem,
  InputText,
  LayoutCell,
  OneLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface FinalizedInvestmentCostsProps
  extends Pick<ProjectSettlementDetailType, "handleChangeSingleField"> {
  data: InvestmentCosts[];
  errors?: Model.Errors<Model>;
  isView?: boolean;
}

function FinalizedInvestmentCosts({
  data,
  errors,
  isView,
  handleChangeSingleField,
}: FinalizedInvestmentCostsProps) {
  const [translate] = useTranslation();

  const handleCheckRowTotal = useCallback(
    (note: string | null | undefined) => isUndefined(note),
    []
  );

  const list = useMemo(() => {
    if (isNil(data)) return [];

    const total = data?.reduce(
      (acc, item) => ({
        ...acc,
        investmentBeforeTax: sumWithFixed([
          item?.investmentBeforeTax,
          acc.investmentBeforeTax,
        ]),
        investmentTax: sumWithFixed([item?.investmentTax, acc.investmentTax]),
        investmentSum: sumWithFixed([item?.investmentSum, acc.investmentSum]),
        settlementBeforeTax: sumWithFixed([
          item?.settlementBeforeTax,
          acc.settlementBeforeTax,
        ]),
        settlementTax: sumWithFixed([item?.settlementTax, acc.settlementTax]),
        settlementSum: sumWithFixed([item?.settlementSum, acc.settlementSum]),
        differenceValue: sumWithFixed([
          item?.differenceValue,
          acc.differenceValue,
        ]),
      }),
      {
        content: translate("CT.total"),
        investmentBeforeTax: 0,
        investmentTax: 0,
        investmentSum: 0,
        settlementBeforeTax: 0,
        settlementTax: 0,
        settlementSum: 0,
        differenceValue: 0,
      }
    );
    return [total, ...data];
  }, [data, translate]);

  const { run: handleChangeNote } = useDebounceFn(
    ({ note, indexChanged }: { note: string | null; indexChanged: number }) => {
      const trimmedText = trimText(note);
      const investmentCosts = data?.map((investmentCosts, index) => {
        if (isEqual(index, indexChanged)) {
          return {
            ...investmentCosts,
            note: trimmedText,
          };
        }
        return investmentCosts;
      });
      handleChangeSingleField({ fieldName: "investmentCosts" })(
        investmentCosts
      );
    },
    {
      wait: 300,
    }
  );

  const columns: TableColumnsType<InvestmentCosts> = useMemo(
    () => [
      {
        key: "content",
        dataIndex: "content",
        width: 200,
        render(value: string) {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PS.txt_table_investment_value"),
        width: 435,
        children: [
          {
            title: (
              <UnitTitle title={translate("PS.txt_table_pre_tax_value")} />
            ),
            key: "investmentBeforeTax",
            dataIndex: "investmentBeforeTax",
            width: 145,
            align: "right",
            render(value: number) {
              return (
                <LayoutCell position="right">
                  <OneLineText value={formatNumber(value)} />
                </LayoutCell>
              );
            },
          },
          {
            title: <UnitTitle title={translate("PR.tax")} />,
            key: "investmentTax",
            dataIndex: "investmentTax",
            width: 145,
            align: "right",
            render(value: number) {
              return (
                <LayoutCell position="right">
                  <OneLineText value={formatNumber(value)} />
                </LayoutCell>
              );
            },
          },
          {
            title: (
              <UnitTitle
                title={translate("PM.payment_table_voucher_total_amount_label")}
              />
            ),
            key: "investmentSum",
            dataIndex: "investmentSum",
            width: 145,
            align: "right",
            render(value: number) {
              return (
                <LayoutCell position="right">
                  <OneLineText value={formatNumber(value)} />
                </LayoutCell>
              );
            },
          },
        ],
      },
      {
        title: translate("PS.txt_table_settlement_value"),
        key: "",
        dataIndex: "",
        width: 435,
        children: [
          {
            title: (
              <UnitTitle title={translate("PS.txt_table_pre_tax_value")} />
            ),
            key: "settlementBeforeTax",
            dataIndex: "settlementBeforeTax",
            width: 145,
            align: "right",
            render(value: number) {
              return (
                <LayoutCell position="right">
                  <OneLineText value={formatNumber(value)} />
                </LayoutCell>
              );
            },
          },
          {
            title: <UnitTitle title={translate("PR.tax")} />,
            key: "settlementTax",
            dataIndex: "settlementTax",
            width: 145,
            align: "right",
            render(value: number) {
              return (
                <LayoutCell position="right">
                  <OneLineText value={formatNumber(value)} />
                </LayoutCell>
              );
            },
          },
          {
            title: (
              <UnitTitle
                title={translate("PM.payment_table_voucher_total_amount_label")}
              />
            ),
            key: "settlementSum",
            dataIndex: "settlementSum",
            width: 145,
            align: "right",
            render(value: number) {
              return (
                <LayoutCell position="right">
                  <OneLineText value={formatNumber(value)} />
                </LayoutCell>
              );
            },
          },
        ],
      },
      {
        title: <UnitTitle title={translate("PP.difference")} />,
        key: "differenceValue",
        dataIndex: "differenceValue",
        width: 165,
        align: "right",
        render(value: number) {
          return (
            <LayoutCell position="right">
              <ValueComparison value={value} isShowSigns />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.txt_notes"),
        key: "note",
        dataIndex: "note",
        width: 200,
        render(value: string | undefined | null, _, index) {
          const isTotal = handleCheckRowTotal(value);

          if (isTotal) {
            return null;
          }

          if (isView) {
            return (
              <LayoutCell>
                <OneLineText value={value} />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  { errors },
                  `investmentCosts.[${index - 1}].note`
                )}
                isTableCell
              >
                <InputText
                  placeHolder={translate("CT.input_note")}
                  translate={translate}
                  maxLength={MAX_LENGTH_500}
                  onChange={(value) =>
                    handleChangeNote({ indexChanged: index - 1, note: value })
                  }
                  value={value}
                  isTableCell
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
    ],
    [errors, handleChangeNote, handleCheckRowTotal, translate, isView]
  );

  return (
    <TableWithEmpty
      list={list}
      columns={columns}
      className={classNames(
        styles["custom-table"],
        styles["total--border-secondary"]
      )}
      bordered
    />
  );
}

export default FinalizedInvestmentCosts;
