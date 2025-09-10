import type { ColumnProps } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { IcTrashRed } from "assets/icons";
import classNames from "classnames";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import { ExpandIcon } from "components/TableCustom/ExpandIcon";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { formatCurrency, formatNumber } from "core/helpers/number";
import { GeneralAction } from "core/services/service-types";
import {
  isBoolean,
  isEmpty,
  isEqual,
  isNaN,
  isNil,
  isUndefined,
  size,
  uniq,
} from "lodash";
import { OptionBaseModel } from "models/Common/Common";
import { SelectAdjustableGoodsServicesModel } from "models/ContractAnnex";
import { DeleteRecordModal } from "pages/Catalog/DeleteRecord/DeleteRecordModal";
import { Dispatch } from "react";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
} from "react-components-design-system";

import styles from "./GoodsService.module.scss";
import useGoodsServiceHooks from "./GoodsServiceHooks";
import { VND_CURRENCY_UNIT } from "core/config/consts";
import { TypeAction } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/ContractTerms/ContractTermsHooks";
import { AddButton } from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/GeneralInformation/Components/AddButton";
import { ContractAdjustmentModel } from "models/ContractAdjustment/ContractAdjustmentModel";
import SelectAdjustableGoodsServicesModal from "../SelectAdjustableGoodsServices/SelectAdjustableGoodsServices";
import { GoodsServiceDetailDrawer } from "./GoodsServiceDetail/GoodsServiceDetailDrawer";

interface GoodsServiceProps<T> {
  isEdit?: boolean;
  model?: T | any;
  dispatch?: Dispatch<GeneralAction<ContractAdjustmentModel>>;
}

export default function GoodsService<T>({
  isEdit,
  model,
  dispatch,
}: GoodsServiceProps<T>) {
  const {
    translate,
    isContract,
    currency,
    data,
    typeAction,
    rowSelection,
    selectedRowKeys,
    goodItemIdSelected,
    handleAction,
    handleClose,
    handleDeleteGoodServices,
    setSelectedRowKeys,
    isTotalRow,
    setIsContract,
    handleAddGoodService,
    handleCloseGoodsServiceModal,
    handleOpenGoodsServiceModal,
    currentGoodsServices,
    isOpenModal,
    handleChangeSingleFieldGoodsService,
    handleChangeSelectFieldGoodsService,
    handleChangeAllFieldGoodsService,
    indexGoodService,
  } = useGoodsServiceHooks<T>({ model, onDispatch: dispatch });

  const columns: ColumnProps<SelectAdjustableGoodsServicesModel>[] = [
    {
      key: "id",
      width: 40,
      fixed: "left",
      hidden: !isEdit,
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_goods_services")}
          className={styles["unit--hidden"]}
        />
      ),
      dataIndex: "name",
      key: "name",
      width: 220,
      fixed: "left",
      render: (value: string, record, index: number) => {
        const isTotal = isTotalRow(record);

        if (!isEdit && !isUndefined(record?.children)) {
          return null;
        }

        return (
          <LayoutCell>
            <div
              className={classNames(
                {
                  "w-100": isUndefined(record?.id) || isNaN(Number(record?.id)),
                },
                {
                  [styles["padding-row"]]:
                    (isUndefined(record?.id) || isNaN(Number(record?.id))) &&
                    !isEdit,
                },
                "d-flex flex-column"
              )}
            >
              <div
                onClick={() =>
                  !isTotal && handleOpenGoodsServiceModal(record, index)
                }
              >
                <OneLineText
                  className={classNames({
                    [styles["text-blue"]]: !isTotal,
                    "font-bold": isTotal && !isUndefined(record?.id),
                  })}
                  value={value}
                />
              </div>
              <OneLineText
                className={styles["text-gray"]}
                value={record?.code}
              />
            </div>
          </LayoutCell>
        );
      },
    },

    {
      title: (
        <UnitTitle
          title={translate("RG.txt_goods_description")}
          className={styles["unit--hidden"]}
        />
      ),
      dataIndex: "description",
      key: "description",
      width: 200,
      render: (value: string) => {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_unit_of_measure")}
          className={styles["unit--hidden"]}
        />
      ),
      dataIndex: "goodUnit",
      key: "goodUnit",
      width: 90,
      render: (unit: OptionBaseModel) => {
        return (
          <LayoutCell>
            <OneLineText value={unit?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("CT.quantity")}
          className={classNames("text-end", styles["unit--hidden"])}
        />
      ),
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      render(quantity: number, record) {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold": isTotalRow(record),
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
          title={translate("RG.txt_unit_price")}
          unit={currency}
          className="text-end"
        />
      ),
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 145,
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
          title={translate("RG.txt_amount_due")}
          unit={currency}
          className="text-end"
        />
      ),
      dataIndex: "amount",
      key: "amount",
      width: 145,
      render(value: number, record) {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold": isTotalRow(record),
              })}
              value={formatNumber(value)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_tax_rate")}
          className={classNames("text-end", styles["unit--hidden"])}
        />
      ),
      dataIndex: "taxModel",
      key: "taxModel",
      width: 145,
      render(value: OptionBaseModel, record) {
        return (
          <LayoutCell position="right">
            <OneLineText
              value={value?.name}
              className={classNames({
                "font-bold": isTotalRow(record),
              })}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_tax")}
          unit={currency}
          className="text-end"
        />
      ),
      dataIndex: "taxAmount",
      key: "taxAmount",
      width: 145,
      render(value: number, record) {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold": isTotalRow(record),
              })}
              value={formatNumber(value)}
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
      width: 152,
      render(value: number, record) {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold": isTotalRow(record),
              })}
              value={formatNumber(value)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_total_converted_amount")}
          className="text-end"
        />
      ),
      dataIndex: "totalAmountConvert",
      key: "totalAmountConvert",
      width: 152,
      render(value: number, record) {
        return (
          <LayoutCell position="right">
            <OneLineText
              className={classNames({
                "font-bold": isTotalRow(record),
              })}
              value={formatCurrency({
                value,
              })}
            />
          </LayoutCell>
        );
      },
      hidden: isEqual(currency, VND_CURRENCY_UNIT),
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_brand_type")}
          className={styles["unit--hidden"]}
        />
      ),
      dataIndex: "goodBranch",
      key: "goodBranch",
      width: 160,
      render: (value: OptionBaseModel) => {
        return (
          <LayoutCell>
            <OneLineText value={value?.name} />
          </LayoutCell>
        );
      },
    },
    {
      title: (
        <UnitTitle
          title={translate("RG.txt_notes")}
          className={styles["unit--hidden"]}
        />
      ),
      dataIndex: "note",
      key: "note",
      width: 200,
      render(note: string) {
        return (
          <LayoutCell>
            <OneLineText value={note} />
          </LayoutCell>
        );
      },
    },
    {
      key: "id",
      width: 46,
      fixed: "right",
      render(record) {
        if (
          isNil(record?.purchaseItemId) &&
          isNil(record?.contractGoodsItemId)
        ) {
          return;
        }

        return (
          <LayoutCell>
            <div className="action-row">
              <button
                onClick={() => handleAction(TypeAction.DELETE, record?.id)}
              >
                <img src={IcTrashRed} alt="" />
              </button>
            </div>
          </LayoutCell>
        );
      },
      hidden: !isEdit,
    },
  ];

  const addGoodServices = () => {
    if (!isEdit) return;

    return (
      <div className="d-flex gap-2">
        <AddButton
          title={translate("CA.btn_add_goods")}
          onClick={() => setIsContract(false)}
        />
        <AddButton
          title={translate("CA.btn_select_goods")}
          onClick={() => setIsContract(true)}
        />
      </div>
    );
  };

  const handleHiddenCheckbox = (record: SelectAdjustableGoodsServicesModel) => {
    if (isNil(record?.id)) return true;

    if (isTotalRow(record)) {
      const children = record?.children as SelectAdjustableGoodsServicesModel[];
      const listPurchases = children?.filter((goodServices) =>
        isNil(goodServices?.purchaseItemId)
      );

      if (size(listPurchases) === size(children)) {
        return true;
      }
    }

    return false;
  };

  const rowSelections: TableRowSelection<SelectAdjustableGoodsServicesModel> = {
    ...rowSelection,
    renderCell: (_: boolean, record, __: number, originNode) => {
      const idHidden = handleHiddenCheckbox(record);
      if (idHidden) return <></>;

      return originNode;
    },
    getCheckboxProps: (record) => {
      const idHidden = handleHiddenCheckbox(record);

      return {
        disabled: idHidden,
      };
    },
    onSelectAll: (
      selected: boolean,
      selectedRows: SelectAdjustableGoodsServicesModel[]
    ) => {
      let selectedRowKeys: string[] = [];
      if (selected) {
        selectedRowKeys = selectedRows.map((row) => row?.id);
      }
      setSelectedRowKeys(uniq(selectedRowKeys));
    },
    onChange: () => null,
    onSelect: (
      record: SelectAdjustableGoodsServicesModel,
      selected: boolean,
      selectedRows: SelectAdjustableGoodsServicesModel[]
    ) => {
      const children: SelectAdjustableGoodsServicesModel[] =
        record?.children?.filter((item: any) => !isNil(item?.purchaseItemId));
      let newSelectedRowKeys: string[] = selectedRows.map((row) => row?.id);

      const selectedRowKeysChildren = children?.map(
        (item: SelectAdjustableGoodsServicesModel) => item?.id
      );
      if (children) {
        if (selected) {
          newSelectedRowKeys = [
            ...selectedRowKeysChildren,
            ...newSelectedRowKeys,
          ];
        } else {
          selectedRows.forEach((item) => {
            const rowId = item?.id;

            if (!selectedRowKeysChildren.includes(rowId)) {
              newSelectedRowKeys.push(rowId);
            }
          });

          const childrenIds = children.map((row) => row?.id);
          newSelectedRowKeys = newSelectedRowKeys.filter(
            (newSelectedRowKey) => !childrenIds.includes(newSelectedRowKey)
          );
        }
      } else {
        const rowId = record?.id;

        const parent = data?.find(
          (item) =>
            !isEmpty(
              item?.children?.filter(
                (goodService: SelectAdjustableGoodsServicesModel) =>
                  isEqual(rowId, goodService?.id)
              )
            )
        );

        let childrenIdsFromParent: string[] = parent?.children?.map(
          (goodService: SelectAdjustableGoodsServicesModel) => goodService?.id
        );

        const hasSelectedInParent = newSelectedRowKeys.filter((selectedId) =>
          childrenIdsFromParent.includes(selectedId)
        );

        if (!selected) {
          childrenIdsFromParent = childrenIdsFromParent?.filter(
            (id) => !isEqual(rowId, id)
          );

          if (isEmpty(childrenIdsFromParent)) {
            newSelectedRowKeys = newSelectedRowKeys.filter(
              (newSelectedRowKey) => !isEqual(newSelectedRowKey, parent?.id)
            );
          }

          if (size(parent?.children) > size(hasSelectedInParent)) {
            newSelectedRowKeys = newSelectedRowKeys.filter(
              (newSelectedRowKey) => !isEqual(newSelectedRowKey, parent?.id)
            );
          }
        } else {
          const hasCategory = newSelectedRowKeys.findIndex(
            (newSelectedRowKey) => isEqual(newSelectedRowKey, parent?.id)
          );

          if (
            size(parent?.children) === size(hasSelectedInParent) &&
            hasCategory < 0
          ) {
            newSelectedRowKeys.push(parent?.id);
          }
        }
      }

      setSelectedRowKeys(uniq(newSelectedRowKeys));
      return;
    },
  };

  return (
    <>
      <TableWithEmpty
        list={data}
        columns={columns}
        idContainer={"good-service-container"}
        scroll={{ y: "calc(100vh - 300px)" }}
        isDragable={true}
        actionBarComponent={
          <>
            {addGoodServices()}
            <div className="mt-2">
              <ActionBarComponent
                selectedRowKeys={selectedRowKeys?.filter(
                  (key) => (key as string)?.split("_")?.[1]
                )}
                setSelectedRowKeys={setSelectedRowKeys}
              >
                <Button
                  type="secondary"
                  size="sm"
                  onClick={() => handleAction(TypeAction.DELETE, null)}
                >
                  {translate("CM.txt_delete")}
                </Button>
              </ActionBarComponent>
            </div>
          </>
        }
        rowSelection={isEdit ? rowSelections : undefined}
        emptyExtra={
          <CloudyEmpty content={translate("CA.msg_empty_data_in_system")}>
            {addGoodServices()}
          </CloudyEmpty>
        }
        className={styles["goods-service"]}
        rowClassName={(record) => {
          return classNames({
            "bg-gray": isUndefined(record?.id),
          });
        }}
        expandable={{
          expandIcon: (props) => (
            <ExpandIcon
              {...props}
              iconClassName="collapse-icon ps-2"
              renderTitleExpandable={({ record }) => {
                const isTotal = isTotalRow(record);
                if (isEdit && isTotal) return null;

                return <OneLineText value={record?.name} />;
              }}
              renderCondition={({ record }) => !isTotalRow(record)}
            />
          ),
        }}
      />
      <GoodsServiceDetailDrawer
        onClose={handleCloseGoodsServiceModal}
        handleChangeSingleFieldGoodsService={
          handleChangeSingleFieldGoodsService
        }
        handleChangeSelectFieldGoodsService={
          handleChangeSelectFieldGoodsService
        }
        handleDeleteGoodServices={handleDeleteGoodServices}
        handleAction={handleAction}
        handleChangeAllFieldGoodsService={handleChangeAllFieldGoodsService}
        model={model}
        currentItem={currentGoodsServices}
        visible={isOpenModal}
        dispatch={dispatch as any}
        isView={model?.isView}
        index={indexGoodService}
      />
      {isBoolean(isContract) && (
        <SelectAdjustableGoodsServicesModal
          isContract={isContract}
          contractId={model?.contract?.contractId}
          onClose={() => setIsContract(null)}
          onSelected={handleAddGoodService}
          selectedFilter={goodItemIdSelected}
        />
      )}
      {isEqual(typeAction, TypeAction.DELETE) && (
        <DeleteRecordModal
          handleCancel={handleClose}
          handleConfirm={handleDeleteGoodServices}
          title={translate(
            "contractAdjustment.purchasing_plan_confirm_delete_goods_services_row"
          )}
          content={translate(
            "contractAdjustment.purchasing_plan_confirm_delete_goods_services_row_warning"
          )}
          loading={false}
          open
        />
      )}
    </>
  );
}
