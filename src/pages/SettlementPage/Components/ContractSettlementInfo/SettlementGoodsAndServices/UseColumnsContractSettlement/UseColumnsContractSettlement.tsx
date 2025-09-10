import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import classNames from "classnames";
import { VND_CURRENCY_UNIT } from "core/config/consts";
import { formatCurrency, formatNumber } from "core/helpers/number";
import {
  ContractRequestType,
  GoodsItemsType,
  SettlementHookModel,
  SettlementModel,
} from "models/Settlement";
import { UnitTitleTable } from "pages/PaymentPage/PaymentCreate/Components/UnitTitleTable/UnitTitleTable";
import { SettlementHookContext } from "pages/SettlementPage/SettlementDetail/SettlementDetailHook";
import { Dispatch, SetStateAction, useContext, useMemo } from "react";
import { LayoutCell, OneLineText } from "react-components-design-system";

interface PropsTable {
  model: SettlementModel;
  setRecordEdit: Dispatch<SetStateAction<GoodsItemsType>>;
  setOpenDrawerSettlementGoodsServices: Dispatch<SetStateAction<boolean>>;
}

const UseColumnsContractSettlement = ({
  model,
  setRecordEdit,
  setOpenDrawerSettlementGoodsServices,
}: PropsTable) => {
  const { translate, handleChangeAllField } = useContext<SettlementHookModel>(
    SettlementHookContext
  );

  const handleOpenDrawerSettlementGoodsServices = (record: GoodsItemsType) => {
    setRecordEdit(record);
    handleChangeAllField({
      ...model,
      errors: {
        ...model.errors,
        noteSettlement: null,
      },
    });
    setOpenDrawerSettlementGoodsServices(true);
  };

  const columns: ColumnProps<GoodsItemsType>[] = useMemo(() => {
    const columnsChildrenSettlement = [
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_quantity")}
            unit={" "}
          />
        ),
        dataIndex: "quantity",
        key: "quantity",
        width: 80,
        ellipsis: true,
        align: "right",
        render: (_text_, record) => {
          if (record?.children?.length > 0) {
            return null;
          }
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(record?.quantity)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_unit_price")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        dataIndex: "unitPrice",
        key: "unitPrice",
        width: 155,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.children?.length > 0) {
            return null;
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.unitPrice,
                  code: model?.contactOrderInfo?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_become_price")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 155,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: model?.goodsItems?.reduce(
                      (sum: number, item: any) => sum + item.totalPrice,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          if (record?.children?.length > 0) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: record?.children?.reduce(
                      (sum: number, item: any) => sum + item.totalPrice,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.totalPrice,
                  code: model?.contactOrderInfo?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_discount_value")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        dataIndex: "reducedPrice",
        key: "reducedPrice",
        width: 120,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: model?.goodsItems?.reduce(
                      (sum: number, item: any) => sum + item.reducedPrice,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          if (record?.children?.length > 0) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: record?.children?.reduce(
                      (sum: number, item: any) => sum + item.reducedPrice,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.reducedPrice,
                  code: model?.contactOrderInfo?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_tax_rate")}
            unit={" "}
          />
        ),
        dataIndex: "tax",
        key: "tax",
        width: 84,
        align: "left",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.children?.length > 0) {
            return null;
          }
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.tax?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_tax")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        dataIndex: "taxAmount",
        key: "taxAmount",
        width: 130,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: model?.goodsItems?.reduce(
                      (sum: number, item: any) => sum + item.taxAmount,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          if (record?.children?.length > 0) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: record?.children?.reduce(
                      (sum: number, item: any) => sum + item.taxAmount,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.taxAmount,
                  code: model?.contactOrderInfo?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_total_amount")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 120,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: model?.goodsItems?.reduce(
                      (sum: number, item: any) => sum + item.totalAmount,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          if (record?.children?.length > 0) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: record?.children?.reduce(
                      (sum: number, item: any) => sum + item.totalAmount,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.totalAmount,
                  code: model?.contactOrderInfo?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_note")}
            unit={" "}
          />
        ),
        dataIndex: "note",
        key: "note",
        width: 155,
        align: "left",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.children?.length > 0) {
            return null;
          }
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.note ? record?.note : "---"} />
            </LayoutCell>
          );
        },
      },
    ];

    const columnsChildrenContract = [
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_quantity")}
            unit={" "}
          />
        ),
        dataIndex: "contractQuantity",
        key: "contractQuantity",
        width: 80,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.children?.length > 0) {
            return null;
          }
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(record?.contractQuantity)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_unit_price")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        dataIndex: "contractUnitPrice",
        key: "contractUnitPrice",
        width: 155,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.children?.length > 0) {
            return null;
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.contractUnitPrice,
                  code: model?.contactOrderInfo?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_become_price")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        width: 155,
        dataIndex: "contractTotalPrice",
        key: "contractTotalPrice",
        ellipsis: true,
        align: "right",
        render: (_text_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: model?.goodsItems?.reduce(
                      (sum: number, item: any) => sum + item.contractTotalPrice,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          if (record?.children?.length > 0) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: record?.children?.reduce(
                      (sum: number, item: any) => sum + item.contractTotalPrice,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.contractTotalPrice,
                  code: model?.contactOrderInfo?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_tax_rate")}
            unit={" "}
          />
        ),
        dataIndex: "contractTax",
        key: "contractTax",
        width: 80,
        align: "left",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.children?.length > 0) {
            return null;
          }
          return (
            <LayoutCell position="left">
              <OneLineText value={record?.contractTax?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_tax")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        dataIndex: "contractTaxAmount",
        key: "contractTaxAmount",
        width: 130,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: model?.goodsItems?.reduce(
                      (sum: number, item: any) => sum + item.contractTaxAmount,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          if (record?.children?.length > 0) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: record?.children?.reduce(
                      (sum: number, item: any) => sum + item.contractTaxAmount,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.contractTaxAmount,
                  code: model?.contactOrderInfo?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_total_amount")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        dataIndex: "contractTotalAmount",
        key: "contractTotalAmount",
        width: 155,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: model?.goodsItems?.reduce(
                      (sum: number, item: any) =>
                        sum + item.contractTotalAmount,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          if (record?.children?.length > 0) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: record?.children?.reduce(
                      (sum: number, item: any) =>
                        sum + item.contractTotalAmount,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.contractTotalAmount,
                  code: model?.contactOrderInfo?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      },
    ];

    const columnsChildrenDifference = [
      {
        title: () => (
          <UnitTitleTable
            className="p-b--xs"
            title={translate("settlement.settlement_quantity")}
            unit={" "}
          />
        ),
        dataIndex: "diffQuantity",
        key: "diffQuantity",
        width: 126,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.children?.length > 0) {
            return null;
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "text-red": record?.diffQuantity < 0,
                  "text-green": record?.diffQuantity > 0,
                })}
                value={
                  `${record?.diffQuantity > 0 ? "+" : ""}` +
                  formatNumber(record?.diffQuantity || 0)
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_total_amount")}
            unit={model?.contactOrderInfo?.currency}
          />
        ),
        dataIndex: "diffTotalAmount",
        key: "diffTotalAmount",
        width: 155,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.isTotal) {
            const diffTotalAmount = model?.goodsItems?.reduce(
              (sum: number, item: GoodsItemsType) =>
                sum + (item.diffTotalAmount || 0),
              0
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  className={classNames({
                    "text-red": diffTotalAmount < 0,
                    "text-green": diffTotalAmount > 0,
                  })}
                  value={
                    `${diffTotalAmount > 0 ? "+" : ""}` +
                    formatCurrency({
                      value: diffTotalAmount || 0,
                      code: model?.contactOrderInfo?.currency,
                    })
                  }
                />
              </LayoutCell>
            );
          }
          if (record?.children?.length > 0) {
            const diffTotalAmountChildren = record?.children?.reduce(
              (sum: number, item: GoodsItemsType) => sum + item.diffTotalAmount,
              0
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  className={classNames({
                    "text-red": diffTotalAmountChildren < 0,
                    "text-green": diffTotalAmountChildren > 0,
                  })}
                  value={
                    `${diffTotalAmountChildren > 0 ? "+" : ""}` +
                    formatCurrency({
                      value: diffTotalAmountChildren || 0,
                      code: model?.contactOrderInfo?.currency,
                    })
                  }
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "text-red": record?.diffTotalAmount < 0,
                  "text-green": record?.diffTotalAmount > 0,
                })}
                value={
                  `${record?.diffTotalAmount > 0 ? "+" : ""}` +
                  formatCurrency({
                    value: record?.diffTotalAmount || 0,
                    code: model?.contactOrderInfo?.currency,
                  })
                }
              />
            </LayoutCell>
          );
        },
      },
    ];

    if (model?.contactOrderInfo?.currency !== VND_CURRENCY_UNIT) {
      columnsChildrenSettlement.splice(7, 0, {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_total_exchange_rate")}
            unit={VND_CURRENCY_UNIT}
          />
        ),
        dataIndex: "totalExchangeAmount",
        key: "totalExchangeAmount",
        width: 155,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: model?.goodsItems?.reduce(
                      (sum: number, item: any) =>
                        sum + item.totalExchangeAmount,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          if (record?.children?.length > 0) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: record?.children?.reduce(
                      (sum: number, item: any) =>
                        sum + item.totalExchangeAmount,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.totalExchangeAmount,
                  code: model?.contactOrderInfo?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      });

      columnsChildrenContract.splice(6, 0, {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_total_exchange_rate")}
            unit={VND_CURRENCY_UNIT}
          />
        ),
        dataIndex: "contractTotalExchangeAmount",
        key: "contractTotalExchangeAmount",
        width: 155,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: model?.goodsItems?.reduce(
                      (sum: number, item: any) =>
                        sum + item.contractTotalExchangeAmount,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          if (record?.children?.length > 0) {
            return (
              <LayoutCell position="right">
                <OneLineText
                  value={formatCurrency({
                    value: record?.children?.reduce(
                      (sum: number, item: any) =>
                        sum + item.contractTotalExchangeAmount,
                      0
                    ),
                    code: model?.contactOrderInfo?.currency,
                  })}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatCurrency({
                  value: record?.contractTotalExchangeAmount,
                  code: model?.contactOrderInfo?.currency,
                })}
              />
            </LayoutCell>
          );
        },
      });

      columnsChildrenDifference.splice(2, 0, {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_total_exchange_rate")}
            unit={VND_CURRENCY_UNIT}
          />
        ),
        dataIndex: "diffTotalExchangeAmount",
        key: "diffTotalExchangeAmount",
        width: 154,
        align: "right",
        ellipsis: true,
        render: (_text_, record) => {
          if (record?.isTotal) {
            const diffTotalExchangeAmount = model?.goodsItems?.reduce(
              (sum: number, item: GoodsItemsType) =>
                sum + item.diffTotalExchangeAmount,
              0
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  className={classNames({
                    "text-red": diffTotalExchangeAmount < 0,
                    "text-green": diffTotalExchangeAmount > 0,
                  })}
                  value={
                    `${diffTotalExchangeAmount > 0 ? "+" : ""}` +
                    formatCurrency({
                      value: diffTotalExchangeAmount || 0,
                      code: model?.contactOrderInfo?.currency,
                    })
                  }
                />
              </LayoutCell>
            );
          }
          if (record?.children?.length > 0) {
            const diffTotalExchangeAmountChildren = record?.children?.reduce(
              (sum: number, item: GoodsItemsType) =>
                sum + item.diffTotalExchangeAmount,
              0
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  className={classNames({
                    "text-red": diffTotalExchangeAmountChildren < 0,
                    "text-green": diffTotalExchangeAmountChildren > 0,
                  })}
                  value={
                    `${diffTotalExchangeAmountChildren > 0 ? "+" : ""}` +
                    formatCurrency({
                      value: diffTotalExchangeAmountChildren || 0,
                      code: model?.contactOrderInfo?.currency,
                    })
                  }
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                className={classNames({
                  "text-red": record?.diffTotalExchangeAmount < 0,
                  "text-green": record?.diffTotalExchangeAmount > 0,
                })}
                value={
                  `${record?.diffTotalExchangeAmount > 0 ? "+" : ""}` +
                  formatCurrency({
                    value: record?.diffTotalExchangeAmount || 0,
                    code: model?.contactOrderInfo?.currency,
                  })
                }
              />
            </LayoutCell>
          );
        },
      });
    }

    return [
      {
        title: <div className="p-l--md">{""}</div>,
        className: "table-header-bordered",
        children: [
          {
            title: () => (
              <div className="p-b--xs p-l--2xl">
                {translate("settlement.settlement_goods_and_services")}
              </div>
            ),
            dataIndex: "contractGoodsItem",
            key: "contractGoodsItem",
            width: 260,
            ellipsis: true,
            align: "left",
            render: (_text_, record) => {
              if (record?.isTotal) {
                return (
                  <LayoutCell position="left">
                    <div className="total-title p-l--2xl">
                      {translate("settlement.settlement_total")}
                    </div>
                  </LayoutCell>
                );
              }
              if (record?.children?.length > 0) {
                return (
                  <LayoutCell position="left">
                    <OneLineText
                      className="fw-semibold"
                      value={record?.contractGoodsItem?.category?.name}
                    />
                  </LayoutCell>
                );
              }
              return (
                <LayoutCell position="left">
                  <Tooltip
                    placement="topLeft"
                    className="w-100"
                    title={
                      <>
                        <div>{record?.contractGoodsItem?.name}</div>
                        <div>{record?.contractGoodsItem?.code}</div>
                      </>
                    }
                  >
                    <div>
                      <div
                        className="text_blue fw-semibold cursor-pointer text-truncate p-r--xl"
                        onClick={() =>
                          handleOpenDrawerSettlementGoodsServices(record)
                        }
                      >
                        {record?.contractGoodsItem?.name}
                      </div>
                      <div className="text-second__style">
                        {record?.contractGoodsItem?.code}
                      </div>
                    </div>
                  </Tooltip>
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <UnitTitleTable
                className="p-b--xs"
                title={translate(
                  "settlement.settlement_description_goods_and_services"
                )}
                unit={" "}
              />
            ),
            dataIndex: "contractGoodsItem",
            key: "contractGoodsItem",
            width: 220,
            ellipsis: true,
            align: "left",
            render: (_text_, record) => {
              if (record?.children?.length > 0) {
                return null;
              }
              return (
                <LayoutCell position="left">
                  <OneLineText value={record?.contractGoodsItem?.description} />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <UnitTitleTable
                className="p-b--xs"
                title={translate("settlement.settlement_unit")}
                unit={" "}
              />
            ),
            dataIndex: "unit",
            key: "unit",
            width: 91,
            ellipsis: true,
            align: "left",
            render: (_text_, record) => {
              if (record?.children?.length > 0) {
                return null;
              }
              return (
                <LayoutCell position="left">
                  <OneLineText value={record?.contractGoodsItem?.unit?.name} />
                </LayoutCell>
              );
            },
          },
        ],
      },
      {
        title: () => (
          <UnitTitleTable
            title={translate("settlement.settlement_value")}
            unit={" "}
          />
        ),
        className: "table-header-bordered",
        children: columnsChildrenSettlement,
      },
      {
        title: () => (
          <UnitTitleTable
            title={
              model?.contactOrderInfo?.contractRequestType ===
              ContractRequestType.Contract
                ? translate("settlement.settlement_contract_value")
                : model?.contactOrderInfo?.contractRequestType ===
                  ContractRequestType.PurchaseOrder
                ? translate("settlement.settlement_order_value")
                : translate(
                    "settlement.settlement_order_contract_in_principle_value"
                  )
            }
            unit={" "}
          />
        ),
        className: "table-header-bordered",
        children: columnsChildrenContract,
      },
      {
        title: () => (
          <UnitTitleTable
            title={
              model?.contactOrderInfo?.contractRequestType ===
              ContractRequestType.Contract
                ? translate(
                    "settlement.settlement_difference_compared_to_contract"
                  )
                : model?.contactOrderInfo?.contractRequestType ===
                  ContractRequestType.PurchaseOrder
                ? translate(
                    "settlement.settlement_difference_compared_to_purchase_order"
                  )
                : translate(
                    "settlement.settlement_difference_compared_to_contract_in_principle"
                  )
            }
            unit={" "}
          />
        ),
        className: "table-header-bordered",
        children: columnsChildrenDifference,
      },
      {
        title: () => <UnitTitleTable title={""} unit={" "} />,
        className: "table-header-bordered",
        children: [
          {
            title: () => (
              <UnitTitleTable
                className="p-b--xs"
                title={translate("settlement.settlement_brand_type")}
                unit={" "}
              />
            ),
            dataIndex: "contractGoodsItem",
            key: "contractGoodsItem",
            width: 132,
            align: "left",
            ellipsis: true,
            render: (_text_, record) => {
              if (record?.children?.length > 0) {
                return null;
              }
              return (
                <LayoutCell position="left">
                  <OneLineText
                    value={record?.contractGoodsItem?.branch?.name}
                  />
                </LayoutCell>
              );
            },
          },
          {
            title: () => (
              <UnitTitleTable
                className="p-b--xs"
                title={translate(
                  "settlement.settlement_note_goods_and_services"
                )}
                unit={" "}
              />
            ),
            dataIndex: "contractGoodsItem",
            key: "contractGoodsItem",
            width: 200,
            align: "left",
            ellipsis: true,
            render: (_text_, record) => {
              if (record?.children?.length > 0) {
                return null;
              }
              return (
                <LayoutCell position="left">
                  <OneLineText
                    value={
                      record?.contractGoodsItem?.note
                        ? record?.contractGoodsItem?.note
                        : "---"
                    }
                  />
                </LayoutCell>
              );
            },
          },
        ],
      },
    ];
  }, [translate, model]);

  return { columns };
};

export const convertDataWithChildren = (data: GoodsItemsType[]) => {
  const result: any[] = [];
  const categoryMap = new Map<string, any>();

  data?.forEach((item, index) => {
    const categoryId = item.contractGoodsItem?.categoryId || "no-category";

    const childObj = {
      id: `${item?.id || "item"}-child-${index}`,
      contractGoodsItem: item.contractGoodsItem,
      unit: item.contractGoodsItem?.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      reducedPrice: item.reducedPrice,
      tax: item.tax,
      taxAmount: item.taxAmount,
      totalAmount: item.totalAmount,
      totalExchangeAmount: item.totalExchangeAmount,
      note: item.note,
      contractQuantity: item.contractQuantity,
      contractUnitPrice: item.contractUnitPrice,
      contractTotalPrice: item.contractTotalPrice,
      contractTax: item.contractTax,
      contractTaxAmount: item.contractTaxAmount,
      contractTotalAmount: item.contractTotalAmount,
      contractTotalExchangeAmount: item.contractTotalExchangeAmount,
      diffQuantity: item.diffQuantity,
      diffTotalAmount: item.diffTotalAmount,
      diffTotalExchangeAmount: item.diffTotalExchangeAmount,
      diffTax: item.diffTax,
      diffTaxId: item.diffTaxId,
      diffTotalPrice: item.diffTotalPrice,
      diffUnitPrice: item.diffUnitPrice,
      diffTaxAmount: item.diffTaxAmount,
      diffReducedPrice: item.diffReducedPrice,
    };

    if (!categoryMap.has(categoryId)) {
      const group = {
        id: item?.id || `item-${index}`,
        contractGoodsItem: item.contractGoodsItem,
        unit: item.contractGoodsItem?.unit,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        reducedPrice: item.reducedPrice,
        tax: item.tax,
        taxAmount: item.taxAmount,
        totalAmount: item.totalAmount,
        totalExchangeAmount: item.totalExchangeAmount,
        note: item.note,
        contractQuantity: item.contractQuantity,
        contractUnitPrice: item.contractUnitPrice,
        contractTotalPrice: item.contractTotalPrice,
        contractTax: item.contractTax,
        contractTaxAmount: item.contractTaxAmount,
        contractTotalAmount: item.contractTotalAmount,
        contractTotalExchangeAmount: item.contractTotalExchangeAmount,
        diffQuantity: item.diffQuantity,
        diffTotalAmount: item.diffTotalAmount,
        diffTotalExchangeAmount: item.diffTotalExchangeAmount,
        diffTax: item.diffTax,
        diffTaxId: item.diffTaxId,
        diffTotalPrice: item.diffTotalPrice,
        diffUnitPrice: item.diffUnitPrice,
        diffTaxAmount: item.diffTaxAmount,
        diffReducedPrice: item.diffReducedPrice,
        children: [childObj],
      };
      categoryMap.set(categoryId, group);
      result.push(group);
    } else {
      categoryMap.get(categoryId).children.push(childObj);
    }
  });

  return [
    {
      isTotal: true,
      children: result,
    },
  ];
};

export default UseColumnsContractSettlement;
