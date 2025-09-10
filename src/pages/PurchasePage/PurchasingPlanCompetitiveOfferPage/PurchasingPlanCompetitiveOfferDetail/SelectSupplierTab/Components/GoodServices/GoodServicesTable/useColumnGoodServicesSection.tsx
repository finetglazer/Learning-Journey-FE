import React, { useCallback, useMemo } from "react";
import { ColumnProps } from "antd/lib/table";
import { GoodServiceByCategory } from "models/PurchaseRequest";
import {
  FormItem,
  InputNumber,
  LayoutCell,
  OneLineText,
  TwoLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  ColumnKey,
  GoodsPrice,
  PurchasePlanGoodsServicesModel,
  PurchasingPlanTypeModel,
} from "models/PurchasingPlan";
import { Tooltip } from "antd";
import { ErrorTab } from "assets/icons";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { isNil, round } from "lodash";
import { formatCurrency, formatNumber } from "core/helpers/number";
import {
  JPY_CURRENCY_UNIT,
  NUMBER_TYPE_INPUT,
  USD_CURRENCY_UNIT,
  VND_CURRENCY_UNIT,
} from "core/config/consts";
import { ConfigField, FieldValue } from "core/services/service-types";
import styles from "./GoodServicesTable.module.scss";
import CONSTANT_NUMBER from "config/number";
import { sumWithFixed } from "core/helpers/calculator";
import { convertData } from "./Helper";
import { IExchangeRateTable } from "models/PurchasingPlan/PurchasingPlanCompetitiveOffer";
import { utilService } from "core/services/common-services/util-service";

type Props = {
  model: PurchasingPlanTypeModel;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (data?: FieldValue) => void;
  handleChangeAllField?: (value: PurchasingPlanTypeModel) => void;
  isHaveSupplier?: boolean;
  data?: any[];
};
interface changeItemProps {
  fieldName: string;
  value: FieldValue;
  objectFieldChangeFollow: object;
  id: string;
  indexBeforeValidate?: number;
  index2?: number;
  nameError?: string;
}

const useColumnGoodServicesSection = ({
  model,
  handleChangeAllField,
  isHaveSupplier = false,
  data,
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

  const totalConvertAmountData = sumWithFixed(
    convertDataByCategory?.map((el) =>
      sumWithFixed(
        el.children?.map((el2) => {
          if (el2?.goodsItems) {
            return sumWithFixed(
              el2.goodsItems?.map((el3) => el3.totalConvertedAmount),
              CONSTANT_NUMBER.ZERO_FIX_NUMBER
            );
          }

          return el2.totalConvertedAmount;
        }),
        CONSTANT_NUMBER.ZERO_FIX_NUMBER
      )
    )
  );

  const currencyShow = useMemo(() => {
    let dataGoodItems = data;
    let firstCurrency = data?.[0]?.currency;

    if (!firstCurrency) {
      dataGoodItems = data
        ?.map((item: PurchasePlanGoodsServicesModel) => item?.goodsItems)
        ?.flat();
      firstCurrency = dataGoodItems?.[0]?.currency;
    }

    const isSameCurrency = dataGoodItems
      ?.map((item: GoodsPrice) => item?.currency)
      ?.every((item: string) => item === firstCurrency);

    if (isSameCurrency) {
      return firstCurrency;
    }

    return USD_CURRENCY_UNIT;
  }, [data]);

  const checkIsSameVNDOrJPY = (currency: string) => {
    return currency === VND_CURRENCY_UNIT || currency === JPY_CURRENCY_UNIT;
  };

  const handleChangeItemTable = useCallback(
    (props: changeItemProps) => {
      const {
        fieldName,
        value,
        id,
        indexBeforeValidate,
        nameError,
        index2,
        objectFieldChangeFollow,
      } = props;

      const checkModelIsExist =
        model?.selectSupplier?.supplierGoodsItems?.length > 0;
      if (!checkModelIsExist) return;
      const editSelectedGoods = [
        ...model.selectSupplier.supplierGoodsItems,
      ].map((item: GoodServiceByCategory, index) => {
        if (!item) return null;
        if (
          indexBeforeValidate > -1 &&
          index2 > -1 &&
          item?.goodsItems[index2] &&
          item.goodsItems?.[0]?.id === id
        ) {
          const newGoodsItems = {
            ...item.goodsItems[index2],
            [fieldName]: value,
            ...objectFieldChangeFollow,
          };

          const cloneGoodItems = [...item.goodsItems];
          cloneGoodItems.splice(index2, 1, newGoodsItems);

          const data = {
            ...item,
            goodsItems: cloneGoodItems,
          };

          return data;
        }
        return item;
      });

      handleChangeAllField({
        ...model,
        selectSupplier: {
          ...model.selectSupplier,
          supplierGoodsItems: editSelectedGoods,
        },
      });
    },
    [handleChangeAllField, model]
  );

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
              <TwoLineText
                classNameFirstLine="text_blue fw-semibold"
                classNameSecondLine="text-second__style"
                valueLine1={record?.name}
                valueLine2={record?.code}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div>{translate("PL.principle.title.description_goods")}</div>
        ),
        width: TableWidth.name,
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
        width: TableWidth.goodUnit,
        render: (_: unknown, record: GoodServiceByCategory) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.unit?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      isHaveSupplier && {
        title: () => (
          <div>
            {translate("PL.select_supplier.table.branch_type_required")}
          </div>
        ),
        ellipsis: true,
        width: TableWidth.branchType,
        render: (_: unknown, record: GoodServiceByCategory) => {
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.branch?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      isHaveSupplier && {
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
      isHaveSupplier && {
        title: () => (
          <div>{translate("PL.select_supplier.table.total_buy")}</div>
        ),
        ellipsis: true,
        width: TableWidth.note,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (!record || record?.children || record?.isTotal) return null;

          return (
            <LayoutCell position="left">
              <OneLineText value={formatNumber(record?.quantity)} useTooltip />
            </LayoutCell>
          );
        },
      },
      isHaveSupplier && {
        title: () => (
          <UnitTitle
            title={translate("PL.purchasing_plan_supplier_tab")}
            unit={translate(
              "PL.select_supplier.exchange_rate.abbreviation_supplier"
            )}
          />
        ),
        ellipsis: true,
        width: TableWidth.note,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (record.goodsItems?.length > 0) {
            return (
              <LayoutCell position="left" className={styles["layout-cell"]}>
                {record.goodsItems.map(
                  (item: GoodServiceByCategory, index2: number) => {
                    return (
                      <div
                        className={styles["layout-cell-wrap"]}
                        key={`${item.id}-${index2}`}
                      >
                        <UnitTitle
                          isEllipsis={true}
                          key={`${item.supplier?.id}-${index2}`}
                          title={item.supplier?.name}
                          unit={item.supplier?.shortName}
                        />
                      </div>
                    );
                  }
                )}
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="left" className={styles["layout-cell"]}>
              {record?.supplierSuppliedGoods?.length > 0
                ? record.supplierSuppliedGoods.map((item, index2) => {
                    return (
                      <UnitTitle
                        key={`${item.supplier?.id}-${index2}`}
                        title={item.supplier?.name}
                        unit={item.supplier?.shortName}
                      />
                    );
                  })
                : ""}
            </LayoutCell>
          );
        },
      },
      isHaveSupplier && {
        title: () => (
          <div>{translate("PL.select_supplier.table.branch_type_BG")}</div>
        ),
        ellipsis: true,
        width: TableWidth.supplier,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (record.goodsItems?.length > 0) {
            return (
              <LayoutCell position="left" className={styles["layout-cell"]}>
                {record.goodsItems.map(
                  (item: GoodServiceByCategory, index2: number) => {
                    return (
                      <div
                        className={styles["layout-cell-wrap"]}
                        key={`${item.id}-${index2}`}
                      >
                        <OneLineText
                          key={`${item.quoteBranch?.name}-${index2}`}
                          value={item.quoteBranch?.name}
                          useTooltip
                        />
                      </div>
                    );
                  }
                )}
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="left">
              <OneLineText value={record?.quoteBranch?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      isHaveSupplier && {
        title: () => (
          <div>{translate("PL.select_supplier.table.note_required_BG")}</div>
        ),
        ellipsis: true,
        width: TableWidth.note,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (record.goodsItems?.length > 0) {
            return (
              <LayoutCell position="left" className={styles["layout-cell"]}>
                {record.goodsItems.map(
                  (item: GoodServiceByCategory, index2: number) => {
                    return (
                      <>
                        <div
                          className={styles["layout-cell-wrap"]}
                          key={`${item?.id}-${index2}`}
                        >
                          <OneLineText
                            key={`${item?.quoteNote}-${item.id}`}
                            value={item?.quoteNote}
                            useTooltip
                          />
                        </div>
                      </>
                    );
                  }
                )}
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="left">
              <OneLineText value={record?.quoteNote} useTooltip />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div>
            {isHaveSupplier
              ? translate("PL.supply_quantity_label")
              : translate("PL.drawer_quantity")}
          </div>
        ),
        ellipsis: true,
        width: TableWidth.totalQuantity,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (record.goodsItems?.length > 0) {
            return (
              <LayoutCell position="left" className={styles["layout-cell"]}>
                {record.goodsItems.map(
                  (item: GoodServiceByCategory, index2: number) => {
                    return (
                      <div
                        className={styles["layout-cell-wrap"]}
                        key={`${item?.id}-${index2}`}
                      >
                        <OneLineText
                          key={`${item?.supplyQuantity}-${item.id}`}
                          value={formatNumber(item?.supplyQuantity)}
                          useTooltip
                        />
                      </div>
                    );
                  }
                )}
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="left">
              <OneLineText
                value={formatNumber(record?.buyQuantity)}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      isHaveSupplier && {
        title: () => (
          <div>
            {translate("PL.purchase_quantity_label")}
            <span className="required"> *</span>
          </div>
        ),
        ellipsis: true,
        width: TableWidth.note,
        key: ColumnKey.QUANTITY,
        render: (_: unknown, record: GoodServiceByCategory, index) => {
          if (record.goodsItems?.length > 0) {
            return (
              <LayoutCell position="left" className={styles["layout-cell"]}>
                {record.goodsItems.map(
                  (item: GoodServiceByCategory, index2: number) => {
                    const indexBuyQuantity =
                      model.selectSupplier.supplierGoodsItems
                        ?.map((el: GoodsPrice) => el.goodsItems)
                        ?.flat()
                        ?.findIndex((el: GoodsPrice) => el.id === item.id);

                    return (
                      <div
                        className={styles["layout-cell-wrap"]}
                        key={`${item?.id}-${index2}`}
                      >
                        <FormItem
                          validateObject={utilService.getValidateObj(
                            model,
                            `supplierSuppliedGoods[${
                              indexBuyQuantity + index2
                            }].buyQuantity`
                          )}
                          isTableCell
                        >
                          <InputNumber
                            key={`${item?.goodsId}-${item.id}-${index2}`}
                            value={item.buyQuantity}
                            numberType={NUMBER_TYPE_INPUT}
                            onChange={(value: number) => {
                              const amountBeforeTax = value
                                ? round(
                                    value * item.unitPrice,
                                    checkIsSameVNDOrJPY(item.currency)
                                      ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                                      : CONSTANT_NUMBER.TWO_NUMBER_FIX
                                  )
                                : 0;

                              const taxAmount = value
                                ? round(
                                    (amountBeforeTax * item.tax?.rate) / 100,
                                    checkIsSameVNDOrJPY(item.currency)
                                      ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                                      : CONSTANT_NUMBER.TWO_NUMBER_FIX
                                  )
                                : 0;

                              const totalAmount =
                                amountBeforeTax +
                                round(
                                  taxAmount,
                                  checkIsSameVNDOrJPY(item.currency)
                                    ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                                    : CONSTANT_NUMBER.TWO_NUMBER_FIX
                                );
                              const exchangeRatesItem = [
                                ...model.selectSupplier.exchangeRates,
                              ].find(
                                (el) => el.supplierId === item.supplier?.id
                              );

                              const exChangeClosingRate =
                                exchangeRatesItem?.currency ===
                                VND_CURRENCY_UNIT
                                  ? 1
                                  : exchangeRatesItem?.closingRate || 0;

                              const convertedAmountBeforeTax = round(
                                round(
                                  amountBeforeTax,
                                  checkIsSameVNDOrJPY(item.currency)
                                    ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                                    : CONSTANT_NUMBER.TWO_NUMBER_FIX
                                ) * exChangeClosingRate,
                                CONSTANT_NUMBER.ZERO_FIX_NUMBER
                              );

                              const totalConvertedAmount = round(
                                round(
                                  totalAmount,
                                  checkIsSameVNDOrJPY(item.currency)
                                    ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                                    : CONSTANT_NUMBER.TWO_NUMBER_FIX
                                ) * exChangeClosingRate,
                                CONSTANT_NUMBER.ZERO_FIX_NUMBER
                              );

                              const taxConvertedAmount = round(
                                round(
                                  taxAmount,
                                  checkIsSameVNDOrJPY(item.currency)
                                    ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                                    : CONSTANT_NUMBER.TWO_NUMBER_FIX
                                ) * exChangeClosingRate,
                                CONSTANT_NUMBER.ZERO_FIX_NUMBER
                              );

                              return handleChangeItemTable({
                                fieldName: ColumnKey.BUY_QUANTITY,
                                value,
                                id: item.id,
                                indexBeforeValidate: index,
                                index2,
                                nameError: ColumnKey.BUY_QUANTITY,
                                objectFieldChangeFollow: {
                                  // unitPrice đang gán item.unitPrice, taxpercent đang gán 10
                                  amountBeforeTax,
                                  convertedAmountBeforeTax,
                                  taxAmount,
                                  totalAmount,
                                  totalConvertedAmount,
                                  taxConvertedAmount,
                                },
                              });
                            }}
                          />
                        </FormItem>
                      </div>
                    );
                  }
                )}
              </LayoutCell>
            );
          }
        },
      },
      {
        title: () => (
          <div className="vertical_baseline text-right">
            {translate("PL.unit_price_label")}
          </div>
        ),
        ellipsis: true,
        width: TableWidth.note,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (!record || record?.children || record?.isTotal) return null;

          if (record.goodsItems?.length > 0) {
            return (
              <LayoutCell position="right" className={styles["layout-cell"]}>
                {record.goodsItems.map(
                  (item: GoodServiceByCategory, index2: number) => {
                    return (
                      <div
                        className={styles["layout-cell-wrap"]}
                        key={`${item?.id}-${index2}`}
                      >
                        <OneLineText
                          key={`${item?.unitPrice}-${item.id}`}
                          value={formatCurrency({
                            value: item?.unitPrice,
                            shouldRoundTwoNumber: false,
                            code: item?.currency,
                          })}
                          useTooltip
                        />
                      </div>
                    );
                  }
                )}
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="right">
              <OneLineText
                key={`${record?.unitPrice}-${record.id}`}
                value={formatCurrency({
                  value: record?.unitPrice,
                  shouldRoundTwoNumber: false,
                  code: record?.currency,
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
            {translate("PL.amount_label")}
          </div>
        ),
        ellipsis: true,
        width: TableWidth.note,
        render: (_: unknown, record: GoodServiceByCategory, index) => {
          if (record.goodsItems?.length > 0) {
            return (
              <LayoutCell position="right" className={styles["layout-cell"]}>
                {record.goodsItems.map(
                  (item: GoodServiceByCategory, index2: number) => {
                    return (
                      <div
                        className={styles["layout-cell-wrap"]}
                        key={`${item?.id}-${index2}`}
                      >
                        <OneLineText
                          key={`${item?.amountBeforeTax}-${item.id}`}
                          value={
                            !isNil(item.amountBeforeTax)
                              ? formatCurrency({
                                  value: item.amountBeforeTax,
                                  shouldRoundTwoNumber: false,
                                  code: item.currency,
                                })
                              : ""
                          }
                          useTooltip
                        />
                      </div>
                    );
                  }
                )}
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatNumber(record.amountBeforeTax)}
                useTooltip
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
          if (record.goodsItems?.length > 0) {
            return (
              <LayoutCell position="left" className={styles["layout-cell"]}>
                {record.goodsItems.map(
                  (item: GoodServiceByCategory, index2: number) => {
                    return (
                      <div
                        className={styles["layout-cell-wrap"]}
                        key={`${item?.id}-${index2}`}
                      >
                        <OneLineText
                          key={`${item.tax?.id}-${item.id}`}
                          value={`${item.tax?.name ? item.tax.name : ""}`}
                          useTooltip
                        />
                      </div>
                    );
                  }
                )}
              </LayoutCell>
            );
          }

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
            {translate("PL.tax_label")}
          </div>
        ),
        ellipsis: true,
        width: TableWidth.note,
        render: (_: unknown, record: GoodServiceByCategory, index) => {
          if (!record || record?.children || record?.isTotal) return null;

          if (record.goodsItems?.length > 0) {
            return (
              <LayoutCell position="right" className={styles["layout-cell"]}>
                {record.goodsItems.map((item: GoodsPrice, index2: number) => {
                  const isDisableData =
                    !item.buyQuantity || item.buyQuantity === 0;

                  return (
                    <div
                      className={styles["layout-cell-wrap"]}
                      key={`${item?.id}-${index2}`}
                    >
                      {!isHaveSupplier ? (
                        <OneLineText
                          key={`${item.id}-${index2}`}
                          value={formatCurrency({
                            value: item.taxAmount,
                            shouldRoundTwoNumber: false,
                            code: item.currency,
                          })}
                          useTooltip
                        />
                      ) : (
                        <InputNumber
                          disabled={isDisableData}
                          key={`${item.id}-${index2}`}
                          value={
                            isDisableData
                              ? 0
                              : !isNil(item.taxAmount)
                              ? round(
                                  item.taxAmount,
                                  checkIsSameVNDOrJPY(item.currency)
                                    ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                                    : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                                )
                              : 0
                          }
                          numberType={
                            checkIsSameVNDOrJPY(item.currency)
                              ? null
                              : NUMBER_TYPE_INPUT
                          }
                          onChange={(value: number) => {
                            const exchangeRatesItem = [
                              ...model.selectSupplier.exchangeRates,
                            ].find((el) => el.supplierId === item.supplier?.id);

                            const exChangeClosingRate =
                              exchangeRatesItem?.currency === VND_CURRENCY_UNIT
                                ? 1
                                : exchangeRatesItem?.closingRate || 0;

                            const taxAmount = value
                              ? round(
                                  value,
                                  checkIsSameVNDOrJPY(item.currency)
                                    ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                                    : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                                )
                              : 0;

                            const amountBeforeTax = round(
                              item.buyQuantity * item.unitPrice,
                              CONSTANT_NUMBER.TWO_NUMBER_FIX
                            );

                            const totalAmount =
                              amountBeforeTax +
                              round(
                                taxAmount,
                                checkIsSameVNDOrJPY(item.currency)
                                  ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                                  : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                              );

                            const totalConvertedAmount = round(
                              round(
                                totalAmount,
                                checkIsSameVNDOrJPY(item.currency)
                                  ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                                  : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                              ) * exChangeClosingRate,
                              CONSTANT_NUMBER.ZERO_FIX_NUMBER
                            );

                            const taxConvertedAmount = round(
                              round(
                                taxAmount,
                                checkIsSameVNDOrJPY(item.currency)
                                  ? CONSTANT_NUMBER.ZERO_FIX_NUMBER
                                  : CONSTANT_NUMBER.FOUR_NUMBER_FIX
                              ) * exChangeClosingRate,
                              CONSTANT_NUMBER.ZERO_FIX_NUMBER
                            );

                            return handleChangeItemTable({
                              fieldName: ColumnKey.TAX_AMOUNT,
                              value,
                              id: item.id,
                              indexBeforeValidate: index,
                              index2,
                              nameError: ColumnKey.QUANTITY,
                              objectFieldChangeFollow: {
                                totalAmount,
                                // Nhân với phần trăm thuế để tính thuế, hiện tại là 10%
                                totalConvertedAmount,
                                taxConvertedAmount,
                              },
                            });
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.taxAmount,
                  shouldRoundTwoNumber: false,
                  code: record?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="vertical_baseline text-right">
            {translate("PL.total_amount_label")}
          </div>
        ),
        ellipsis: true,
        width: TableWidth.note,
        key: ColumnKey.TOTAL_AMOUNT,
        dataIndex: ColumnKey.TOTAL_AMOUNT,
        render: (value, record: GoodServiceByCategory) => {
          if (!record || record?.children || record?.isTotal) return null;

          if (record.goodsItems?.length > 0) {
            return (
              <LayoutCell position="right" className={styles["layout-cell"]}>
                {record.goodsItems.map(
                  (item: GoodServiceByCategory, index2: number) => {
                    return (
                      <div
                        className={styles["layout-cell-wrap"]}
                        key={`${item?.id}-${index2}`}
                      >
                        <OneLineText
                          value={
                            !isNil(item.totalAmount)
                              ? formatCurrency({
                                  value: item.totalAmount,
                                  shouldRoundTwoNumber: false,
                                  code: item.currency,
                                })
                              : ""
                          }
                          useTooltip
                        />
                      </div>
                    );
                  }
                )}
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.totalAmount,
                  shouldRoundTwoNumber: false,
                  code: record?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      currencyShow !== VND_CURRENCY_UNIT && {
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
        key: ColumnKey.TOTAL_CONVERT_AMOUNT,
        dataIndex: ColumnKey.TOTAL_CONVERT_AMOUNT,
        render: (value, record: GoodServiceByCategory) => {
          if (!record) return null;

          if (record.goodsItems?.length > 0) {
            return (
              <LayoutCell position="right" className={styles["layout-cell"]}>
                {record.goodsItems.map(
                  (item: GoodServiceByCategory, index2: number) => {
                    return (
                      <div
                        className={styles["layout-cell-wrap"]}
                        key={`${item?.id}-${index2}`}
                      >
                        <OneLineText
                          value={
                            !isNil(item.totalConvertedAmount)
                              ? formatCurrency({
                                  value: item.totalConvertedAmount,
                                  shouldRoundTwoNumber: false,
                                  code: VND_CURRENCY_UNIT,
                                })
                              : ""
                          }
                          useTooltip
                        />
                      </div>
                    );
                  }
                )}
              </LayoutCell>
            );
          }

          if (record?.goodsServicesCategoryId) {
            const valueSum = sumWithFixed(
              record?.children?.map((el) => {
                if (el?.goodsItems) {
                  return sumWithFixed(
                    el.goodsItems?.map(
                      (el2: GoodServiceByCategory) => el2.totalConvertedAmount
                    )
                  );
                }

                return el.totalConvertedAmount;
              })
            );

            return (
              <LayoutCell position="right">
                <OneLineText
                  value={
                    !isNil(valueSum)
                      ? formatCurrency({
                          value: valueSum,
                          shouldRoundTwoNumber: false,
                          code: VND_CURRENCY_UNIT,
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
                    !isNil(totalConvertAmountData)
                      ? formatCurrency({
                          value: totalConvertAmountData,
                          shouldRoundTwoNumber: false,
                          code: VND_CURRENCY_UNIT,
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
                value={
                  !isNil(value)
                    ? formatCurrency({
                        value: value,
                        shouldRoundTwoNumber: false,
                        code: VND_CURRENCY_UNIT,
                      })
                    : ""
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      !isHaveSupplier && {
        title: () => <div>{translate("PL.drawer_generic")}</div>,
        ellipsis: true,
        width: TableWidth.note,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (!record) return null;

          if (record.goodsItems?.length > 0) {
            return (
              <LayoutCell position="left" className={styles["layout-cell"]}>
                {record.goodsItems.map(
                  (item: GoodServiceByCategory, index2: number) => {
                    return (
                      <div
                        className={styles["layout-cell-wrap"]}
                        key={`${item?.category?.name}-${index2}`}
                      >
                        <OneLineText value={item.category?.name} useTooltip />
                      </div>
                    );
                  }
                )}
              </LayoutCell>
            );
          }

          return (
            <LayoutCell position="left">
              <OneLineText value={record?.quoteBranch?.name} useTooltip />
            </LayoutCell>
          );
        },
      },
      isHaveSupplier && {
        title: () => <div>{translate("PL.type_currency_table")}</div>,
        ellipsis: true,
        width: TableWidth.currencyUnit,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (!record) return null;

          if (record.goodsItems?.length > 0) {
            return record.goodsItems.map(
              (item: GoodServiceByCategory, index2: number) => {
                return (
                  <LayoutCell
                    position="left"
                    key={`${item.currency}-${index2}`}
                  >
                    <OneLineText value={item.currency} useTooltip />
                  </LayoutCell>
                );
              }
            );
          }

          return (
            <LayoutCell position="left">
              <OneLineText value={record?.currency} useTooltip />
            </LayoutCell>
          );
        },
      },
      !isHaveSupplier && {
        title: () => <div>{translate("PL.drawer_notes_table")}</div>,
        ellipsis: true,
        width: TableWidth.currencyUnit,
        render: (_: unknown, record: GoodServiceByCategory) => {
          if (!record) return null;

          if (record.goodsItems?.length > 0) {
            return record.goodsItems.map(
              (item: GoodServiceByCategory, index2: number) => {
                return (
                  <LayoutCell position="left" key={`${item.note}-${index2}`}>
                    <OneLineText value={item.note} useTooltip />
                  </LayoutCell>
                );
              }
            );
          }
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.quoteNote} useTooltip />
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
    TableWidth.goodUnit,
    TableWidth.branchType,
    TableWidth.note,
    TableWidth.supplier,
    TableWidth.totalQuantity,
    TableWidth.tax,
    TableWidth.currencyUnit,
    isHaveSupplier,
    model,
    translate,
    totalItemData,
    handleChangeItemTable,
    currencyShow,
    totalConvertAmountData,
  ]);
  return { columns };
};

export default useColumnGoodServicesSection;
