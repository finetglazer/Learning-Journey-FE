import { Download } from "@carbon/icons-react";
import type { ColumnProps } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { IcTrashRed, Import, PlusIcon } from "assets/icons";
import TrashSvg from "assets/icons/CostLine/ic_trash.svg";
import classNames from "classnames";
import { ExpandIcon } from "components/TableCustom/ExpandIcon";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { sumWithFixed, toFixedNumber } from "core/helpers/calculator";
import { formatNumber } from "core/helpers/number";
import {
  difference,
  isEmpty,
  isEqual,
  isNaN,
  isUndefined,
  lt,
  uniq,
  uniqBy,
} from "lodash";
import {
  BaseModel,
  ContractGoodsItem,
  GoodsInfo,
  GoodsReceiptRequestItem,
} from "models/ReceivingGood/GoodsReceipt";
import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { useCallback, useMemo, useRef } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { ReceivingGoodsDetailDrawer } from "../../../ReceivingGoodsDetailDrawer/ReceivingGoodsDetailDrawer/ReceivingGoodsDetailDrawer";
import { ReceivingGoodsSelectModal } from "../../../ReceivingGoodsModal/ReceivingGoodsSelect/ReceivingGoodsSelect";
import "./DetailsReceiptInformation.scss";
import {
  ReceiptModal,
  useDetailsReceiptInformationHooks,
} from "./DetailsReceiptInformationHooks";

export const DetailsReceiptInformation = () => {
  const {
    model,
    state,
    setGoodsReceiptIdSelect,
    handleChangeSingleField,
    isEditable,
    modalType,
    setModalType,
  } = useReceivingGoodsDetailContext();
  const {
    modal,
    translate,
    setModal,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    setSelectedRow,
    selectedRow,
  } = useDetailsReceiptInformationHooks();

  const goodsReceiptIdsSelected = useRef<string[]>([]);

  const handleConfirmDelete = useCallback(
    (goodsReceiptIdSelect: string[]) => {
      goodsReceiptIdsSelected.current = goodsReceiptIdSelect;
      setModalType({ type: "DELETE" });
    },
    [setModalType]
  );

  const handleDelete = useCallback(() => {
    const newGoodsReceiptRequestItems = model?.goodsReceiptRequestItems?.filter(
      (item) => {
        return !goodsReceiptIdsSelected.current.includes(item?.id);
      }
    );

    handleChangeSingleField({ fieldName: "goodsReceiptRequestItems" })(
      newGoodsReceiptRequestItems
    );

    const filterSelectedRowKeys = selectedRowKeys.filter((id) =>
      newGoodsReceiptRequestItems.find((item) => isEqual(item?.id, id))
    );

    setModalType({ type: "NONE" });
    setSelectedRowKeys(filterSelectedRowKeys);
  }, [
    model?.goodsReceiptRequestItems,
    handleChangeSingleField,
    selectedRowKeys,
    setModalType,
    setSelectedRowKeys,
  ]);

  const handleClose = useCallback(() => {
    setModalType({ type: "NONE" });
    goodsReceiptIdsSelected.current = [];
  }, [setModalType]);

  const handleAddGoodsReceipt = ({
    goodsReceiptSelects,
  }: {
    goodsReceiptSelects: GoodsReceiptRequestItem[];
  }) => {
    const list = goodsReceiptSelects.filter(
      (goodsReceiptSelect) =>
        !model?.goodsReceiptRequestItems?.find((item) =>
          isEqual(item.id, goodsReceiptSelect?.id)
        )
    );

    handleChangeSingleField({
      fieldName: "goodsReceiptRequestItems",
    })([...list, ...(model?.goodsReceiptRequestItems || [])]);
    setModal(null);
  };

  const currency = useMemo(() => model?.currency, [model]);

  const isTotalRow = useCallback((contractGoodsItem: ContractGoodsItem) => {
    return isUndefined(
      contractGoodsItem?.goodsInfo?.goodsServicesCategory?.name
    );
  }, []);

  const columns: ColumnProps<GoodsReceiptRequestItem>[] = [
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_goods_services")}
          className="unit--hidden"
        />
      ),
      dataIndex: "contractGoodsItem",
      key: "contractGoodsItem",
      width: 300,
      fixed: "left",
      render: (contractGoodsItem: ContractGoodsItem, record) => {
        if (!isUndefined(record?.children)) {
          return null;
        }
        return (
          <LayoutCell className="received-good__first">
            <div
              className={classNames(
                {
                  "view-row":
                    !isUndefined(record?.id) && isNaN(Number(record?.id)),
                },
                "d-flex flex-column"
              )}
            >
              <div
                onClick={() => {
                  !isTotalRow(contractGoodsItem) &&
                    setGoodsReceiptIdSelect(record?.id);
                }}
              >
                <OneLineText
                  className={classNames({
                    "text-blue": !isTotalRow(contractGoodsItem),
                    "font-bold": isTotalRow(contractGoodsItem),
                    "total-ml": isTotalRow(contractGoodsItem),
                  })}
                  value={contractGoodsItem?.goodsInfo?.name}
                />
              </div>
              <OneLineText
                className="total_code"
                value={contractGoodsItem?.goodsInfo?.code}
              />
            </div>
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_moving_service_good")}
          className="unit--hidden"
        />
      ),
      width: 240,
      dataIndex: "contractGoodsItem",
      key: "contractGoodsItem",
      render(contractGoodsItem: ContractGoodsItem) {
        return (
          <LayoutCell>
            <OneLineText value={contractGoodsItem?.description} />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_brand_type")}
          className="unit--hidden"
        />
      ),
      width: 160,
      dataIndex: "contractGoodsItem",
      key: "contractGoodsItem",
      render(contractGoodsItem: ContractGoodsItem) {
        return (
          <LayoutCell>
            <OneLineText value={contractGoodsItem?.manufacturerInfo?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_unit_of_measure")}
          className="unit--hidden"
        />
      ),
      dataIndex: "contractGoodsItem",
      key: "contractGoodsItem",
      width: 100,
      render: (contractGoodsItem: ContractGoodsItem) => {
        return (
          <LayoutCell>
            <OneLineText value={contractGoodsItem?.unitInfo?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_quantity_contract")}
          className="text-end unit--hidden"
        />
      ),
      dataIndex: "qualityByContract",
      key: "qualityByContract",
      width: 135,
      render: (qualityByContract: number, record, index) => {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold":
                  isEqual(index, 0) && isTotalRow(record?.contractGoodsItem),
                "font-bold__child": isTotalRow(record?.contractGoodsItem),
              })}
              value={formatNumber(qualityByContract)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_actual_quantity_received_short")}
          className="unit--hidden text-end"
        />
      ),
      dataIndex: "quantity",
      key: "quantity",
      width: 110,
      render(quantity: number, record, index) {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold":
                  isEqual(index, 0) && isTotalRow(record?.contractGoodsItem),
                "font-bold__child": isTotalRow(record?.contractGoodsItem),
              })}
              value={formatNumber(quantity)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_received_quantity")}
          className="unit--hidden text-end"
        />
      ),
      dataIndex: "alreadyReceivedQuantity",
      key: "alreadyReceivedQuantity",
      width: 110,
      render(alreadyReceivedQuantity: number, record, index) {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold":
                  isEqual(index, 0) && isTotalRow(record?.contractGoodsItem),
                "font-bold__child": isTotalRow(record?.contractGoodsItem),
              })}
              value={formatNumber(alreadyReceivedQuantity)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_remaining_quantity_short")}
          className="unit--hidden text-end"
        />
      ),
      dataIndex: "remainingQuantity",
      key: "remainingQuantity",
      width: 110,
      render: (remainingQuantity: number, record, index) => {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold":
                  isEqual(index, 0) && isTotalRow(record?.contractGoodsItem),
                "font-bold__child": isTotalRow(record?.contractGoodsItem),
              })}
              value={formatNumber(remainingQuantity)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_unit_price")}
          unit={currency}
          className="text-end"
        />
      ),
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 145,
      render(unitPrice: number, record, index) {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold":
                  isEqual(index, 0) && isTotalRow(record?.contractGoodsItem),
                "font-bold__child": isTotalRow(record?.contractGoodsItem),
              })}
              value={formatNumber(unitPrice)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_amount_due")}
          unit={currency}
          className="text-end"
        />
      ),
      dataIndex: "amountBeforeTax",
      key: "amountBeforeTax",
      width: 145,
      render(amountBeforeTax: number, record, index) {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold":
                  isEqual(index, 0) && isTotalRow(record?.contractGoodsItem),
                "font-bold__child": isTotalRow(record?.contractGoodsItem),
              })}
              value={formatNumber(amountBeforeTax)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_tax_rate")}
          className="unit--hidden text-end"
        />
      ),
      dataIndex: "contractGoodsItem",
      key: "contractGoodsItem",
      width: 145,
      render(contractGoodsItem: ContractGoodsItem) {
        const taxRate = contractGoodsItem?.taxInfo?.name;
        return (
          <LayoutCell position="right">
            <OneLineText value={taxRate} />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_tax_amount")}
          unit={currency}
          className="text-end"
        />
      ),
      dataIndex: "taxAmount",
      key: "taxAmount",
      width: 145,
      render(taxAmount: number, record, index) {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold":
                  isEqual(index, 0) && isTotalRow(record?.contractGoodsItem),
                "font-bold__child": isTotalRow(record?.contractGoodsItem),
              })}
              value={formatNumber(taxAmount)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_total_amount")}
          unit={currency}
          className="text-end"
        />
      ),
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 145,
      render(totalAmount: number, record, index) {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold":
                  isEqual(index, 0) && isTotalRow(record?.contractGoodsItem),
                "font-bold__child": isTotalRow(record?.contractGoodsItem),
              })}
              value={formatNumber(totalAmount)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_total_converted_amount")}
          unit="VND"
          className="text-end"
        />
      ),
      dataIndex: "convertedTotalAmount",
      key: "convertedTotalAmount",
      width: 145,
      render(convertedTotalAmount: number, record, index) {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold":
                  isEqual(index, 0) && isTotalRow(record?.contractGoodsItem),
                "font-bold__child": isTotalRow(record?.contractGoodsItem),
              })}
              value={formatNumber(convertedTotalAmount)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_receipt_notes")}
          className="unit--hidden"
        />
      ),
      dataIndex: "note",
      key: "note",
      width: 160,
      render(note: string) {
        return (
          <LayoutCell>
            <OneLineText value={note} />
          </LayoutCell>
        );
      },
    },
    {
      dataIndex: "id",
      key: "id",
      width: isEqual(isEditable, true) ? 40 : 0,
      render(id: string, record) {
        if (
          isTotalRow(record?.contractGoodsItem) ||
          isEqual(isEditable, false)
        ) {
          return;
        }
        return (
          <LayoutCell>
            <div className="action-row">
              <button onClick={() => handleConfirmDelete([id])}>
                <img src={IcTrashRed} alt="" />
              </button>
            </div>
          </LayoutCell>
        );
      },
    },
  ];

  const data = useMemo(() => {
    const list: GoodsReceiptRequestItem[] = [];

    model?.goodsReceiptRequestItems?.forEach(
      (goodsReceiptRequestItem, indexGoodReceipt) => {
        const goodsServicesCategory =
          goodsReceiptRequestItem?.contractGoodsItem?.goodsInfo
            ?.goodsServicesCategory;

        const index = list.findIndex((item) => {
          const idCategory =
            item?.contractGoodsItem?.goodsInfo?.goodsServicesCategory?.id;
          return isEqual(idCategory, goodsServicesCategory?.id);
        });

        const initGoodsReceiptRequest = {
          ...new GoodsReceiptRequestItem(),
          id: indexGoodReceipt.toString(),
          renderId: indexGoodReceipt.toString(),
          contractGoodsItem: {
            ...new ContractGoodsItem(),
            goodsInfo: {
              ...new GoodsInfo(),
              name: goodsServicesCategory?.name,
              goodsServicesCategory: {
                ...new BaseModel(),
                id: goodsServicesCategory?.id,
              },
            },
          },
          amountBeforeTax: goodsReceiptRequestItem?.amountBeforeTax ?? 0,
          totalAmount: goodsReceiptRequestItem?.totalAmount ?? 0,
          convertedTotalAmount:
            goodsReceiptRequestItem?.convertedTotalAmount ?? 0,
          taxAmount: goodsReceiptRequestItem?.taxAmount ?? 0,
          unitPrice: goodsReceiptRequestItem?.unitPrice ?? 0,
          qualityByContract: goodsReceiptRequestItem?.qualityByContract ?? 0,
          quantity: goodsReceiptRequestItem?.quantity ?? null,
          alreadyReceivedQuantity:
            goodsReceiptRequestItem?.alreadyReceivedQuantity ?? 0,
          remainingQuantity: goodsReceiptRequestItem?.remainingQuantity ?? 0,

          children: [
            {
              ...goodsReceiptRequestItem,
              parentId: indexGoodReceipt.toString(),
              quantity: goodsReceiptRequestItem?.quantity ?? null,
            },
          ],
        };

        if (lt(index, 0)) {
          list.push(initGoodsReceiptRequest);
        } else {
          const item = list?.[index];
          if (isUndefined(item)) return;
          list.splice(index, 1, {
            ...item,
            children: [
              ...item.children,
              {
                ...goodsReceiptRequestItem,
                parentId: index.toString(),
              },
            ],
            amountBeforeTax: sumWithFixed([
              goodsReceiptRequestItem?.amountBeforeTax,
              item?.amountBeforeTax,
            ]),
            totalAmount: sumWithFixed([
              goodsReceiptRequestItem?.totalAmount,
              item?.totalAmount,
            ]),

            taxAmount: sumWithFixed([
              goodsReceiptRequestItem?.taxAmount,
              item?.taxAmount,
            ]),
            qualityByContract: sumWithFixed([
              goodsReceiptRequestItem?.qualityByContract,
              item?.qualityByContract,
            ]),
            quantity: sumWithFixed([
              goodsReceiptRequestItem?.quantity,
              item?.quantity,
            ]),
            alreadyReceivedQuantity: sumWithFixed([
              goodsReceiptRequestItem?.alreadyReceivedQuantity,
              item?.alreadyReceivedQuantity,
            ]),
            remainingQuantity: sumWithFixed([
              goodsReceiptRequestItem?.remainingQuantity,
              item?.remainingQuantity,
            ]),
            unitPrice: sumWithFixed([
              goodsReceiptRequestItem?.unitPrice,
              item?.unitPrice,
            ]),
            convertedTotalAmount: toFixedNumber(
              goodsReceiptRequestItem?.convertedTotalAmount +
                item?.convertedTotalAmount,
              0
            ),
          });
        }
      }
    );

    const total = model?.goodsReceiptRequestItems?.reduce(
      (acc, item) => {
        return {
          ...acc,
          isTotal: true,
          alreadyReceivedQuantity: sumWithFixed([
            acc?.alreadyReceivedQuantity,
            item?.alreadyReceivedQuantity,
          ]),
          remainingQuantity: sumWithFixed([
            acc?.remainingQuantity,
            item?.remainingQuantity,
          ]),
          quantity: sumWithFixed([item?.quantity, acc?.quantity]),
          amountBeforeTax: sumWithFixed([
            acc?.amountBeforeTax,
            item?.amountBeforeTax,
          ]),
          totalAmount: sumWithFixed([acc?.totalAmount, item?.totalAmount]),
          convertedTotalAmount: toFixedNumber(
            acc?.convertedTotalAmount + item?.convertedTotalAmount,
            0
          ),
          taxAmount: toFixedNumber(acc?.taxAmount + item?.taxAmount),
          qualityByContract: sumWithFixed([
            acc?.qualityByContract,
            item?.qualityByContract,
          ]),
          unitPrice: sumWithFixed([acc?.unitPrice, item?.unitPrice]),
        };
      },
      {
        ...new GoodsReceiptRequestItem(),
        contractGoodsItem: {
          ...new ContractGoodsItem(),
          goodsInfo: {
            ...new GoodsInfo(),
            name: translate("BG.total"),
          },
        },
        amountBeforeTax: 0,
        totalAmount: 0,
        convertedTotalAmount: 0,
        taxAmount: 0,
        quantity: 0,
        alreadyReceivedQuantity: 0,
        remainingQuantity: 0,
        qualityByContract: 0,
        unitPrice: 0,
      }
    );

    if (isEmpty(list)) {
      return [];
    }

    return [total, ...list];
  }, [model, translate]);

  const rowSelections: TableRowSelection<GoodsReceiptRequestItem> = {
    ...rowSelection,
    getCheckboxProps: (record) => {
      const isDisabled =
        "isTotal" in record || (record as GoodsReceiptRequestItem)?.isTotal;

      return {
        disabled: isDisabled,
        skipGroup: "children" in record || "total" in record,
      };
    },
    renderCell: (value: boolean, record: GoodsReceiptRequestItem) => {
      const isDisabled =
        "isTotal" in record || (record as GoodsReceiptRequestItem)?.isTotal;

      const isIndeterminate =
        "children" in record &&
        record.children
          ?.filter((i: GoodsReceiptRequestItem) => !i?.isTotal)
          ?.some((item: GoodsReceiptRequestItem) =>
            selectedRowKeys.includes(item?.id)
          ) &&
        !record?.children
          ?.filter((i: GoodsReceiptRequestItem) => !i?.isTotal)
          ?.every((item: GoodsReceiptRequestItem) =>
            selectedRowKeys.includes(item?.id)
          );

      return (
        <div
          className={`${
            "isTotal" in record ? "d-none" : "d-flex"
          } justify-content-center align-items-center payment-height_40`}
        >
          <Checkbox
            indeterminate={isIndeterminate}
            disabled={isDisabled}
            readOnly={"isTotal" in record}
            checked={value}
            onChange={(e) => {
              const dataSource = data.slice(1);
              const parent = dataSource.find((item) => {
                if (item.isTotal) return record;
                if (
                  !record?.parentId &&
                  !!record.children &&
                  record.id === item.renderId
                ) {
                  return record;
                }
                return item.id === record?.parentId;
              });

              const listChild = parent?.children ?? [];
              const listIdChild = parent?.children?.map(
                (item: GoodsReceiptRequestItem) => item?.id
              );

              if (e) {
                if ("children" in record) {
                  setSelectedRowKeys(
                    uniq([...selectedRowKeys, ...listIdChild, record?.id])
                  );
                  setSelectedRow(uniqBy([...selectedRow, ...listChild], "id"));
                } else {
                  const isAllChillChecked = listChild.every(
                    (item: GoodsReceiptRequestItem) => {
                      return [...selectedRowKeys, record?.id].includes(
                        item?.id
                      );
                    }
                  );

                  if (isAllChillChecked) {
                    setSelectedRowKeys([
                      ...selectedRowKeys,
                      record?.id,
                      parent?.id,
                    ]);
                  } else {
                    setSelectedRowKeys([...selectedRowKeys, record?.id]);
                  }

                  setSelectedRow([...selectedRow, record]);
                }
              } else {
                if ("children" in record) {
                  setSelectedRowKeys(
                    difference(selectedRowKeys, [...listIdChild, record?.id])
                  );
                  setSelectedRow(difference(selectedRow, [...listChild]));
                } else {
                  setSelectedRowKeys(
                    difference(selectedRowKeys, [record?.id, parent?.id])
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

  const goodItemSelectCurrent = useMemo(
    () => model?.goodsReceiptRequestItems?.map((item) => item?.id),
    [model]
  );

  const selectedIds = useMemo(
    () => selectedRowKeys.filter((id) => !isUndefined(id) && isNaN(Number(id))),
    [selectedRowKeys]
  );

  return (
    <>
      <div className="receiving-goods">
        {isEqual(isEditable, true) ? (
          <div className="gap-3 d-flex">
            <Button
              icon={<img src={PlusIcon} alt="" />}
              iconPlace="left"
              type="secondary"
              onClick={() => setModal(ReceiptModal.LIST)}
            >
              {translate("RG.txt_add_receipt")}
            </Button>
            {isEqual(state, "CREATE") ? (
              <>
                <Button type="tertiary" icon={<Import />} iconPlace="left">
                  {translate("BG.upload")}
                </Button>
                <Button type="tertiary" icon={<Download />} iconPlace="left">
                  {translate("BG.download_template_file")}
                </Button>
              </>
            ) : null}
          </div>
        ) : null}
        <div>
          <ActionBarComponent
            selectedRowKeys={selectedIds}
            setSelectedRowKeys={setSelectedRowKeys}
          >
            <Button
              type="secondary"
              size="sm"
              onClick={() => handleConfirmDelete(selectedRowKeys as string[])}
            >
              {translate("CM.txt_delete")}
            </Button>
          </ActionBarComponent>

          <StandardTable
            rowKey="id"
            columns={columns}
            dataSource={data}
            scroll={{ x: 2380 }}
            rowSelection={isEqual(isEditable, true) ? rowSelections : undefined}
            rowClassName={(record) => {
              return classNames({
                "total-row": isUndefined(record?.id),
              });
            }}
            expandable={{
              expandIcon: (props) => (
                <ExpandIcon
                  {...props}
                  className={classNames({
                    "checked-editable-row": isEqual(isEditable, true),
                  })}
                  renderTitleExpandable={({ record }) => {
                    return (
                      <OneLineText
                        value={record?.contractGoodsItem?.goodsInfo?.name}
                      />
                    );
                  }}
                  renderCondition={({ record }) =>
                    !isTotalRow(record?.contractGoodsItem)
                  }
                />
              ),
            }}
          />
        </div>
      </div>

      <ModalConfirm
        open={modalType.type === "DELETE"}
        centered
        title={translate(
          "PL.purchasing_plan_confirm_delete_goods_services_row"
        )}
        titleButtonApply={translate("PM.confirm_btn")}
        titleButtonCancel={translate("CM.btn_close")}
        icon={<img src={TrashSvg} alt="" width={72} height={72} />}
        content={translate(
          "PL.purchasing_plan_confirm_delete_goods_services_row_warning"
        )}
        handleCancel={handleClose}
        handleSave={handleDelete}
      />
      {isEqual(ReceiptModal.LIST, modal) ? (
        <ReceivingGoodsSelectModal
          open
          contractId={model?.contractId}
          handleApply={handleAddGoodsReceipt}
          handleCancel={() => setModal(null)}
          goodItemSelectCurrent={goodItemSelectCurrent}
          selectedItems={goodItemSelectCurrent}
        />
      ) : null}

      <ReceivingGoodsDetailDrawer />
    </>
  );
};
