import { TrashCan } from "@carbon/icons-react";
import { type ColumnProps } from "antd/es/table";
import type {
  ExpandableConfig,
  TableRowSelection,
} from "antd/es/table/interface";
import { DeleteRoundIcon, IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { NUMBER_MAX_13 } from "config/const";
import { formatNumber } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";
import { listService } from "core/services/page-services/list-service";
import { FieldValue } from "core/services/service-types";
import {
  difference,
  isEmpty,
  isEqual,
  isUndefined,
  min,
  round,
  size,
} from "lodash";
import {
  GoodPriceByCategory,
  GoodsPrice,
  PurchasingPlanModel,
} from "models/PurchasingPlan";
import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";
import {
  Dispatch,
  Key,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  InputNumber,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { JPY_CURRENCY, VIETNAMESE_CURRENCY } from "../../SelectSupplierSection";
import "./GoodsServiceTable.scss";
import {
  calculateTotal,
  convertToVNDCurrency,
  groupDataByCategory,
} from "./helpers";

const GoodsServiceTable = () => {
  const { model, translate, handleChangeSingleField } =
    useContext<PurchasingPlanModel>(PurchasingPlanDetailHookContext);

  const [openModalConfirmDelete, setOpenModalConfirmDelete] =
    useState<boolean>(false);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys, setSelectedRow } =
    listService.useRowSelection<GoodsPrice>(
      "checkbox",
      [],
      false,
      "auto",
      false
    );

  const [selectedRowKey, setSelectedRowKey] = useState<string | undefined>(
    undefined
  );

  const biddingExchangeRate = model?.biddingExchangeRate || 1;

  const currencyCode =
    model?.currentBiddingRound?.quotations?.currency?.code || "VND";

  const convertDataByCategory = useMemo(
    () =>
      groupDataByCategory(
        model?.goodPrices || [],
        currencyCode,
        biddingExchangeRate
      ),
    [model?.goodPrices, currencyCode, biddingExchangeRate]
  );

  const handleChangeItemTable = useCallback(
    (
      fieldName: string,
      value: FieldValue,
      objectValue: FieldValue,
      id: string,
      fieldNameError: string
    ) => {
      const goodPricesEdit = model?.goodPrices?.map((item: GoodsPrice) => {
        if (isEqual(item?.id, id)) {
          return {
            ...item,
            [fieldName]:
              objectValue !== null && objectValue !== undefined
                ? objectValue
                : value,
          };
        }
        return item;
      });
      handleChangeSingleField({
        fieldName: "goodPrices",
        errorName: fieldNameError,
      })(goodPricesEdit);
    },
    [handleChangeSingleField, model?.goodPrices]
  );

  const columns: ColumnProps<GoodPriceByCategory>[] = useMemo(
    () => [
      {
        title: (
          <div className={classNames("p-l--md")}>
            {translate("PL.goods_services_label")}
          </div>
        ),
        ellipsis: true,
        width: 240,
        key: "name",
        dataIndex: "name",
        render: (_, record) => {
          if (record?.isTotal) {
            return (
              <LayoutCell className="m-l--sm">
                <OneLineText
                  useTooltip
                  value={translate("PR.size_type_goods_services", {
                    size: size(model?.goodPrices),
                  })}
                />
              </LayoutCell>
            );
          }
          if (!isEmpty(record?.children)) {
            return (
              <LayoutCell className="data-with-collapse">
                <OneLineText
                  useTooltip
                  className="collapse_text"
                  value={record?.category?.name}
                />
              </LayoutCell>
            );
          }

          return (
            <LayoutCell className="data-with-collapse m-l--3xs">
              <TwoLineText
                classNameFirstLine="first_line_style"
                classNameSecondLine="text-second__style"
                valueLine1={record?.goodsItem?.name}
                valueLine2={record?.goodsItem?.code}
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.description_goods_service_header_table"),
        ellipsis: true,
        width: 220,
        key: "description",
        dataIndex: "description",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.description} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.unit_label"),
        ellipsis: true,
        width: 90,
        key: "unit",
        dataIndex: "unit",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.goodsItem?.unit?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchase_quantity_label"),
        ellipsis: true,
        width: 112,
        key: "supplyQuantityUser",
        dataIndex: "supplyQuantityUser",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          const maxQuantity = min([
            record?.supplyQuantity || 0,
            record?.goodsItem?.originalQuantity || 0,
          ]);

          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `goodsPrices[${record?.indexBeforeValidate}].supplyQuantityUser`
                )}
              >
                <InputNumber
                  isTableCell
                  isRequired
                  value={record?.supplyQuantityUser}
                  onChange={(value: number) => {
                    handleChangeItemTable(
                      "supplyQuantityUser",
                      value,
                      null,
                      record.id,
                      `goodsPrices[${record?.indexBeforeValidate}].supplyQuantityUser`
                    );
                  }}
                  isShowTooltip
                  numberType="DECIMAL"
                  allowClear={false}
                  max={maxQuantity}
                  isInputRight
                  translate={translate}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.supply_quantity_label"),
        ellipsis: true,
        width: 142,
        key: "supplyQuantity",
        dataIndex: "supplyQuantity",
        render: (supplyQuantity, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell position="right">
              <OneLineText
                useTooltip
                value={formatNumber(supplyQuantity || 0)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.unit_price_label")}
            className="align-items-end"
            unit={currencyCode}
          />
        ),
        ellipsis: true,
        width: 140,
        key: "currency",
        dataIndex: "currency",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={formatNumber(record?.price)} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.amount_label")}
            className="align-items-end"
            unit={currencyCode}
          />
        ),
        ellipsis: true,
        width: 155,
        key: "amount",
        dataIndex: "amount",
        render: (_, record) => {
          if (record?.isTotal) {
            const amount = round(
              calculateTotal(convertDataByCategory, "amount"),
              isEqual(currencyCode, VIETNAMESE_CURRENCY) ? 0 : 2
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(amount)}
                />
              </LayoutCell>
            );
          } else if (!isEmpty(record?.children)) {
            const childTotal = round(
              calculateTotal(record.children, "amount"),
              isEqual(currencyCode, VIETNAMESE_CURRENCY) ? 0 : 2
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(childTotal)}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText useTooltip value={formatNumber(record.amount)} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.tax_type_label"),
        ellipsis: true,
        width: 100,
        key: "taxType",
        dataIndex: "taxType",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.tax?.name} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.tax_label")}
            className="align-items-end"
            unit={currencyCode}
          />
        ),
        ellipsis: true,
        width: 160,
        key: "taxAmountQuotation",
        dataIndex: "taxAmountQuotation",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalTax = round(
              calculateTotal(convertDataByCategory, "totalTax"),
              isEqual(currencyCode, VIETNAMESE_CURRENCY) ? 0 : 4
            );

            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(totalTax)}
                />
              </LayoutCell>
            );
          } else if (!isEmpty(record?.children)) {
            const childTotal = round(
              calculateTotal(record.children, "taxAmountQuotation"),
              isEqual(currencyCode, VIETNAMESE_CURRENCY) ? 0 : 4
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(childTotal)}
                />
              </LayoutCell>
            );
          }
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell position="right">
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `goodsPrices[${record?.indexBeforeValidate}].taxAmountQuotation`
                )}
              >
                <InputNumber
                  isTableCell
                  isRequired
                  value={record?.taxAmountQuotation}
                  onChange={(value: number) => {
                    handleChangeItemTable(
                      "taxAmountQuotation",
                      value,
                      null,
                      record.id,
                      `goodsPrices[${record?.indexBeforeValidate}].taxAmountQuotation`
                    );
                  }}
                  isShowTooltip
                  allowClear={false}
                  isInputRight
                  numberType={
                    isEqual(currencyCode, VIETNAMESE_CURRENCY) ||
                    isEqual(currencyCode, JPY_CURRENCY)
                      ? undefined
                      : "DECIMAL"
                  }
                  allowNegative
                  max={NUMBER_MAX_13}
                />
              </FormItem>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.total_amount_label")}
            className="align-items-end"
            unit={currencyCode}
          />
        ),
        ellipsis: true,
        width: 155,
        key: "totalAmount",
        dataIndex: "totalAmount",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalAmount = round(
              calculateTotal(convertDataByCategory, "totalAmount"),
              isEqual(currencyCode, VIETNAMESE_CURRENCY) ? 0 : 4
            );

            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(totalAmount)}
                />
              </LayoutCell>
            );
          } else if (!isEmpty(record?.children)) {
            const childTotal = round(
              calculateTotal(record.children, "totalAmount"),
              isEqual(currencyCode, VIETNAMESE_CURRENCY) ? 0 : 4
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(childTotal)}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                useTooltip
                value={formatNumber(record.totalAmount)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.total_converted_amount_label")}
            className="align-items-end"
            unit={VIETNAMESE_CURRENCY}
          />
        ),
        hidden: isEqual(currencyCode, VIETNAMESE_CURRENCY),
        ellipsis: true,
        width: 155,
        key: "totalConvertedAmount",
        dataIndex: "totalConvertedAmount",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalConvertedAmount = convertToVNDCurrency(
              calculateTotal(convertDataByCategory, "totalAmount") *
                biddingExchangeRate
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(totalConvertedAmount)}
                />
              </LayoutCell>
            );
          } else if (!isEmpty(record?.children)) {
            const childTotalConvertedAmount = calculateTotal(
              record.children,
              "totalConvertedAmount"
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(childTotalConvertedAmount)}
                />
              </LayoutCell>
            );
          }
          return (
            <LayoutCell position="right">
              <OneLineText
                useTooltip
                value={formatNumber(record.totalConvertedAmount)}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.brand_category_label"),
        ellipsis: true,
        width: 130,
        key: "manufacturer",
        dataIndex: "manufacturer",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText
                useTooltip
                value={record?.goodsItem?.manufacturer?.name}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.note_label"),
        ellipsis: true,
        width: 220,
        key: "note",
        dataIndex: "note",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <OneLineText useTooltip value={record?.note} />
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: "action",
        dataIndex: "action",
        width: 40,
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <div className="payment-trash_icon cursor-pointer btn">
                <TrashCan
                  size={20}
                  onClick={() => {
                    setSelectedRowKey(record?.id);
                    setOpenModalConfirmDelete(true);
                  }}
                />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [
      translate,
      currencyCode,
      model,
      convertDataByCategory,
      biddingExchangeRate,
      handleChangeItemTable,
    ]
  );

  const rowSelections: TableRowSelection<GoodPriceByCategory> = {
    ...rowSelection,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRow(
        selectedRows.filter(
          (item) => item?.id && isUndefined(item?.category?.id)
        )
      );
    },
    renderCell: (value: boolean, record: GoodPriceByCategory) => {
      return (
        <div
          className={`${
            record?.isTotal ? "d-none" : "d-flex"
          } justify-content-center align-items-center`}
        >
          <Checkbox
            readOnly={record?.isTotal}
            checked={value}
            onChange={(e) => {
              if (!record?.children || record.children.length === 0) {
                const lsIdSelected = e
                  ? [...selectedRowKeys, record?.id]
                  : difference(selectedRowKeys, [record?.id]);

                const parent = convertDataByCategory.find(
                  (item: GoodPriceByCategory) =>
                    item?.children?.some((child) => child.id === record?.id)
                );

                if (
                  parent?.children?.every((child: GoodsPrice) =>
                    lsIdSelected.includes(child.id)
                  )
                ) {
                  setSelectedRowKeys([...lsIdSelected, parent?.id]);
                } else {
                  const checkParentSelected = selectedRowKeys.includes(
                    parent?.id
                  );
                  setSelectedRowKeys(
                    checkParentSelected
                      ? difference(lsIdSelected, [parent.id])
                      : lsIdSelected
                  );
                }
              } else {
                const idChildSelected = record.children.map(
                  (child) => child.id
                );
                if (e) {
                  setSelectedRowKeys([
                    ...selectedRowKeys,
                    ...idChildSelected,
                    record?.id,
                  ]);
                } else {
                  setSelectedRowKeys(
                    difference(selectedRowKeys, [
                      ...idChildSelected,
                      record?.id,
                    ])
                  );
                }
              }
            }}
          />
        </div>
      );
    },
  };

  const expandable: ExpandableConfig<GoodPriceByCategory> = {
    expandIcon: ({ expanded, onExpand, record }) => {
      if (isEmpty(record?.children)) {
        return null;
      }

      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onExpand(record, e);
          }}
        >
          <img
            className={classNames("cursor-pointer m-x--3xs", {
              "rotate-180": expanded,
              "rotate-0": !expanded,
            })}
            src={IcArrowDown}
            alt="expand-icon"
            width={10}
            height={10}
          />
        </div>
      );
    },
  };

  return (
    <div className="goods_service_table">
      <ActionBarComponent
        selectedRowKeys={model?.goodPrices
          ?.filter((item: GoodsPrice) => selectedRowKeys?.includes(item?.id))
          ?.map((item: GoodsPrice) => item?.id)}
        setSelectedRowKeys={
          setSelectedRowKeys as Dispatch<SetStateAction<Key[]>>
        }
      >
        <Button
          type="secondary"
          size="sm"
          onClick={() => {
            setOpenModalConfirmDelete(true);
          }}
        >
          {translate("CL.delete_btn")}
        </Button>
      </ActionBarComponent>
      <StandardTable
        rowKey="id"
        idContainer="goods-service-table"
        isDragable
        columns={columns}
        dataSource={[
          {
            isTotal: true,
          },
          ...convertDataByCategory,
        ]}
        scroll={{ y: "calc(100vh - 320px)" }}
        rowSelection={rowSelections}
        expandable={expandable}
        rowClassName={(record) => {
          return record?.isTotal ? "total-row" : "";
        }}
      />
      <ModalConfirm
        open={openModalConfirmDelete}
        icon={
          <img src={DeleteRoundIcon} alt="delete-icon" width={72} height={72} />
        }
        title={translate("PR.confirm_delete_goods_services")}
        content={translate("PR.delete_warning")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          let remaining = [];

          if (selectedRowKey) {
            remaining = model?.goodPrices?.filter(
              (item: GoodsPrice) => !isEqual(selectedRowKey, item?.id)
            );
            setSelectedRowKey(undefined);
          }

          if (!isEmpty(selectedRowKeys)) {
            remaining = model?.goodPrices?.filter(
              (item: GoodsPrice) => !selectedRowKeys.includes(item?.id)
            );
            setSelectedRowKeys([]);
          }

          handleChangeSingleField({ fieldName: "goodPrices" })(remaining);

          setOpenModalConfirmDelete(false);
        }}
        handleCancel={() => setOpenModalConfirmDelete(false)}
      />
    </div>
  );
};

export default GoodsServiceTable;
