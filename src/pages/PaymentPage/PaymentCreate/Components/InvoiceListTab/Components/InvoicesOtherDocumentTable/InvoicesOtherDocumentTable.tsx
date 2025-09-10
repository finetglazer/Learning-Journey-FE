import { DeleteRoundIcon, IcEmptySearchSvg } from "assets/icons";
import { listService } from "core/services/page-services/list-service";
import { FieldValue } from "core/services/service-types";
import _truncate from "lodash/truncate";
import {
  CODE_TYPE_ADVANCE_TUCN,
  CODE_TYPE_ADVANCE_TUNCC,
  CODE_TYPE_EXPENSE_DCCN,
  CODE_TYPE_EXPENSE_DCNCC,
  CODE_TYPE_PAYMENT_REQUEST_CORP,
  CODE_TYPE_PAYMENT_REQUEST_PER,
  CostAllocation,
  InvoicesOtherDocumentModel,
  PaymentCreateModel,
  SupplierFilter,
} from "models/Payment";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  ModalConfirm,
  StandardTable,
} from "react-components-design-system";
import { paymentRepository } from "../../../../../PaymentRepository";
import InvoicesOtherDocumentsColumn from "../InvoicesOtherDocumentsColumn/InvoicesOtherDocumentsColumn";
import { isEmpty } from "lodash";

const InvoicesOtherDocumentTable = () => {
  const {
    model,
    handleChangeAllField,
    formatNumberToCurrency,
    translate,
    handleDownloadFileAttached,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const handleChangeItemTable = (
    fieldName: string,
    value: FieldValue,
    objectValue: FieldValue,
    id: string,
    indexBeforeValidate?: number,
    nameError?: string
  ) => {
    const invoicesOtherDocumentEdit = model?.invoicesOtherDocument?.map(
      (item: InvoicesOtherDocumentModel) => {
        if (item.id === id) {
          return {
            ...item,
            [fieldName]: objectValue || value,
          };
        }
        return item;
      }
    );

    if (nameError) {
      handleChangeAllField({
        ...model,
        invoicesOtherDocument: invoicesOtherDocumentEdit,
        errors: {
          ...model.errors,
          [`otherDocuments[${indexBeforeValidate}].${nameError}`]: null,
        },
      });
    } else {
      handleChangeAllField({
        ...model,
        invoicesOtherDocument: invoicesOtherDocumentEdit,
      });
    }
  };

  const handleChangeMultipleItemTable = (
    data: object,
    id: string,
    indexBeforeValidate?: number,
    nameError?: string[]
  ) => {
    const invoicesOtherDocumentEdit = model?.invoicesOtherDocument?.map(
      (item: InvoicesOtherDocumentModel) => {
        if (item.id === id) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      }
    );
    if (nameError && nameError?.length > 0) {
      const errors = nameError?.reduce((acc: { [key: string]: null }, name) => {
        acc[`otherDocuments[${indexBeforeValidate}].${name}`] = null;
        return acc;
      }, {});

      handleChangeAllField({
        ...model,
        invoicesOtherDocument: invoicesOtherDocumentEdit,
        errors: {
          ...model.errors,
          ...errors,
        },
      });
    } else {
      handleChangeAllField({
        ...model,
        invoicesOtherDocument: invoicesOtherDocumentEdit,
      });
    }
  };

  const isInitMount = useRef(false);
  useEffect(() => {
    switch (model?.paymentRequestType?.code) {
      case CODE_TYPE_PAYMENT_REQUEST_PER:
      case CODE_TYPE_ADVANCE_TUCN:
      case CODE_TYPE_EXPENSE_DCCN:
        if (isInitMount.current) {
          handleChangeAllField({
            ...model,
            invoicesOtherDocument: model?.invoicesOtherDocument?.map(
              (item: InvoicesOtherDocumentModel) => {
                return {
                  ...item,
                  supplierTaxCode: "",
                  supplierName: "",
                  supplierCode: "",
                };
              }
            ),
          });
        }
        break;
      case CODE_TYPE_PAYMENT_REQUEST_CORP:
      case CODE_TYPE_ADVANCE_TUNCC:
      case CODE_TYPE_EXPENSE_DCNCC:
        handleChangeAllField({
          ...model,
          invoicesOtherDocument: model?.invoicesOtherDocument?.map(
            (item: InvoicesOtherDocumentModel) => {
              return {
                ...item,
                supplierTaxCode: model?.supplier?.taxCode || "",
                supplierName: model?.supplier?.name || "",
                supplierCode: model?.supplier?.code || "",
              };
            }
          ),
        });
        break;
      default:
        break;
    }
    isInitMount.current = true;
  }, [model?.supplier]);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<InvoicesOtherDocumentModel>(
      "checkbox",
      [],
      false,
      "auto",
      true
    );

  const [idDelete, setIdDelete] = useState("");
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const rowDataEdit = model?.invoicesOtherDocument?.filter(
      (item: InvoicesOtherDocumentModel) => item.id !== idDelete
    );
    const rowDeleteById = model?.invoicesOtherDocument?.filter(
      (item: InvoicesOtherDocumentModel) => item.id === idDelete
    );

    const nameErrors =
      rowDeleteById?.length > 0 ? Object.keys(rowDeleteById[0]) : [];
    const indexBeforeValidate =
      rowDeleteById?.length > 0 ? rowDeleteById[0].indexBeforeValidate : null;
    const errors = nameErrors?.reduce((acc: { [key: string]: null }, name) => {
      acc[`otherDocuments[${indexBeforeValidate}].${name}`] = null;
      return acc;
    }, {});

    handleChangeAllField({
      ...model,
      invoicesOtherDocument: rowDataEdit,
      errors: {
        ...model.errors,
        ...errors,
      },
    });

    const ids = selectedRowKeys.filter((id) => id !== idDelete);
    setSelectedRowKeys(ids);
    setIsOpenModelConfirmDeleteRow(false);
  };

  const handleBulkDeleteRow = () => {
    const rowsDataEdit = model?.invoicesOtherDocument?.filter(
      (item: InvoicesOtherDocumentModel) => !selectedRowKeys.includes(item.id)
    );
    const rowDeleteByIds = model?.invoicesOtherDocument?.filter(
      (item: InvoicesOtherDocumentModel) => selectedRowKeys.includes(item.id)
    );
    const indexBeforeValidates: number[] = [];
    const nameErrors =
      rowDeleteByIds?.length > 0 ? Object.keys(rowDeleteByIds[0]) : [];
    rowDeleteByIds?.forEach((item, index) => {
      const indexBeforeValidate = rowDeleteByIds[index]?.indexBeforeValidate;
      indexBeforeValidates.push(indexBeforeValidate);
    });
    let errors: { [key: string]: null }[] = [];
    indexBeforeValidates.forEach((indexBeforeValidate: number) => {
      const nameError = nameErrors?.reduce(
        (acc: { [key: string]: null }, name) => {
          acc[`otherDocuments[${indexBeforeValidate}].${name}`] = null;
          return acc;
        },
        {}
      );
      errors = { ...errors, ...nameError };
    });

    handleChangeAllField({
      ...model,
      invoicesOtherDocument: rowsDataEdit,
      errors: {
        ...model.errors,
        ...errors,
      },
    });

    const ids = selectedRowKeys.filter((id) => !selectedRowKeys.includes(id));
    setSelectedRowKeys(ids);
    setOpenModalConfirmDeleteAll(false);
  };

  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const getSupplierOtherDocument = (
    supplierTaxCode: string,
    recordId: string,
    isClearTaxCode = false
  ) => {
    const filter: SupplierFilter = {
      search: supplierTaxCode,
    };
    paymentRepository.getSupplierList(filter).subscribe({
      next: (res) => {
        const data = res.data?.items;
        if (!isClearTaxCode) {
          if (data && data.length === 1) {
            const supplier = data[0];
            const supplierSave = {
              supplierTaxCode: supplier.taxCode,
              supplierName: supplier.name,
              supplierCode: supplier.code,
            };
            handleChangeMultipleItemTable(supplierSave, recordId);
          } else {
            handleChangeMultipleItemTable(
              {
                supplierTaxCode: supplierTaxCode,
                supplierName: "",
                supplierCode: "",
              },
              recordId
            );
          }
        } else {
          const recordChange = model?.invoicesOtherDocument?.filter(
            (item) => item.id === recordId
          );
          const supplier = recordChange?.length > 0 && recordChange[0];
          if (!isEmpty(supplier) && supplier?.supplierCode) {
            handleChangeMultipleItemTable(
              {
                supplierTaxCode: supplierTaxCode,
                supplierName: "",
                supplierCode: "",
              },
              recordId
            );
          }
        }
      },
    });
  };

  return (
    <div className="page-master__table">
      {/*Action control*/}
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys?.filter(Boolean)}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button type="secondary" size="sm" onClick={handleBulkDelete}>
          {translate("CL.delete_btn")}
        </Button>
      </ActionBarComponent>

      <StandardTable
        className="payment-custom_table"
        rowKey={"id"}
        columns={InvoicesOtherDocumentsColumn({
          _truncate,
          translate,
          formatNumberToCurrency,
          handleChangeItemTable,
          handleChangeMultipleItemTable,
          model,
          handleDownloadFileAttached,
          handleDeleteRowConfirm,
          getSupplierOtherDocument,
        })}
        dataSource={[
          ...model.invoicesOtherDocument,
          {
            isTotal: true,
          },
        ]}
        idContainer="invoicesOtherDocument"
        rowClassName="payment-custom_row_table"
        scroll={{ y: "calc(100vh - 320px)" }}
        isDragable={true}
        rowSelection={{
          ...rowSelection,
          getCheckboxProps: (record: CostAllocation) => ({
            disabled: record?.isTotal,
          }),
          renderCell: (value: boolean, record: CostAllocation) => {
            if (record.isTotal) return null;
            return (
              <div className="d-flex justify-content-center align-items-center payment-height_40">
                <Checkbox
                  checked={value}
                  onChange={(e) => {
                    if (e) {
                      setSelectedRowKeys([...selectedRowKeys, record.id]);
                    } else {
                      setSelectedRowKeys(
                        selectedRowKeys.filter((key) => key !== record.id)
                      );
                    }
                  }}
                />
              </div>
            );
          },
        }}
        locale={{
          emptyText: (
            <EmptyDataCM
              message={translate("CM.txt_search_no_data")}
              isFilter
              icon={IcEmptySearchSvg}
              height={500}
            />
          ),
        }}
      />
      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PM.payment_delete_document_title")}
        content={translate("PM.payment_delete_document_content")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleDeleteRow();
        }}
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
      />
      <ModalConfirm
        open={openModalConfirmDeleteAll}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PM.payment_delete_document_title")}
        content={translate("PM.payment_delete_document_content")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => {
          handleBulkDeleteRow();
        }}
        handleCancel={() => setOpenModalConfirmDeleteAll(false)}
      />
    </div>
  );
};

export default InvoicesOtherDocumentTable;
