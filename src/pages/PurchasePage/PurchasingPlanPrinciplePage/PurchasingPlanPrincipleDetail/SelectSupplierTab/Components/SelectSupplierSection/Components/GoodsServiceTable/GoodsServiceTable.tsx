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
import { difference, isEmpty, isEqual, isUndefined, size } from "lodash";
import {
  GoodPriceByCategory,
  GoodsPrice,
  PurchasingPlanModel,
} from "models/PurchasingPlan";
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
import { VIETNAMESE_CURRENCY } from "../../SelectSupplierSection";
import "./GoodsServiceTable.scss";
import { calculateTotal, groupDataByCategory } from "./helpers";
import { PurchasingPlanPrincipleDetailHookContext } from "pages/PurchasePage/PurchasingPlanPrinciplePage/PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetailHook";

const GoodsServiceTable = () => {
  const { model, translate, handleChangeSingleField } =
    useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);

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
        title: translate("PL.description_label"),
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
        key: "supplyQuantity",
        dataIndex: "supplyQuantity",
        render: (_, record) => {
          if (record?.isTotal || !isEmpty(record?.children)) {
            return null;
          }

          return (
            <LayoutCell>
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `goodsPrices[${record?.indexBeforeValidate}].supplyQuantity`
                )}
              >
                <InputNumber
                  isTableCell
                  isRequired
                  value={record?.supplyQuantity}
                  onChange={(value: number) => {
                    handleChangeItemTable(
                      "supplyQuantity",
                      value,
                      null,
                      record.id,
                      `goodsPrices[${record?.indexBeforeValidate}].supplyQuantity`
                    );
                  }}
                  isShowTooltip
                  numberType="DECIMAL"
                  allowClear={false}
                  isInputRight
                />
              </FormItem>
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
            const amount = calculateTotal(convertDataByCategory, "amount");
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
            const childTotal = calculateTotal(record.children, "amount");
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
        key: "tax",
        dataIndex: "tax",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalTax = calculateTotal(convertDataByCategory, "totalTax");
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
            const childTotal = calculateTotal(record.children, "taxAmount");
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
                  `goodsPrices[${record?.indexBeforeValidate}].taxAmount`
                )}
              >
                <InputNumber
                  isTableCell
                  isRequired
                  value={record?.taxAmount}
                  onChange={(value: number) => {
                    handleChangeItemTable(
                      "taxAmount",
                      value,
                      null,
                      record.id,
                      `goodsPrices[${record?.indexBeforeValidate}].taxAmount`
                    );
                  }}
                  isShowTooltip
                  allowClear={false}
                  isInputRight
                  numberType={
                    isEqual(currencyCode, VIETNAMESE_CURRENCY)
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
            title={translate("PL.other_cost_label")}
            className="align-items-end"
            unit={currencyCode}
          />
        ),
        ellipsis: true,
        width: 160,
        height: 60,
        key: "otherCost",
        dataIndex: "otherCost",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalOtherCost = calculateTotal(
              convertDataByCategory,
              "totalOtherCost"
            );
            return (
              <LayoutCell position="right">
                <OneLineText
                  useTooltip
                  className="fw-semibold"
                  value={formatNumber(totalOtherCost)}
                />
              </LayoutCell>
            );
          } else if (!isEmpty(record?.children)) {
            const childTotal = calculateTotal(record.children, "otherCost");
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
              <FormItem
                isTableCell
                validateObject={utilService.getValidateObj(
                  model,
                  `goodsPrices[${record?.indexBeforeValidate}].otherCost`
                )}
              >
                <InputNumber
                  isTableCell
                  isRequired
                  value={record?.otherCost}
                  onChange={(value: number) => {
                    handleChangeItemTable(
                      "otherCost",
                      value,
                      null,
                      record.id,
                      `goodsPrices[${record?.indexBeforeValidate}].otherCost`
                    );
                  }}
                  isShowTooltip
                  allowClear={false}
                  isInputRight
                  numberType={
                    isEqual(currencyCode, VIETNAMESE_CURRENCY)
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
            const totalAmount = calculateTotal(
              convertDataByCategory,
              "totalAmount"
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
            const childTotal = calculateTotal(record.children, "totalAmount");
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
            unit={currencyCode}
          />
        ),
        hidden: isEqual(currencyCode, VIETNAMESE_CURRENCY),
        ellipsis: true,
        width: 155,
        key: "totalConvertedAmount",
        dataIndex: "totalConvertedAmount",
        render: (_, record) => {
          if (record?.isTotal) {
            const totalConvertedAmount = calculateTotal(
              convertDataByCategory,
              "totalConvertedAmount"
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
      model,
      currencyCode,
      convertDataByCategory,
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
