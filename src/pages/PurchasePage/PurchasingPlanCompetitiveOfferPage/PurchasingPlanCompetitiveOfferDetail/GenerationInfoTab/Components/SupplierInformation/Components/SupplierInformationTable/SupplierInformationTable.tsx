import React, { useState } from "react";
import { ColumnProps } from "antd/lib/table";
import { isEqual, size } from "lodash";

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
  Checkbox,
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
import { SupplierDrawer } from "./Components/SupplierDrawer/SupplierDrawer";
import { TypeAction } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/ContractTerms/ContractTermsHooks";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { utilService } from "core/services/common-services/util-service";
import { useTranslation } from "react-i18next";

const SupplierInformationTableBidding = ({
  isDetail,
  contextValue,
  isView,
}: SupplierInformationProps) => {
  const { model, handleChangeSingleField, handleChangeAllField } = contextValue;
  const {
    isOpenConfirmDeleteModal,
    selectedRowKeys,
    openModalSupplier,
    setOpenModalSupplier,
    setIsOpenConfirmDeleteModal,
    setSelectedRowKeys,
    setSelectedRow,
    rowSelection,
    selectedRow,
    handleOpenDeleteModal,
    handleDeletePrincipleContracts,
    handleCloseDeleteModal,
    setOpenModalSupplierInformation,
    handleChangeAllFieldSupplier,
    currentItem,
  } = useSupplierInformationTableHook(contextValue);

  const [translate] = useTranslation();

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const handleOpenDrawer = (record: SupplierModel) => {
    handleChangeAllFieldSupplier({
      ...record,
    });
    setIsOpenDrawer(true);
  };

  const handleAction = (
    typeAction: null | TypeAction,
    currentItem: SupplierModel
  ) => {
    switch (typeAction) {
      case TypeAction.EDIT:
        handleChangeAllField({
          ...model,
          supplierGenerals: (model?.supplierGenerals || []).map((item: any) => {
            if (isEqual(item?.id, currentItem?.id)) {
              return {
                ...item,
                ...currentItem,
              };
            }
            return item;
          }),
        });
        break;
      default:
        handleChangeAllFieldSupplier(currentItem);
        break;
    }
  };

  const handleOpenModalSupplier = () => {
    setOpenModalSupplier(true);
  };

  const handleCancelModalSupplier = () => {
    setOpenModalSupplier(false);
  };

  const handleApplySupplier = (dataSupplier: SupplierModel[]) => {
    const dataApply = dataSupplier?.map((item) => {
      const supplierContacts =
        item?.supplierContacts?.filter((item) => item?.isDefault) || [];
      const supplierContact: any = supplierContacts?.[0] || {};
      return {
        ...item,
        quoteName: supplierContact?.name,
        quoteEmail: supplierContact?.email,
        phoneNumber: supplierContact?.phone,
      };
    });

    handleChangeSingleField({ fieldName: "supplierGenerals" })(dataApply);
    handleCancelModalSupplier();
  };

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(
    () => [
      {
        title: translate("PL.purchasing_plan_supplier_tab"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        type: "link",
        width: 306,
        render: (value, record) => {
          return (
            <LayoutCell>
              <div
                className="text-ellipsis"
                onClick={() => {
                  handleOpenDrawer(record);
                  setOpenModalSupplierInformation(true);
                }}
              >
                <OneLineText className="hyperlink" value={value} />
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
        width: 150,
        render: (value, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.taxCode} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.purchasing_plan_supplier_address"),
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        ellipsis: true,
        width: 200,
        render: (value, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.address} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.drawer_name_person_quoting_price"),
        key: ColumnKey.QUOTATION_NAME,
        dataIndex: ColumnKey.QUOTATION_NAME,
        ellipsis: true,
        width: 200,
        render: (value, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.quoteName} />
            </LayoutCell>
          );
        },
      },

      {
        title: translate("PL.drawer_email_person_quoting_price"),
        key: ColumnKey.EMAIL,
        dataIndex: ColumnKey.EMAIL,
        width: 200,
        ellipsis: true,
        render: (value, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.quoteEmail} />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.drawer_phone_number_supplier"),
        key: ColumnKey.PHONE_NUMBER,
        dataIndex: ColumnKey.PHONE_NUMBER,
        width: 150,
        ellipsis: true,
        render: (value, record) => {
          return (
            <LayoutCell>
              <OneLineText value={record?.phoneNumber} />
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
      isDetail,
      setOpenModalSupplierInformation,
      translate,
    ]
  );

  return (
    <div className={styles["supplier-information-table"]}>
      {!isDetail && size(model?.supplierGenerals) > 0 ? (
        <div className="p-b--xs">
          <Button
            icon={<img src={AddIcon} alt="img" width={14} height={14} />}
            iconPlace="left"
            type="secondary"
            onClick={handleOpenModalSupplier}
          >
            {translate("PPA.add_supplier")}
          </Button>
        </div>
      ) : null}

      {!(size(model?.supplierGenerals) > 0) ? (
        <FormItem
          validateObject={
            utilService.getValidateObj(model, "supplierPurchasePlans") ||
            utilService.getValidateObj(model, "supplierGenerals")
          }
        >
          {isDetail ? (
            <EmptyItemTable
              icon={<img src={emptyCloudIcon} alt="" />}
              content={translate("CM.empty.no_data_recorded")}
            />
          ) : (
            <EmptyInitializeTable
              disableButton={!model?.purchaseProposalId || isDetail}
              textButton={translate("PPA.add_supplier")}
              content={
                <div className="text-break-line">
                  {translate("PL.bidding.title.add_new_data")}
                </div>
              }
              icon={<img src={emptyCloudIcon} alt="" />}
              onHandleClickAdd={handleOpenModalSupplier}
            />
          )}
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
            rowKey={"id"}
            idContainer={"supplierId"}
            columns={columns}
            dataSource={model?.supplierGenerals}
            rowSelection={
              isDetail
                ? null
                : {
                    ...rowSelection,
                    renderCell: (value: boolean, record: SupplierModel) => {
                      return (
                        <div className="d-flex justify-content-center align-items-center">
                          <Checkbox
                            checked={value}
                            onChange={(e) => {
                              if (e) {
                                setSelectedRowKeys([
                                  ...selectedRowKeys,
                                  record.id,
                                ]);
                                setSelectedRow([...selectedRow, record]);
                              } else {
                                setSelectedRowKeys(
                                  selectedRowKeys.filter(
                                    (key) => key !== record.id
                                  )
                                );
                                setSelectedRow(
                                  selectedRow.filter(
                                    (item) => item.id !== record.id
                                  )
                                );
                              }
                            }}
                          />
                        </div>
                      );
                    },
                  }
            }
            scroll={{ y: "calc(100vh - 320px)" }}
          />
        </>
      )}

      <ModalConfirm
        open={isOpenConfirmDeleteModal}
        loading={false}
        maskClosable={false}
        icon={<img src={TrashRoundIcon} alt="Trash icon" />}
        title={translate("PL.modal_delete_supplier_competitive_offer.title")}
        content={translate(
          "PL.modal_delete_supplier_competitive_offer.content"
        )}
        titleButtonApply={translate("CM.btn_confirm")}
        titleButtonCancel={translate("CM.btn_close")}
        handleSave={handleDeletePrincipleContracts}
        handleCancel={handleCloseDeleteModal}
      />

      {openModalSupplier && (
        <ModalListSuppliers
          open={openModalSupplier}
          handleCancelModalSupplier={handleCancelModalSupplier}
          handleApplySupplier={handleApplySupplier}
          contextValue={contextValue}
        />
      )}

      <SupplierDrawer
        onClose={() => {
          setIsOpenDrawer(false);
        }}
        handleAction={handleAction}
        handleChangeAllFields={handleChangeAllField}
        model={model}
        handleChangeAllFieldSupplier={handleChangeAllFieldSupplier}
        currentItem={currentItem}
        visible={isOpenDrawer}
        isView={isView}
      />
    </div>
  );
};

export default SupplierInformationTableBidding;
