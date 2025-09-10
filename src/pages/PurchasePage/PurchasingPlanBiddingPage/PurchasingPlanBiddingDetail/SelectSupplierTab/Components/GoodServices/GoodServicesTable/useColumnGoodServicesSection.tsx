import React, { useCallback, useMemo } from "react";
import { ColumnProps } from "antd/lib/table";
import { GoodServiceByCategory } from "models/PurchaseRequest";
import {
  LayoutCell,
  OneLineText,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ColumnKey, PurchasingPlanTypeModel } from "models/PurchasingPlan";
import { Tooltip } from "antd";
import { ErrorTab } from "assets/icons";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { isNil } from "lodash";
import { formatCurrency, formatNumber } from "core/helpers/number";
import { ConfigField, FieldValue } from "core/services/service-types";
import styles from "./GoodServicesTable.module.scss";
import { sumWithFixed } from "core/helpers/calculator";
import { convertData } from "./Helper";

type Props = {
  model: PurchasingPlanTypeModel;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (data?: FieldValue) => void;
  handleChangeAllField?: (value: PurchasingPlanTypeModel) => void;
  data?: any[];
  handleOpenDrawer?: () => void;
  isDetail?: boolean;
};

const useColumnGoodServicesSection = ({
  model,
  handleChangeAllField,
  handleChangeSingleField,
  data,
  handleOpenDrawer,
  isDetail = false,
}: Props) => {
  const [translate] = useTranslation();
  enum TableWidth {
    currencyUnit = 110,
    amount = 120,
    tax = 130,
    goodUnit = 140,
    totalQuantity = 150,
    supplier = 160,
    branchType = 182,
    note = 200,
    description = 220,
    name = 240,
  }

  const convertDataByCategory = useMemo(() => {
    if (data?.length > 0) {
      return convertData(data ?? []);
    }
    return [];
  }, [data]);

  const totalItemData = sumWithFixed(
    convertDataByCategory?.map((el) => el.children.length)
  );

  const sumTotalDataByFieldName = useCallback(
    (fieldName = ColumnKey.CONVERT_TOTAL_AMOUNT) => {
      const result = sumWithFixed(
        convertDataByCategory?.map((el) =>
          sumWithFixed(el.children?.map((el2) => el2?.[fieldName]))
        )
      );
      return result;
    },
    [convertDataByCategory]
  );

  const currency = useMemo(() => {
    const exchangeRate = model?.selectSupplier?.exchangeRates?.[0];
    return exchangeRate?.currency;
  }, [model?.selectSupplier?.exchangeRates]);

  const columns: ColumnProps<GoodServiceByCategory>[] = React.useMemo(() => {
    const dataColumn: ColumnProps<GoodServiceByCategory>[] = [
      {
        title: () => (
          <div className={"p-l--xl"}>
            {translate("PL.purchasing_plan_goods_services")}
          </div>
        ),
        ellipsis: true,
        width: TableWidth.name,
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (record?.isTotal) {
            return (
              <LayoutCell className="m-l--sm">
                <OneLineText
                  useTooltip
                  className="fw-semibold quotation-good-services__total-text"
                  value={translate("PR.size_type_goods_services", {
                    size: totalItemData,
                  })}
                />
              </LayoutCell>
            );
          }

          if (record?.children) {
            return (
              <LayoutCell className={styles["data-with-collapse"]}>
                <OneLineText
                  className="text_blue fw-semibold"
                  value={record?.goodsServicesCategoryName}
                  useTooltip
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell className={styles["data-with-collapse"]}>
              <div
                className="text-ellipsis"
                onClick={() => {
                  handleChangeSingleField({
                    fieldName: "currentSelectSupplier",
                  })(record);
                  handleOpenDrawer();
                }}
              >
                <TwoLineText
                  classNameFirstLine="text-table-link fw-semibold"
                  classNameSecondLine="text-second__style"
                  valueLine1={record?.name}
                  valueLine2={record?.code}
                  useTooltip
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div>{translate("PL.principle.title.description_goods")}</div>
        ),
        width: TableWidth.description,
        ellipsis: true,
        render: (_: unknown, record: GoodServiceByCategory) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.description} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => <div>{translate("PL.purchasing_plan_unit")}</div>,
        ellipsis: true,
        width: TableWidth.amount,
        render: (_: unknown, record: GoodServiceByCategory) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.unit?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => <div>{translate("PL.drawer_quantity")}</div>,
        ellipsis: true,
        width: TableWidth.amount,
        key: ColumnKey.QUANTITY,
        dataIndex: ColumnKey.QUANTITY,
        render: (value: string) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={formatNumber(value)} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="vertical_baseline text-right">
            <UnitTitle
              className="text-right"
              title={translate("PL.unit_price_label")}
              unit={currency}
            />
          </div>
        ),
        ellipsis: true,
        width: TableWidth.note,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (!record || record?.children || record?.isTotal) return null;

          return (
            <LayoutCell position="right">
              <OneLineText
                key={`${record?.unitPrice}-${record.id}`}
                value={formatCurrency({
                  value: record?.unitPrice,
                  shouldRoundTwoNumber: false,
                  code: currency,
                })}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="vertical_baseline text-right">
            <UnitTitle
              className="text-right"
              title={translate("PL.amount_label")}
              unit={currency}
            />
          </div>
        ),
        ellipsis: true,
        key: ColumnKey.TOTAL_AMOUNT_BEFORE_TAX,
        dataIndex: ColumnKey.TOTAL_AMOUNT_BEFORE_TAX,
        width: TableWidth.note,
        render: (value, record: GoodServiceByCategory) => {
          if (!record) return null;

          if (record?.goodsServicesCategoryId) {
            const valueSum = sumWithFixed(
              record?.children?.map(
                (el) => el?.[ColumnKey.TOTAL_AMOUNT_BEFORE_TAX]
              )
            );

            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(valueSum)
                      ? formatCurrency({
                          value: valueSum,
                          shouldRoundTwoNumber: false,
                          code: currency,
                        })
                      : ""
                  }
                  useTooltip
                />
              </LayoutCell>
            );
          }

          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(
                      sumTotalDataByFieldName(ColumnKey.TOTAL_AMOUNT_BEFORE_TAX)
                    )
                      ? formatCurrency({
                          value: sumTotalDataByFieldName(
                            ColumnKey.TOTAL_AMOUNT_BEFORE_TAX
                          ),
                          shouldRoundTwoNumber: false,
                          code: currency,
                        })
                      : ""
                  }
                  useTooltip
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.[ColumnKey.TOTAL_AMOUNT_BEFORE_TAX],
                  shouldRoundTwoNumber: false,
                  code: currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => translate("PL.tax_type_label"),
        ellipsis: true,
        width: TableWidth.tax,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (!record || record?.children || record?.isTotal) return null;

          return (
            <LayoutCell key={`${record?.id}`}>
              <OneLineText
                key={`${record.tax?.id}-${record.id}`}
                value={`${record.tax?.name ? record.tax.name : ""}`}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="vertical_baseline text-right">
            <UnitTitle
              className="text-right"
              title={translate("PL.tax_label")}
              unit={currency}
            />
          </div>
        ),
        ellipsis: true,
        key: ColumnKey.TAX_AMOUNT,
        dataIndex: ColumnKey.TAX_AMOUNT,
        width: TableWidth.note,
        render: (value, record: GoodServiceByCategory) => {
          if (!record) return null;

          if (record?.goodsServicesCategoryId) {
            const valueSum = sumWithFixed(
              record?.children?.map((el) => el?.[ColumnKey.TAX_AMOUNT])
            );

            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(valueSum)
                      ? formatCurrency({
                          value: valueSum,
                          shouldRoundTwoNumber: false,
                          code: currency,
                        })
                      : ""
                  }
                  useTooltip
                />
              </LayoutCell>
            );
          }

          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(sumTotalDataByFieldName(ColumnKey.TAX_AMOUNT))
                      ? formatCurrency({
                          value: sumTotalDataByFieldName(ColumnKey.TAX_AMOUNT),
                          shouldRoundTwoNumber: false,
                          code: currency,
                        })
                      : ""
                  }
                  useTooltip
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.[ColumnKey.TAX_AMOUNT],
                  shouldRoundTwoNumber: false,
                  code: currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="vertical_baseline text-right">
            <UnitTitle
              className="text-right"
              title={translate("PL.total_amount_label")}
              unit={currency}
            />
          </div>
        ),
        ellipsis: true,
        width: TableWidth.note,
        key: ColumnKey.TOTAL_AMOUNT,
        dataIndex: ColumnKey.TOTAL_AMOUNT,
        render: (value, record: GoodServiceByCategory) => {
          if (!record) return null;

          if (record?.goodsServicesCategoryId) {
            const valueSum = sumWithFixed(
              record?.children?.map((el) => el?.[ColumnKey.TOTAL_AMOUNT])
            );

            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(valueSum)
                      ? formatCurrency({
                          value: valueSum,
                          shouldRoundTwoNumber: false,
                          code: currency,
                        })
                      : ""
                  }
                  useTooltip
                />
              </LayoutCell>
            );
          }

          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(sumTotalDataByFieldName(ColumnKey.TOTAL_AMOUNT))
                      ? formatCurrency({
                          value: sumTotalDataByFieldName(
                            ColumnKey.TOTAL_AMOUNT
                          ),
                          shouldRoundTwoNumber: false,
                          code: currency,
                        })
                      : ""
                  }
                  useTooltip
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.[ColumnKey.TOTAL_AMOUNT],
                  shouldRoundTwoNumber: false,
                  code: currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="vertical_baseline text-right">
            <UnitTitle
              className="text-right"
              title={translate("PL.drawer_exchange_total")}
              unit={"VND"}
            />
          </div>
        ),
        ellipsis: true,
        width: TableWidth.note,
        key: ColumnKey.CONVERT_TOTAL_AMOUNT,
        dataIndex: ColumnKey.CONVERT_TOTAL_AMOUNT,
        render: (value, record: GoodServiceByCategory) => {
          if (!record) return null;

          if (record?.goodsServicesCategoryId) {
            const valueSum = sumWithFixed(
              record?.children?.map(
                (el) => el?.[ColumnKey.CONVERT_TOTAL_AMOUNT]
              )
            );

            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(valueSum)
                      ? formatCurrency({
                          value: valueSum,
                          shouldRoundTwoNumber: false,
                          code: currency,
                        })
                      : ""
                  }
                  useTooltip
                />
              </LayoutCell>
            );
          }

          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(
                      sumTotalDataByFieldName(ColumnKey.CONVERT_TOTAL_AMOUNT)
                    )
                      ? formatCurrency({
                          value: sumTotalDataByFieldName(
                            ColumnKey.CONVERT_TOTAL_AMOUNT
                          ),
                          shouldRoundTwoNumber: false,
                          code: currency,
                        })
                      : ""
                  }
                  useTooltip
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.[ColumnKey.CONVERT_TOTAL_AMOUNT],
                  shouldRoundTwoNumber: false,
                  code: currency,
                })}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div>
            {translate("PL.select_supplier.table.branch_type_required")}
          </div>
        ),
        ellipsis: true,
        width: TableWidth.note,
        render: (_: unknown, record: GoodServiceByCategory) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.branch?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div>{translate("PL.select_supplier.table.note_required")}</div>
        ),
        ellipsis: true,
        width: TableWidth.note,
        render: (_: unknown, record: GoodServiceByCategory) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.note} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => <div>{translate("PL.drawer_quotation_notes_table")}</div>,
        ellipsis: true,
        width: TableWidth.note,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (!record) return null;

          return (
            <LayoutCell position="left">
              <OneLineText value={record?.quotationNote} useTooltip />
            </LayoutCell>
          );
        },
      },
    ];

    const errorColumn: ColumnProps<GoodServiceByCategory> = {
      title: "",
      dataIndex: "",
      key: "",
      width: 40,
      render: (_: unknown, record: GoodServiceByCategory) => {
        if (record?.children?.length > 0 || !model || !model.errors) {
          return "";
        }
        const indexRecord = model.purchaseItems?.findIndex(
          (el) => el.id === record.id
        );

        let error = "";
        if (indexRecord >= 0) {
          if (model.errors[`goodsItems[${indexRecord}]`]) {
            error += `${model.errors[`goodsItems[${indexRecord}]`]}\n`;
          }

          if (model.errors[`goodsItems[${indexRecord}].quantity`]) {
            error += `${model.errors[`goodsItems[${indexRecord}].quantity`]}\n`;
          }
        }

        const isHaveError =
          model.errors[`goodsItems[${indexRecord}]`] ||
          model.errors[`goodsItems[${indexRecord}].quantity`];

        if (isHaveError)
          return (
            <LayoutCell>
              <Tooltip
                placement="right"
                title={error}
                rootClassName="text-break-line"
              >
                <div className="error-tab">
                  <ErrorTab />
                </div>
              </Tooltip>
            </LayoutCell>
          );
      },
    };

    if (
      model?.errors &&
      Object.keys(model.errors).some((el) => el.includes("goodsItems"))
    ) {
      dataColumn.unshift(errorColumn);
    }
    return dataColumn.filter(Boolean);
  }, [
    TableWidth.name,
    TableWidth.description,
    TableWidth.amount,
    TableWidth.note,
    TableWidth.tax,
    model,
    translate,
    totalItemData,
    handleChangeSingleField,
    handleOpenDrawer,
    currency,
    sumTotalDataByFieldName,
  ]);
  return { columns };
};

export default useColumnGoodServicesSection;
