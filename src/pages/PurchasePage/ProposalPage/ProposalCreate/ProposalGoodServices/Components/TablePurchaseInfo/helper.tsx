import { Tooltip } from "antd";
import { ColumnProps } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import { ErrorTab } from "assets/icons";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { addNumbers, roundTo } from "core/helpers/number";
import { KeyType } from "core/services/service-types";
import { type TFunction } from "i18next";
import {
  difference,
  isBoolean,
  isEqual,
  isUndefined,
  size,
  subtract,
  uniq,
  uniqBy,
} from "lodash";
import { ProposalRequestModel, PurchaseItem } from "models/Proposal";
import {
  GoodService,
  GoodServiceByCategory,
  GoodServiceExtend,
} from "models/Proposal/GoodService";
import { Model } from "react-3layer-common";
import {
  Checkbox,
  FormItem,
  LayoutCell,
  OneLineText,
} from "react-components-design-system";
import { calculate, formatNumberToCurrency } from "../../helper";
import CellCustom from "./Components/CellCustom";

export const ROUND_NUM_NOT_VND = 4;

export const ROUND_NUM_CALCULATE_NOT_VND = 2;

type RenderRowSelectionProps = {
  isDetail?: boolean;
  defaultRowSelection?: TableRowSelection<GoodServiceByCategory>;
  setSelectedRowKeys: (value: React.SetStateAction<KeyType[]>) => void;
  setSelectedRow: (
    value: React.SetStateAction<GoodServiceByCategory[]>
  ) => void;
  selectedRow: GoodServiceByCategory[];
  selectedRowKeys: KeyType[];
  dataSource: GoodServiceByCategory[];
};

export const renderRowSelection = ({
  isDetail,
  defaultRowSelection,
  setSelectedRow,
  setSelectedRowKeys,
  selectedRow,
  selectedRowKeys,
  dataSource,
}: RenderRowSelectionProps): TableRowSelection<GoodServiceByCategory> => {
  if (isDetail) return null;
  return {
    ...defaultRowSelection,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRow(
        selectedRows.filter(
          (item) => item?.renderId && isUndefined(item?.children)
        )
      );
    },
    getCheckboxProps: (record) => {
      let isDisabled =
        "isTotal" in record || (record as GoodServiceExtend)?.notEdit;

      if (record?.children?.every((item) => item?.notEdit)) {
        isDisabled = true;
      }

      if (
        record?.children?.every((item: GoodServiceExtend) =>
          isEqual(item?.isOriginalItem, false)
        )
      ) {
        isDisabled = false;
      }

      const isOriginalItem = (record as GoodServiceExtend)?.isOriginalItem;
      if (isEqual(isOriginalItem, false)) {
        isDisabled = false;
      }

      return {
        disabled: isDisabled,
        skipGroup: "children" in record,
      };
    },
    renderCell: (
      value: boolean,
      record: GoodServiceByCategory | GoodServiceExtend
    ) => {
      let isDisabled =
        "isTotal" in record || (record as GoodServiceExtend)?.notEdit;

      if (record?.children?.every((item: GoodServiceExtend) => item?.notEdit)) {
        isDisabled = true;
      }

      if (
        record?.children?.every((item: GoodServiceExtend) =>
          isEqual(item?.isOriginalItem, false)
        )
      ) {
        isDisabled = false;
      }

      const isOriginalItem = (record as GoodServiceExtend)?.isOriginalItem;
      if (isEqual(isOriginalItem, false)) {
        isDisabled = false;
      }

      const isIndeterminate =
        "children" in record &&
        record.children
          ?.filter((i: GoodServiceExtend) => !i?.notEdit)
          ?.some((item: GoodServiceExtend) =>
            selectedRowKeys.includes(item?.renderId)
          ) &&
        !record?.children
          ?.filter((i: GoodServiceExtend) => !i?.notEdit)
          ?.every((item: GoodServiceExtend) =>
            selectedRowKeys.includes(item?.renderId)
          );

      return (
        <div
          className={`${
            "isTotal" in record ? "d-none" : "d-flex"
          } justify-content-center align-items-center pt-0 payment-height_40`}
        >
          <Checkbox
            indeterminate={isIndeterminate}
            disabled={isDisabled}
            readOnly={"isTotal" in record}
            checked={value}
            onChange={(e) => {
              const listIdChild: string[] = [];
              const parent = dataSource.find((item) => {
                return item.children?.find(
                  (child) => child?.renderId === record?.renderId
                );
              });
              const listChild =
                parent?.children?.filter((i) => !i?.notEdit) ?? [];
              if ("children" in record) {
                record.children?.forEach((item: GoodServiceExtend) => {
                  if (
                    isEqual(item?.isOriginalItem, true) ||
                    (!isBoolean(item?.isOriginalItem) && item?.notEdit)
                  )
                    return;
                  listIdChild.push(item?.renderId);
                  listChild.push(item);
                });
              }
              if (e) {
                if ("children" in record) {
                  setSelectedRowKeys(
                    uniq([...selectedRowKeys, ...listIdChild, record?.renderId])
                  );
                  setSelectedRow(uniqBy([...selectedRow, ...listChild], "id"));
                } else {
                  const isAllChillChecked = listChild.every((item) => {
                    return [...selectedRowKeys, record?.renderId].includes(
                      item?.renderId
                    );
                  });

                  if (isAllChillChecked) {
                    setSelectedRowKeys([
                      ...selectedRowKeys,
                      record?.renderId,
                      parent?.renderId,
                    ]);
                  } else {
                    setSelectedRowKeys([...selectedRowKeys, record?.renderId]);
                  }

                  setSelectedRow([...selectedRow, record]);
                }
              } else {
                if ("children" in record) {
                  setSelectedRowKeys(
                    difference(selectedRowKeys, [
                      ...listIdChild,
                      record?.renderId,
                    ])
                  );
                  setSelectedRow(difference(selectedRow, [...listChild]));
                } else {
                  setSelectedRowKeys(
                    difference(selectedRowKeys, [
                      record?.renderId,
                      parent?.renderId,
                    ])
                  );
                  setSelectedRow(difference(selectedRow, [record]));
                }
              }
            }}
          />
        </div>
      );
    },
  };
};

type RenderColumnsType = {
  model: ProposalRequestModel;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setRecordEdit: React.Dispatch<React.SetStateAction<GoodServiceExtend>>;
  currentRate: number;
  roundNum: number;
  roundNumCalculate: number;
  translate: TFunction;
  isCurrencyVND: boolean;
};

export const renderColumns = ({
  model,
  roundNum,
  roundNumCalculate,
  setOpenDrawer,
  setRecordEdit,
  currentRate,
  translate,
  isCurrencyVND,
}: RenderColumnsType): ColumnProps<
  GoodServiceByCategory | GoodServiceExtend
>[] => {
  const columns: ColumnProps<GoodServiceByCategory | GoodServiceExtend>[] = [
    {
      title: (
        <div className="p-l--md">{translate("PP.text_goods_services")}</div>
      ),
      ellipsis: true,
      width: 240,
      fixed: "left",
      key: "id",
      render: (record: GoodService) => {
        if ("isTotal" in record) {
          return (
            <LayoutCell className="m-l--sm">
              <OneLineText
                value={translate("PP.txt_size_type_goods_services", {
                  size: size(model?.selectedListGoodsServices),
                })}
              />
            </LayoutCell>
          );
        }

        if (record?.children) {
          return (
            <LayoutCell className="data-with-collapse">
              <OneLineText
                className="fw-semibold"
                value={record?.goodsServicesCategoryName}
              />
            </LayoutCell>
          );
        }

        return (
          <LayoutCell className="data-with-collapse">
            <CellCustom
              onClick={() => {
                setOpenDrawer(true);
                setRecordEdit(record as GoodServiceExtend);
              }}
              record={record as GoodService}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="d-flex">{translate("PP.text_manufacture")}</div>
      ),
      ellipsis: true,
      width: 130,
      key: "manufacturer",
      render: (record: GoodServiceExtend) => {
        if (record?.children) {
          return <></>;
        }

        return (
          <LayoutCell>
            <FormItem
            // validateObject={utilService.getValidateObj(
            //   model,
            //   `purchaseItems[${record?.indexBeforeValidate}].branchId`
            // )}
            >
              <OneLineText useTooltip value={record?.manufacturer?.name} />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: () => <div>{translate("PP.text_amount")}</div>,
      align: "right",
      key: "quantity",
      ellipsis: true,
      width: 80,
      render: (record: GoodServiceExtend) => {
        if (record?.children || "isTotal" in record) {
          return <></>;
        }

        return (
          <LayoutCell className="justify-content-end">
            <FormItem
              placeRight
              // validateObject={utilService.getValidateObj(
              //   model,
              //   `purchaseItems[${record?.indexBeforeValidate}].quantity`
              // )}
            >
              <OneLineText
                useTooltip
                value={
                  record?.quantity
                    ? formatNumberToCurrency(
                        record?.quantity,
                        ROUND_NUM_NOT_VND
                      )
                    : ""
                }
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: () => <div>{translate("PP.text_unit")}</div>,
      ellipsis: true,
      width: 90,
      key: "goodsServiceUnit",
      render: (record: GoodServiceExtend) => {
        if (record?.children) {
          return <></>;
        }

        return (
          <LayoutCell>
            <OneLineText useTooltip value={record?.goodsServiceUnit?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PP.text_unit_price")}
          unit={model?.currency?.code}
        />
      ),
      ellipsis: true,
      width: 155,
      align: "right",
      render: (record: GoodServiceExtend) => {
        if (record?.children || "isTotal" in record) {
          return <></>;
        }

        return (
          <LayoutCell className="justify-content-end">
            <OneLineText
              useTooltip
              value={formatNumberToCurrency(record?.unitPrice, roundNum)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PP.text_become_price")}
          unit={model?.currency?.code}
        />
      ),
      ellipsis: true,
      align: "right",
      width: 155,
      render: (record: GoodServiceExtend | GoodServiceByCategory) => {
        if ("isTotal" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={formatNumberToCurrency(
                  model?.selectedListGoodsServices?.reduce(
                    (prev: number, curr: GoodServiceExtend) => {
                      return (
                        prev +
                        roundTo(curr?.amountBeforeTax || 0, roundNumCalculate)
                      );
                    },
                    0
                  ),
                  roundNumCalculate
                )}
              />
            </LayoutCell>
          );
        }
        if ("amountBeforeTax" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(
                  record?.amountBeforeTax,
                  roundNumCalculate
                )}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="justify-content-end">
            <OneLineText
              useTooltip
              className="fw-semibold"
              value={formatNumberToCurrency(
                record?.children?.reduce(
                  (prev: number, curr: GoodServiceExtend) => {
                    return prev + (curr?.amountBeforeTax || 0);
                  },
                  0
                ),
                roundNumCalculate
              )}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PP.text_tax")}
          unit={model?.currency?.code}
        />
      ),
      ellipsis: true,
      width: 155,
      align: "right",
      render: (record?: GoodServiceExtend | GoodServiceByCategory) => {
        if ("isTotal" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={formatNumberToCurrency(
                  model?.selectedListGoodsServices?.reduce(
                    (prev: number, curr: GoodServiceExtend) => {
                      return prev + (curr?.taxAmount || 0);
                    },
                    0
                  ),
                  roundNum
                )}
              />
            </LayoutCell>
          );
        }
        if ("taxAmount" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(record?.taxAmount, roundNum)}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="justify-content-end">
            <OneLineText
              useTooltip
              className="fw-semibold"
              value={formatNumberToCurrency(
                record?.children?.reduce(
                  (prev: number, curr: GoodServiceExtend) => {
                    return prev + (curr?.taxAmount || 0);
                  },
                  0
                ),
                roundNum
              )}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PP.text_other_cost")}
          unit={model?.currency?.code}
        />
      ),
      ellipsis: true,
      width: 155,
      align: "right",
      render: (record: GoodServiceExtend | GoodServiceByCategory) => {
        if ("isTotal" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={formatNumberToCurrency(
                  model?.selectedListGoodsServices?.reduce(
                    (prev: number, curr: GoodServiceExtend) => {
                      return prev + (curr?.otherAmount || 0);
                    },
                    0
                  ),
                  roundNum
                )}
              />
            </LayoutCell>
          );
        }

        if ("otherAmount" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(record?.otherAmount, roundNum)}
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="justify-content-end">
            <OneLineText
              useTooltip
              className="fw-semibold"
              value={formatNumberToCurrency(
                record?.children?.reduce(
                  (prev: number, curr: GoodServiceExtend) => {
                    return prev + (curr?.otherAmount || 0);
                  },
                  0
                ),
                roundNum
              )}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PP.text_total")}
          unit={model?.currency?.code}
        />
      ),
      ellipsis: true,
      width: 155,
      align: "right",
      render: (record: GoodServiceExtend | GoodServiceExtend) => {
        if ("isTotal" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={formatNumberToCurrency(
                  model?.selectedListGoodsServices?.reduce(
                    (prev: number, curr: GoodServiceExtend) => {
                      return prev + roundTo(curr?.totalAmount || 0, roundNum);
                    },
                    0
                  ),
                  roundNum
                )}
              />
            </LayoutCell>
          );
        }

        if ("totalAmount" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={formatNumberToCurrency(record?.totalAmount, roundNum)}
              />
            </LayoutCell>
          );
        }

        return (
          <LayoutCell className="justify-content-end">
            <OneLineText
              useTooltip
              className="fw-semibold"
              value={formatNumberToCurrency(
                record?.children?.reduce(
                  (prev: number, curr: GoodServiceExtend) => {
                    return prev + (curr?.totalAmount || 0);
                  },
                  0
                ),
                roundNum
              )}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <UnitTitle
          title={translate("PP.text_convert_total")}
          unit={translate("PM.payment_currency_unit")}
        />
      ),
      ellipsis: true,
      width: 155,
      align: "right",
      hidden: isCurrencyVND,
      render: (record: GoodServiceExtend | GoodServiceByCategory) => {
        if ("isTotal" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className="fw-semibold"
                value={formatNumberToCurrency(
                  model?.selectedListGoodsServices?.reduce(
                    (prev: number, curr: GoodServiceExtend) => {
                      return (
                        prev +
                        calculate([
                          roundTo(
                            addNumbers(
                              curr?.amountBeforeTax || 0,
                              curr?.taxAmount || 0,
                              curr?.otherAmount || 0
                            ),
                            roundNum
                          ),
                          currentRate,
                        ]).value
                      );
                    },
                    0
                  )
                )}
              />
            </LayoutCell>
          );
        }
        if ("totalAmount" in record) {
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                value={
                  calculate(
                    [
                      roundTo(
                        addNumbers(
                          record?.amountBeforeTax || 0,
                          record?.taxAmount || 0,
                          record?.otherAmount || 0
                        ),
                        roundNum
                      ),
                      currentRate,
                    ],
                    0
                  ).display
                }
              />
            </LayoutCell>
          );
        }
        return (
          <LayoutCell className="justify-content-end">
            <OneLineText
              useTooltip
              className="fw-semibold"
              value={formatNumberToCurrency(
                record?.children?.reduce(
                  (prev: number, curr: GoodServiceExtend) => {
                    return (
                      prev +
                      calculate([
                        roundTo(
                          addNumbers(
                            curr?.amountBeforeTax || 0,
                            curr?.taxAmount || 0,
                            curr?.otherAmount || 0
                          ),
                          roundNum
                        ),

                        currentRate,
                      ]).value
                    );
                  },
                  0
                )
              )}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14 d-flex">
          {translate("PP.text_description")}
        </div>
      ),
      ellipsis: true,
      width: 250,
      key: "description",
      dataIndex: "description",
      render: (value: string) => (
        <LayoutCell>
          <OneLineText useTooltip value={value} />
        </LayoutCell>
      ),
    },
  ];

  if (model?.isAdjust) {
    columns.splice(-1, 0, {
      title: () => (
        <UnitTitle
          title={translate("PP.table_compare_original_proposal")}
          unit={model?.currency?.code}
        />
      ),
      ellipsis: true,
      width: 165,
      align: "right",
      render: (record: GoodServiceExtend | GoodServiceExtend) => {
        if ("isTotal" in record) {
          const totalAmount = model?.selectedListGoodsServices?.reduce(
            (prev: number, curr: GoodServiceExtend) => {
              return prev + (curr?.totalAmount || 0);
            },
            0
          );

          const originalTotalAmount = model?.selectedListGoodsServices?.reduce(
            (prev: number, curr: GoodServiceExtend) => {
              return prev + (curr?.originalTotalAmount || 0);
            },
            0
          );

          const val = calculateSubtract(
            totalAmount,
            originalTotalAmount,
            roundNum
          );
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className={`fw-semibold ${val.styleClass}`}
                value={val.display}
              />
            </LayoutCell>
          );
        }

        if ("totalAmount" in record) {
          const val = calculateSubtract(
            record?.totalAmount || 0,
            record?.originalTotalAmount || 0,
            roundNum
          );
          return (
            <LayoutCell className="justify-content-end">
              <OneLineText
                useTooltip
                className={`${val.styleClass}`}
                value={val.display}
              />
            </LayoutCell>
          );
        }

        const totalAmount = record?.children?.reduce(
          (prev: number, curr: GoodServiceExtend) => {
            return prev + (curr?.totalAmount || 0);
          },
          0
        );

        const originalTotalAmount = record?.children?.reduce(
          (prev: number, curr: GoodServiceExtend) => {
            return prev + (curr?.originalTotalAmount || 0);
          },
          0
        );

        const val = calculateSubtract(
          totalAmount,
          originalTotalAmount,
          roundNum
        );

        return (
          <LayoutCell className="justify-content-end">
            <OneLineText
              useTooltip
              className={`fw-semibold ${val.styleClass}`}
              value={val.display}
            />
          </LayoutCell>
        );
      },
    });
  }

  const errorColumn: ColumnProps<GoodServiceByCategory> = {
    key: "id",
    width: 40,
    render: (record: any) => {
      if (record?.children?.length > 0 || !model || !model.errors) {
        return "";
      }

      let error = "";
      const quantityError = getErrorMessage(
        model.errors,
        `purchaseItems[${record.indexBeforeValidate}].quantity`
      );

      if (quantityError) {
        error += `${quantityError}\n`;
      }

      if (quantityError)
        return (
          <LayoutCell className="cell-error">
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
    Object.keys(model.errors).some((el) => el.includes("purchaseItems"))
  ) {
    columns.unshift(errorColumn);
  }

  return columns;
};

const calculateSubtract = (
  a: number,
  b: number,
  roundNum: number
): { display: string; styleClass: string } => {
  const sign = a === b ? "" : a > b ? "+" : "-";

  return {
    display: `${sign} ${formatNumberToCurrency(
      Math.abs(subtract(a, b)),
      roundNum
    )}`,
    styleClass: a === b ? "" : a > b ? "text-success" : "text-danger",
  };
};

export const handleListPurchaseNotEdit = (
  data: GoodServiceByCategory[]
): PurchaseItem[] => {
  const listPurchaseNotEdit: PurchaseItem[] = [];
  data.forEach((item) => {
    item?.children?.forEach((child) => {
      if (child?.notEdit) {
        listPurchaseNotEdit.push({
          id: child?.id,
          goodsId: child.id,
          branchId: child?.manufacturer?.id,
          unitId: child?.goodsServiceUnit?.id,
          description: child?.description,
          quantity: child?.quantity,
          unitPrice: child?.unitPrice,
          taxAmount: child?.taxAmount,
          taxId: child?.tax?.id,
          otherAmount: child?.otherAmount,
          note: child?.note,
          code: child?.code,
          name: child?.name,
          categoryId: child?.category?.id,
          unit: child?.goodsServiceUnit,
          branch: child?.manufacturer,
          tax: child?.tax,
          category: child?.category,
          originalTotalAmount: child?.originalTotalAmount,
        });
      }
    });
  });
  return listPurchaseNotEdit;
};

const getErrorMessage = (errors: Model.Errors<Model>, field: string) =>
  errors[field] || "";
