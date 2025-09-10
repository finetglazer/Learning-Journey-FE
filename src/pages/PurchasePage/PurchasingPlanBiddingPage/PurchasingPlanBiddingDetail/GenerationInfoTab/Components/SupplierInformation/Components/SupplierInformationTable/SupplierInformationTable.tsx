import React, { useEffect, useState } from "react";
import { ColumnProps } from "antd/lib/table";
import { isEmpty } from "lodash";

import {
  AddIcon,
  emptyCloudIcon,
  TrashIcon,
  TrashRoundIcon,
} from "assets/icons";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { SupplierModel } from "models/PurchasingPlan";
import {
  ActionBarComponent,
  Button,
  FormItem,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import ModalListSuppliers from "../ModalListSuppliers/ModalListSuppliers";
import { useSupplierInformationTableHook } from "./SupplierInformationTableHook";
import { SupplierInformationProps } from "../../SupplierInformation";

import styles from "./SupplierInformationTable.module.scss";
import { ColumnKey } from "models/PurchasingPlan/PurchasingPlanBidder";
import ModalSupplierInformation from "../ModalSupplierInformation/ModalSupplierInformation";
import { utilService } from "core/services/common-services/util-service";

const columnsWidth = {
  name: 606,
  taxCode: 200,
  personInCharge: 200,
  email: 200,
};

const SupplierInformationTableBidding = ({
  isDetail,
  contextValue,
}: SupplierInformationProps) => {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierModel>({});
  const { model, handleChangeSingleField } = contextValue;

  const {
    translate,
    isOpenConfirmDeleteModal,
    rowSelectionSupplierId,
    selectedRowKeys,
    openModalSupplier,
    setOpenModalSupplier,
    setIsOpenConfirmDeleteModal,
    setSelectedRowKeys,
    handleOpenDeleteModal,
    handleDeletePrincipleContracts,
    handleCloseDeleteModal,
    openModalSupplierInformation,
    setOpenModalSupplierInformation,
  } = useSupplierInformationTableHook(contextValue);

  const handleOpenModalSupplier = () => {
    setOpenModalSupplier(true);
  };

  const handleCancelModalSupplier = () => {
    setOpenModalSupplier(false);
  };

  const handleApplySupplier = (dataSupplier: SupplierModel[]) => {
    const newDataSupplier = dataSupplier?.map((item) => {
      const result = {
        ...item,
        supplierId: item.id || item.supplierId,
      };
      delete result.id;
      return result;
    });
    handleChangeSingleField({ fieldName: "supplierGenerals" })(newDataSupplier);
    handleCancelModalSupplier();
  };

  const handleCancelModalPersonInCharge = () => {
    setOpenModalSupplierInformation(false);
    setSelectedSupplier({});
  };

  const handleApplyPersonInCharge = (supplierData: SupplierModel) => {
    const newSupplierGenerals = model?.supplierGenerals.map(
      (item: SupplierModel) => {
        if (item.supplierId === supplierData.supplierId) {
          return {
            ...supplierData,
            supplierId: item.supplierId,
            phone: supplierData.phoneNumber,
          };
        }
        return item;
      }
    );

    handleChangeSingleField({ fieldName: "supplierGenerals" })(
      newSupplierGenerals
    );
    handleCancelModalPersonInCharge();
  };

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_supplier_tab"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        type: "link",
        width: columnsWidth.name,
        render: (value, record) => {
          return (
            <LayoutCell>
              <div
                className="text-ellipsis"
                onClick={() => {
                  setSelectedSupplier(record);
                  setOpenModalSupplierInformation(true);
                }}
              >
                <OneLineText
                  className="hyperlink"
                  value={value || record?.supplier?.name}
                />
              </div>
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_supplier_tax_code"),
        key: ColumnKey.TAX_CODE,
        dataIndex: ColumnKey.TAX_CODE,
        ellipsis: true,
        width: columnsWidth.taxCode,
        render: (value, record) => {
          return (
            <LayoutCell>
              <OneLineText value={value || record?.supplier?.taxCode} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.bidding.title.person_in_charge"),
        key: ColumnKey.PERSON_IN_CHARGE,
        dataIndex: ColumnKey.PERSON_IN_CHARGE,
        width: columnsWidth.personInCharge,
        ellipsis: true,
        render: (value, record) => {
          let displayValue = "";
          if (value) {
            displayValue = value?.name;
          }
          return (
            <LayoutCell>
              <OneLineText
                value={
                  displayValue ||
                  record?.[ColumnKey.PERSON_IN_CHARGE]?.[0]?.name ||
                  record?.[ColumnKey.PERSON_IN_CHARGE]?.[0]?.pic?.name
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_email"),
        key: ColumnKey.EMAIL,
        dataIndex: ColumnKey.EMAIL,
        width: columnsWidth.email,
        ellipsis: true,
        render: (value, record) => {
          let val = value;
          if (record?.[ColumnKey.PERSON_IN_CHARGE]) {
            val =
              record[ColumnKey.PERSON_IN_CHARGE]?.email ||
              record[ColumnKey.PERSON_IN_CHARGE]?.[0]?.email;
          }
          return (
            <LayoutCell>
              <OneLineText value={val} />
            </LayoutCell>
          );
        },
      },

      {
        title: "",
        width: isDetail ? 1 : 40,
        fixed: "right",
        render(_, record) {
          if (isDetail) return;

          return (
            <LayoutCell>
              <button
                className={styles["delete-row-btn"]}
                onClick={() => handleOpenDeleteModal(record?.supplierId)}
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
      isDetail,
      setOpenModalSupplierInformation,
      translate,
    ]
  );

  useEffect(() => {
    if (model?.supplierGenerals?.[0]?.[ColumnKey.PERSON_IN_CHARGE]) {
      setSelectedSupplier(
        model.supplierGenerals[0][ColumnKey.PERSON_IN_CHARGE]
      );
    }
  }, [model?.supplierGenerals]);

  return (
    <div className={styles["supplier-information-table"]}>
      {!isDetail && !isEmpty(model?.supplierGenerals) && (
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

      {isEmpty(model?.supplierGenerals) ? (
        <FormItem
          validateObject={utilService.getValidateObj(model, "supplierGenerals")}
        >
          <EmptyInitializeTable
            disableButton={!model?.purchaseProposalId || isDetail}
            textButton={translate("PL.select_supplier_step_text")}
            content={
              <div className="text-break-line">
                {translate("PL.bidding.title.add_new_data")}
              </div>
            }
            icon={<img src={emptyCloudIcon} alt="" />}
            onHandleClickAdd={handleOpenModalSupplier}
          />
        </FormItem>
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
            rowKey={"supplierId"}
            columns={columns}
            dataSource={model?.supplierGenerals}
            rowSelection={isDetail ? null : rowSelectionSupplierId}
            scroll={{ y: "calc(100vh - 320px)" }}
          />
        </>
      )}

      {isOpenConfirmDeleteModal && (
        <ModalConfirm
          open={isOpenConfirmDeleteModal}
          loading={false}
          maskClosable={false}
          icon={<img src={TrashRoundIcon} alt="Trash icon" />}
          title={translate("PL.bidding.title.delete_selected_supplier")}
          content={translate(
            "PL.bidding.title.delete_selected_supplier_warning"
          )}
          titleButtonApply={translate("CM.btn_confirm")}
          titleButtonCancel={translate("CM.btn_close")}
          handleSave={handleDeletePrincipleContracts}
          handleCancel={handleCloseDeleteModal}
        />
      )}

      {openModalSupplier && (
        <ModalListSuppliers
          open={openModalSupplier}
          handleCancelModalSupplier={handleCancelModalSupplier}
          handleApplySupplier={handleApplySupplier}
          supplierGenerals={model?.supplierGenerals}
        />
      )}

      {openModalSupplierInformation && (
        <ModalSupplierInformation
          open={openModalSupplierInformation}
          handleCancelModal={handleCancelModalPersonInCharge}
          handleApplyPersonInCharge={handleApplyPersonInCharge}
          contextValue={contextValue}
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
          isDetail={isDetail}
        />
      )}
    </div>
  );
};

export default SupplierInformationTableBidding;
