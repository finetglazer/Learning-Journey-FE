import React, { useCallback, useEffect, useState } from "react";
import { ColumnProps } from "antd/lib/table";
import { isEmpty, isEqual, size } from "lodash";

import {
  AddIcon,
  emptyCloudIcon,
  TrashIcon,
  TrashRoundIcon,
} from "assets/icons";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { SupplierModel, SupplierQuotationAction } from "models/PurchasingPlan";
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
import { useSupplierInformationTableHook } from "./SupplierInformationTableHook";
import styles from "./SupplierInformationTable.module.scss";
import { ColumnKey } from "models/PurchasingPlan/PurchasingPlanBidder";
import { SupplierDrawer } from "./Components/SupplierDrawer/SupplierDrawer";
import { TypeAction } from "pages/PurchasePage/ContractPage/ContractAnnex/Components/ContractTerms/ContractTermsHooks";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { SupplierInformationProps } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/SupplierInformation/SupplierInformation";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { listEvaluation } from "config/const";
import { formatCurrency } from "core/helpers/number";
import { utilService } from "core/services/common-services/util-service";

const SupplierInformationTableBidding = ({
  isDetail,
  contextValue,
  isView,
  idContainer,
  isNotConfirmDelete = false,
  isNegotiationRound = false,
  actionQuote,
  handleChangeSelectSupplier,
}: SupplierInformationProps) => {
  const { model, handleChangeAllField } = contextValue;
  const {
    translate,
    isOpenConfirmDeleteModal,
    selectedRowKeys,
    setIsOpenConfirmDeleteModal,
    setSelectedRowKeys,
    handleOpenDeleteModal,
    handleDeletePrincipleContracts,
    handleCloseDeleteModal,
    setOpenModalSupplierInformation,
    handleChangeAllFieldSupplier,
    currentItem,
    selectedRow,
    setSelectedRow,
    rowSelection,
    handleDeleteNotConfirm,
  } = useSupplierInformationTableHook(contextValue);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const handleOpenDrawer = useCallback(
    (record: SupplierModel) => {
      handleChangeAllFieldSupplier({
        ...record,
      });
      setIsOpenDrawer(true);
    },
    [handleChangeAllFieldSupplier]
  );

  const handleAction = (
    typeAction: null | TypeAction,
    currentItem: SupplierModel
  ) => {
    const updateSupplierList = (listSupplier: SupplierModel[]) =>
      listSupplier.map((item) =>
        isEqual(item.id, currentItem.id) ? { ...item, ...currentItem } : item
      );

    if (typeAction === TypeAction.EDIT) {
      handleChangeAllField({
        ...model,
        masterSupplierAddQuote: {
          ...model?.masterSupplierAddQuote,
          listSupplierAddQuote: updateSupplierList(
            model?.masterSupplierAddQuote?.listSupplierAddQuote || []
          ),
        },
      });
    } else {
      handleChangeAllFieldSupplier(currentItem);
    }
  };

  const renderTextCell = (value: string) => (
    <LayoutCell>
      <OneLineText value={value} />
    </LayoutCell>
  );

  const renderLinkCell = useCallback(
    (value: string, record: SupplierModel) => {
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
    [handleOpenDrawer, setOpenModalSupplierInformation]
  );

  const renderDeleteCell = useCallback(
    (_: unknown, record: SupplierModel) => {
      if (isDetail) return null;

      return (
        <LayoutCell>
          <button
            className={styles["delete-row-btn"]}
            onClick={() =>
              isNotConfirmDelete
                ? handleDeleteNotConfirm(record.id)
                : handleOpenDeleteModal(record.id)
            }
          >
            <TrashIcon fillColor="#C03629" />
          </button>
        </LayoutCell>
      );
    },
    [
      handleDeleteNotConfirm,
      handleOpenDeleteModal,
      isDetail,
      isNotConfirmDelete,
    ]
  );

  const columns: ColumnProps<SupplierModel>[] = React.useMemo(() => {
    const isViewColumn =
      isDetail ||
      isEqual(actionQuote, SupplierQuotationAction.proceedNegotiation) ||
      isEqual(actionQuote, SupplierQuotationAction.prioritizeSupplier);
    if (isNegotiationRound) {
      return [
        {
          title: (
            <UnitTitle
              title={translate("PL.purchasing_plan_supplier_tab")}
              isShowUnit={false}
            />
          ),
          key: ColumnKey.NAME,
          dataIndex: ColumnKey.NAME,
          ellipsis: true,
          type: "link",
          width: 202,
          render: renderLinkCell,
        },
        {
          title: (
            <UnitTitle
              title={translate("PL.txt_technicalPoint")}
              isShowUnit={false}
            />
          ),
          key: ColumnKey.TECHNICAL_POINT,
          dataIndex: ColumnKey.TECHNICAL_POINT,
          ellipsis: true,
          width: 120,
          render: (value: number) => {
            const data = listEvaluation.find((i) => i.id === value);
            return renderTextCell(data?.name);
          },
        },
        {
          title: (
            <UnitTitle
              title={translate("PL.txt_financialPoint")}
              isShowUnit={false}
            />
          ),
          key: ColumnKey.FINANCIAL_POINT,
          dataIndex: ColumnKey.FINANCIAL_POINT,
          ellipsis: true,
          width: 120,
          render: (value) => renderTextCell(value?.toString()),
        },
        {
          title: (
            <UnitTitle
              title={translate("PL.txt_originalCurrencyTotal")}
              isShowUnit={false}
            />
          ),
          key: ColumnKey.TOTAL_AMOUNT,
          dataIndex: ColumnKey.TOTAL_AMOUNT,
          ellipsis: true,
          width: 165,
          render: (value, record) =>
            renderTextCell(
              formatCurrency({
                value: value,
                code: record?.currency,
              })
            ),
        },
        {
          title: (
            <UnitTitle
              title={translate("PL.type_currency_table")}
              isShowUnit={false}
            />
          ),
          key: ColumnKey.CURRENCY,
          dataIndex: ColumnKey.CURRENCY,
          ellipsis: true,
          width: 100,
          render: renderTextCell,
        },
        {
          title: (
            <UnitTitle
              title={translate("PL.purchasing_plan_total_exchange_rate")}
              isShowUnit={true}
            />
          ),
          key: ColumnKey.CONVERTED_CURRENCY_TOTAL,
          dataIndex: ColumnKey.CONVERTED_CURRENCY_TOTAL,
          ellipsis: true,
          width: 165,
          render: (value) =>
            renderTextCell(
              formatCurrency({
                value: value,
              })
            ),
        },
        {
          title: "",
          width: isDetail ? 1 : 40,
          fixed: "right",
          render: !isEqual(
            actionQuote,
            SupplierQuotationAction.proceedNegotiation
          )
            ? renderDeleteCell
            : null,
        },
      ];
    }
    return [
      {
        title: translate("PL.purchasing_plan_supplier_tab"),
        key: ColumnKey.NAME,
        dataIndex: ColumnKey.NAME,
        ellipsis: true,
        type: "link",
        width: 306,
        render: renderLinkCell,
      },
      {
        title: translate("PL.purchasing_plan_supplier_tax_code"),
        key: ColumnKey.TAX_CODE,
        dataIndex: ColumnKey.TAX_CODE,
        ellipsis: true,
        width: 150,
        render: (_, record) => renderTextCell(record?.taxCode),
      },
      {
        title: translate("PL.purchasing_plan_supplier_address"),
        key: ColumnKey.ADDRESS,
        dataIndex: ColumnKey.ADDRESS,
        ellipsis: true,
        width: 200,
        render: (_, record) => renderTextCell(record?.address),
      },
      {
        title: translate("PL.drawer_name_person_quoting_price"),
        key: ColumnKey.QUOTATION_NAME,
        dataIndex: ColumnKey.QUOTATION_NAME,
        ellipsis: true,
        width: 200,
        render: (_, record) => renderTextCell(record?.quoteName),
      },
      {
        title: translate("PL.drawer_email_person_quoting_price"),
        key: ColumnKey.EMAIL,
        dataIndex: ColumnKey.EMAIL,
        width: 200,
        ellipsis: true,
        render: (_, record) => renderTextCell(record?.quoteEmail),
      },
      {
        title: translate("PL.drawer_phone_number_supplier"),
        key: ColumnKey.PHONE_NUMBER,
        dataIndex: ColumnKey.PHONE_NUMBER,
        width: 150,
        ellipsis: true,
        render: (_, record) => renderTextCell(record?.phoneNumber),
      },
      {
        title: "",
        width: isViewColumn ? 1 : 40,
        fixed: isViewColumn ? "right" : undefined,
        render: isViewColumn ? null : renderDeleteCell,
      },
    ];
  }, [
    isNegotiationRound,
    translate,
    renderLinkCell,
    isDetail,
    actionQuote,
    renderDeleteCell,
    model?.masterProceedNegotiation,
  ]);

  const getDataSource = (actionQuote: string) => {
    switch (actionQuote) {
      case SupplierQuotationAction.proceedNegotiation:
        return model?.masterProceedNegotiation?.listSupplierAddQuote;
      case SupplierQuotationAction.prioritizeSupplier:
        return model?.masterPrioritySupplier?.listSupplierAddQuote;
      default:
        return model?.masterSupplierAddQuote?.listSupplierAddQuote;
    }
  };

  const renderTable = () => {
    return (
      <StandardTable
        isDragable={true}
        loading={false}
        rowKey={"id"}
        idContainer={idContainer ?? "table-supplier"}
        columns={columns}
        dataSource={getDataSource(actionQuote)}
        rowSelection={{
          ...rowSelection,
          renderCell: (value: boolean, record: SupplierModel) => {
            return (
              <div className="d-flex justify-content-center align-items-center">
                <Checkbox
                  checked={value}
                  onChange={(e) => {
                    if (e) {
                      setSelectedRowKeys([...selectedRowKeys, record.id]);
                      setSelectedRow([...selectedRow, record]);
                    } else {
                      setSelectedRowKeys(
                        selectedRowKeys.filter((key) => key !== record.id)
                      );
                      setSelectedRow(
                        selectedRow.filter((item) => item.id !== record.id)
                      );
                    }
                  }}
                />
              </div>
            );
          },
        }}
        scroll={{ y: "calc(100vh - 500px)" }}
      />
    );
  };

  const renderUITable = () => {
    const isProceedNegotiation =
      actionQuote === SupplierQuotationAction.proceedNegotiation;
    const hasSuppliersToProceed =
      size(model?.masterProceedNegotiation?.listSupplierAddQuote) > 0;
    const hasSuppliersToAdd =
      size(model?.masterSupplierAddQuote?.listSupplierAddQuote) > 0;
    const isViewDetail = !isEmpty(isDetail);
    const isDisabledButton = !model?.purchaseProposalId || isDetail;

    if (isProceedNegotiation) {
      return hasSuppliersToProceed ? (
        renderTable()
      ) : (
        <EmptyItemTable
          icon={<img src={emptyCloudIcon} alt="" />}
          content={translate("CM.empty.no_data_recorded")}
        />
      );
    }

    if (!hasSuppliersToAdd) {
      return (
        <FormItem
          validateObject={utilService.getValidateObj(
            contextValue?.model,
            "suppliers"
          )}
        >
          <EmptyInitializeTable
            disableButton={isDisabledButton}
            textButton={translate("PL.select_supplier_step_text")}
            content={
              <div className="text-break-line">
                {translate("PL.bidding.title.add_new_data")}
              </div>
            }
            icon={<img src={emptyCloudIcon} alt="" />}
            onHandleClickAdd={() => {
              contextValue.setIsOpenModalSupplierQuote(true);
            }}
          />
        </FormItem>
      );
    }

    if (!isViewDetail) {
      return hasSuppliersToAdd ? (
        renderTable()
      ) : (
        <EmptyItemTable
          icon={<img src={emptyCloudIcon} alt="" />}
          content={translate("CM.empty.no_data_recorded")}
        />
      );
    }

    return renderTable();
  };

  useEffect(() => {
    handleChangeSelectSupplier &&
      handleChangeSelectSupplier(selectedRowKeys as string[]);
  }, [selectedRowKeys]);

  return (
    <div className={styles["supplier-information-table"]}>
      {!isDetail &&
      !isEqual(actionQuote, SupplierQuotationAction.proceedNegotiation) &&
      size(model?.masterSupplierAddQuote?.listSupplierAddQuote) > 0 ? (
        <div className="p-b--xs">
          <Button
            icon={<img src={AddIcon} alt="img" width={14} height={14} />}
            iconPlace="left"
            type="secondary"
            onClick={() => {
              contextValue.setIsOpenModalSupplierQuote(true);
            }}
          >
            {translate("PL.select_supplier_step_text")}
          </Button>
        </div>
      ) : null}
      {!isEqual(actionQuote, SupplierQuotationAction.proceedNegotiation) && (
        <ActionBarComponent
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        >
          <Button
            type="secondary"
            size="sm"
            onClick={() => {
              if (isNotConfirmDelete) {
                handleDeleteNotConfirm(null);
              } else {
                setIsOpenConfirmDeleteModal(true);
              }
            }}
          >
            {translate("CM.txt_delete")}
          </Button>
        </ActionBarComponent>
      )}
      {renderUITable()}

      {!isNotConfirmDelete && (
        <ModalConfirm
          open={isOpenConfirmDeleteModal}
          loading={false}
          maskClosable={false}
          icon={<img src={TrashRoundIcon} alt="Trash icon" />}
          title={translate("PL.modal_delete_supplier.title")}
          content={translate("PL.modal_delete_supplier.content")}
          titleButtonApply={translate("CM.btn_confirm")}
          titleButtonCancel={translate("CM.btn_close")}
          handleSave={handleDeletePrincipleContracts}
          handleCancel={handleCloseDeleteModal}
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
        isView={
          isView ||
          isEqual(actionQuote, SupplierQuotationAction.proceedNegotiation)
        }
      />
    </div>
  );
};

export default SupplierInformationTableBidding;
