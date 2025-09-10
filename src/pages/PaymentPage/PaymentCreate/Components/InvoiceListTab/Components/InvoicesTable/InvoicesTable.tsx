import { DeleteRoundIcon, IcEmptySearchSvg } from "assets/icons";
import { listService } from "core/services/page-services/list-service";
import {
  CostAllocation,
  InvoiceModel,
  PaymentCreateModel,
  TYPE_OF_PROPOSAL,
} from "models/Payment";
import EmptyDataCM from "pages/BudgetPage/BudgetMaster/BudgetMasterTab/component/EmptyDataCM";
import { PaymentCreateHookContext } from "pages/PaymentPage/PaymentCreate/PaymentCreateHook";
import React, { useCallback, useContext, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  ModalConfirm,
  StandardTable,
} from "react-components-design-system";
import _truncate from "lodash/truncate";
import InvoicesTableColumn from "../InvoicesTableColumn/InvoicesTableColumn";
import { FieldValue } from "core/services/service-types";
import { RequestAttachment } from "models/CostOwner/BudgetPlan";
import { getFileNameFromUrl, getIcon } from "../../../../Helper/Helper";
// eslint-disable-next-line import/no-unresolved
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

const InvoicesTable = () => {
  const {
    model,
    handleChangeAllField,
    formatNumberToCurrency,
    translate,
    handleDownloadFileAttached,
    endPath,
    typeGroup,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const handleChangeItemTable = (
    fieldName: string,
    value: FieldValue,
    objectValue: FieldValue,
    id: string,
    indexBeforeValidate: number,
    nameError: string
  ) => {
    const invoicesEdit = model?.invoices?.map((item: InvoiceModel) => {
      if (item.id === id) {
        return {
          ...item,
          [fieldName]: objectValue || value,
        };
      }
      return item;
    });

    handleChangeAllField({
      ...model,
      invoices: invoicesEdit,
      errors: {
        ...model.errors,
        [`invoices[${indexBeforeValidate}].${nameError}`]: null,
      },
    });
  };

  const handleChangeMultipleItemTable = (
    data: object,
    id: string,
    indexBeforeValidate: number,
    nameError: string
  ) => {
    const invoicesEdit = model?.invoices?.map((item: InvoiceModel) => {
      if (item.id === id) {
        return {
          ...item,
          ...data,
        };
      }
      return item;
    });
    handleChangeAllField({
      ...model,
      invoices: invoicesEdit,
      errors: {
        ...model.errors,
        [`invoices[${indexBeforeValidate}].${nameError}`]: null,
      },
    });
  };

  const renderIcon = useCallback(
    (
      item: RequestAttachment,
      handleDownloadFileAttached: (file?: FileModel) => void
    ) => {
      return (
        <div onClick={() => handleDownloadFileAttached(item)}>
          <img src={getIcon(item)} alt="img" width={24} height={24} />
        </div>
      );
    },
    []
  );

  const initFileAttached = useCallback(
    (record: InvoiceModel) => {
      const filePdfAttacheds: RequestAttachment[] = [];
      const pdfUrl = record?.pdfUrl;
      const xmlUrl = record?.xmlUrl;
      if (pdfUrl) {
        const pdfName = getFileNameFromUrl(pdfUrl);
        const filePdfAttached: RequestAttachment = {
          name: pdfName,
          contentType: "application/pdf",
          path: pdfUrl,
        };
        filePdfAttacheds.push(filePdfAttached);
      }
      if (xmlUrl) {
        const xmlName = getFileNameFromUrl(xmlUrl);
        const fileXmlAttached: RequestAttachment = {
          name: xmlName,
          contentType: "application/xml",
          path: xmlUrl,
        };
        filePdfAttacheds.push(fileXmlAttached);
      }
      return filePdfAttacheds.filter((item) => item.path);
    },
    [model.invoices]
  );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<InvoiceModel>(
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
    const rowDataEdit = model?.invoices?.filter(
      (item: InvoiceModel) => item.id !== idDelete
    );
    const rowDeleteById = model?.invoices?.filter(
      (item: InvoiceModel) => item.id === idDelete
    );

    const nameErrors =
      rowDeleteById?.length > 0 ? Object.keys(rowDeleteById[0]) : [];
    const indexBeforeValidate =
      rowDeleteById?.length > 0 ? rowDeleteById[0].indexBeforeValidate : null;
    const errors = [...nameErrors, "paymentAmount"]?.reduce(
      (acc: { [key: string]: null }, name) => {
        acc[`invoices[${indexBeforeValidate}].${name}`] = null;
        return acc;
      },
      {}
    );

    handleChangeAllField({
      ...model,
      invoices: rowDataEdit,
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
    const rowsDataEdit = model?.invoices?.filter(
      (item: InvoiceModel) => !selectedRowKeys.includes(item.id)
    );
    const rowDeleteByIds = model?.invoices?.filter((item: InvoiceModel) =>
      selectedRowKeys.includes(item.id)
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
      const nameError = [...nameErrors, "paymentAmount"]?.reduce(
        (acc: { [key: string]: null }, name) => {
          acc[`invoices[${indexBeforeValidate}].${name}`] = null;
          return acc;
        },
        {}
      );
      errors = { ...errors, ...nameError };
    });

    handleChangeAllField({
      ...model,
      invoices: rowsDataEdit,
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
        columns={InvoicesTableColumn({
          _truncate,
          translate,
          formatNumberToCurrency,
          handleChangeItemTable,
          handleChangeMultipleItemTable,
          model,
          renderIcon,
          handleDownloadFileAttached,
          initFileAttached,
          handleDeleteRowConfirm,
          isDisablePaymentAmount:
            Number(typeGroup?.typeGroup) === TYPE_OF_PROPOSAL.ADVANCE ||
            Number(typeGroup?.typeGroup) === TYPE_OF_PROPOSAL.EXPENSE,
        })}
        dataSource={[
          ...model.invoices,
          {
            isTotal: true,
          },
        ]}
        idContainer="invoices"
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
        rowClassName="payment-custom_row_table"
        scroll={{ y: "calc(100vh - 320px)" }}
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
        title={translate("PM.payment_confirm_title_delete_row_invoice")}
        content={translate("PM.payment_confirm_content_delete_row_invoice")}
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
        title={translate("PM.payment_confirm_title_delete_row_invoice")}
        content={translate("PM.payment_confirm_content_delete_row_invoice")}
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

export default InvoicesTable;
