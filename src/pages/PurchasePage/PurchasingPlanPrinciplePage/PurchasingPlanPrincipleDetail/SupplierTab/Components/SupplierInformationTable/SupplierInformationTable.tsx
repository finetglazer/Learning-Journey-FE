import { ColumnProps } from "antd/lib/table";
import { AxiosError } from "axios";
import { isEmpty } from "lodash";
import React, { useContext } from "react";
import { finalize } from "rxjs";

import { AddIcon, emptyIcon, TrashIcon, TrashRoundIcon } from "assets/icons";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { TABLE_ROW_KEY } from "core/config/consts";
import { formatNumber, roundTo } from "core/helpers/number";
import { PurchasingPlanModel, SupplierModel } from "models/PurchasingPlan";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  StandardTable,
  TwoLineText,
} from "react-components-design-system";
import { PurchasingPlanPrincipleDetailHookContext } from "../../../PurchasingPlanPrincipleDetailHook";
import { SupplierTabProps } from "../../SupplierTab";
import ModalListSuppliers from "../ModalListSuppliers/ModalListSuppliers";
import SupplierDetailsDrawer from "../SupplierDetailsDrawer/SupplierDetailsDrawer";
import { useSupplierInformationTableHook } from "./SupplierInformationTableHook";

import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import styles from "./SupplierInformationTable.module.scss";

enum ColumnKey {
  NAME = "name",
  TAX_CODE = "taxCode",
  ADDRESS = "address",
  SUPPLIER_EMAIL = "supplierEmail",
  PRINCIPLE_CONTRACT = "principleContract",
  CURRENCY = "currency",
  PURCHASE_QUANTITY = "purchaseQuantity",
  TOTAL_AMOUNT = "totalAmount",
}

const columnsWidth = {
  name: 180,
  supplierEmail: 160,
  currency: 140,
  purchaseQuantity: 140,
  totalAmount: 140,
  overflowMenu: 40,
};

const SupplierInformationTable = ({
  isDetailPage,
}: Pick<SupplierTabProps, "isDetailPage">) => {
  const { model, handleChangeAllField } = useContext<PurchasingPlanModel>(
    PurchasingPlanPrincipleDetailHookContext
  );

  const {
    translate,
    isOpenConfirmDeleteModal,
    rowSelection,
    selectedRowKeys,
    openModalSupplier,
    isLoadingPrincipleContractBySupplier,
    notifyToast,
    setIsLoadingPrincipleContractBySupplier,
    setOpenModalSupplier,
    setIsOpenConfirmDeleteModal,
    setSelectedRowKeys,
    handleOpenDeleteModal,
    handleDeletePrincipleContracts,
    handleCloseDeleteModal,
    navigateToPrincipleContractView,
    setSelectedDetailSupplierId,
  } = useSupplierInformationTableHook();

  const handleOpenModalSupplier = () => {
    setOpenModalSupplier(true);
  };

  const handleCancelModalSupplier = () => {
    setOpenModalSupplier(false);
  };

  const handleApplySupplier = (dataSupplier: SupplierModel) => {
    setIsLoadingPrincipleContractBySupplier(true);
    purchasingPlanRepository
      .getPrincipleContractBySupplier(
        dataSupplier?.contractId,
        dataSupplier?.supplierId,
        model?.id
      )
      .pipe(
        finalize(() => {
          setIsLoadingPrincipleContractBySupplier(false);
        })
      )
      .subscribe({
        next: (response) => {
          const newSupplierPrincipleContracts = [
            ...model.supplierPrincipleContracts,
            response,
          ];

          handleChangeAllField({
            ...model,
            supplierPrincipleContracts: newSupplierPrincipleContracts,
          });
          handleCancelModalSupplier();
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
        },
      });
  };

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_supplier_tab"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        width: columnsWidth.name,
        render: (_, record) => {
          return (
            <LayoutCell>
              <div
                className="text-ellipsis"
                onClick={() => setSelectedDetailSupplierId(record?.id)}
              >
                <TwoLineText
                  classNameFirstLine={styles["primary-text"]}
                  classNameSecondLine="text-second__style"
                  valueLine1={record?.supplier?.name}
                  valueLine2={record?.supplier?.taxCode}
                  useTooltip
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_supplier_address"),
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.address} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("CM.contact_person"),
        key: ColumnKey.SUPPLIER_EMAIL,
        dataIndex: ColumnKey.SUPPLIER_EMAIL,
        width: columnsWidth.supplierEmail,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.contactPerson} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.principle_contract"),
        key: ColumnKey.PRINCIPLE_CONTRACT,
        dataIndex: ColumnKey.PRINCIPLE_CONTRACT,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <div
                className="text-ellipsis"
                onClick={() =>
                  navigateToPrincipleContractView(record?.contractId)
                }
              >
                <TwoLineText
                  classNameFirstLine={styles["primary-text"]}
                  classNameSecondLine="text-second__style"
                  valueLine1={record?.contractName}
                  valueLine2={record?.contractNo}
                  useTooltip
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("PL.type_currency_table")}
            unit={translate("PL.exchange_rate_label")}
          />
        ),
        key: ColumnKey.CURRENCY,
        dataIndex: ColumnKey.CURRENCY,
        width: columnsWidth.currency,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <TwoLineText
                classNameSecondLine="text-second__style"
                valueLine1={record?.currency}
                valueLine2={
                  record?.exchangeRate ? formatNumber(record?.exchangeRate) : ""
                }
                useTooltip
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="text-end">
            {translate("PL.purchasing_plan_purchase_quantity")}
          </div>
        ),
        key: ColumnKey.PURCHASE_QUANTITY,
        dataIndex: ColumnKey.PURCHASE_QUANTITY,
        width: columnsWidth.purchaseQuantity,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell position="right">
              <OneLineText
                value={formatNumber(roundTo(record?.totalQuantity, 4))}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="text-end">
            {translate("PL.purchasing_plan_amount")}
          </div>
        ),
        key: ColumnKey.TOTAL_AMOUNT,
        dataIndex: ColumnKey.TOTAL_AMOUNT,
        width: columnsWidth.totalAmount,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell position="right">
              <OneLineText value={formatNumber(record?.totalAmount)} />
            </LayoutCell>
          );
        },
      },

      {
        title: "",
        width: isDetailPage ? 40 : 1,
        fixed: "right",
        render(_, record) {
          if (!isDetailPage) return;

          return (
            <LayoutCell>
              <button
                className={styles["delete-row-btn"]}
                onClick={() => handleOpenDeleteModal(record?.id)}
              >
                <TrashIcon fillColor="#C03629" />
              </button>
            </LayoutCell>
          );
        },
      },
    ],
    [
      handleOpenDeleteModal,
      isDetailPage,
      navigateToPrincipleContractView,
      setSelectedDetailSupplierId,
      translate,
    ]
  );

  return (
    <div className={styles["supplier-information-table"]}>
      {!isEmpty(model?.supplierPrincipleContracts) && isDetailPage && (
        <div className="p-b--xs">
          <Button
            icon={<img src={AddIcon} alt="img" width={14} height={14} />}
            iconPlace="left"
            type="secondary"
            onClick={handleOpenModalSupplier}
          >
            {translate("PL.select_supplier_step_text")}
          </Button>
        </div>
      )}

      {isEmpty(model?.supplierPrincipleContracts) ? (
        <EmptyInitializeTable
          disableButton={!isDetailPage}
          textButton={translate("PL.select_supplier_step_text")}
          content={
            <div className="">
              {translate("PL.purchasing_plan_title_empty_table_supplier")}
            </div>
          }
          icon={<img src={emptyIcon} alt="" />}
          onHandleClickAdd={() => {
            setOpenModalSupplier(true);
          }}
        />
      ) : (
        <>
          <ActionBarComponent
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          >
            <Button
              type="secondary"
              size="sm"
              onClick={() => setIsOpenConfirmDeleteModal(true)}
            >
              {translate("CM.txt_delete")}
            </Button>
          </ActionBarComponent>
          <StandardTable
            isDragable={true}
            loading={false}
            rowKey={TABLE_ROW_KEY}
            columns={columns}
            dataSource={model?.supplierPrincipleContracts}
            rowSelection={isDetailPage ? rowSelection : null}
            scroll={{ y: "calc(100vh - 320px)" }}
          />
        </>
      )}

      <ModalConfirm
        open={isOpenConfirmDeleteModal}
        loading={false}
        maskClosable={false}
        icon={<img src={TrashRoundIcon} alt="Trash icon" />}
        title={translate("PL.confirm_delete_principle_contract")}
        content={translate("PL.warning_delete_principle_contract")}
        titleButtonApply={translate("CM.btn_confirm")}
        titleButtonCancel={translate("CM.btn_close")}
        handleSave={handleDeletePrincipleContracts}
        handleCancel={handleCloseDeleteModal}
      />

      <ModalListSuppliers
        open={openModalSupplier}
        isLoadingPrincipleContractBySupplier={
          isLoadingPrincipleContractBySupplier
        }
        handleCancelModalSupplier={handleCancelModalSupplier}
        handleApplySupplier={handleApplySupplier}
      />

      <SupplierDetailsDrawer isDetailPage={isDetailPage} />
    </div>
  );
};

export default SupplierInformationTable;
