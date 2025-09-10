import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { RowSelectionType } from "antd/lib/table/interface";
import add from "assets/icons/add.svg";
import attached from "assets/icons/attached.svg";
import classNames from "classnames";
import { utilService } from "core/services/common-services/util-service";
import dayjs from "dayjs";
import { RequestAttachment } from "models/CostOwner/BudgetPlan";
import {
  PaymentCreateModel,
  PurchasingDocumentAttachModel,
  PurchasingDocumentsModel,
} from "models/Payment";
import React, { Key, useCallback, useContext, useState } from "react";
import {
  ActionBarComponent,
  BORDER_TYPE,
  Button,
  Checkbox,
  FormItem,
  InputText,
  LayoutCell,
  ModalConfirm,
  Select,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { getIcon } from "../../Helper/Helper";
import { PaymentCreateHookContext } from "../../PaymentCreateHook";
// eslint-disable-next-line import/no-unresolved
import { DeleteRoundIcon, emptyIcon } from "assets/icons";
// eslint-disable-next-line import/no-unresolved
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { paymentRepository } from "../../../PaymentRepository";
// eslint-disable-next-line import/named
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { DESCRIPTION_REGEX } from "core/config/consts";
// eslint-disable-next-line import/named
import { TFunction } from "i18next";
import { isArray, isEmpty, isEqual } from "lodash";
import { AxiosError } from "axios";
import {
  HttpStatusCode,
  NETWORK_ERROR_MESSAGE,
} from "core/services/service-types";
import { UploadFileCustom } from "components";

const DELETE_ICON_SIZE = 24;

const AttachedDocumentsTable = () => {
  const {
    translate,
    model,
    handleChangeSingleField,
    handleDownloadFileAttached,
    setLoading,
    notifyToast,
    handleChangeAllField,
  } = useContext<PaymentCreateModel>(PaymentCreateHookContext);

  const renderIcon = useCallback(
    (item: RequestAttachment) => {
      return (
        <div>
          <div className="payment-relative payment-colorTextLabel"></div>
          <img src={getIcon(item)} alt="img" width={24} height={24} />
        </div>
      );
    },
    [model.PurchasingDocumentsAttach]
  );
  const typeRowSelection: RowSelectionType = "checkbox";
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);
  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: typeRowSelection,
    renderCell: (value: boolean, record: PurchasingDocumentsModel) => {
      return (
        <div className="d-flex justify-content-center align-items-center pt-2 payment-height_40">
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
  };

  const handleAddRow = () => {
    const row = new PurchasingDocumentAttachModel();
    row.id = dayjs().valueOf().toString();
    row.documentTypeId = undefined;
    row.documentType = null;
    row.fileInfo = [];
    row.description = "";

    if (
      isEmpty(model?.PurchasingDocumentsAttach) &&
      model.PurchasingDocumentsAttach?.length > 0
    ) {
      row.indexBeforeValidate = model.PurchasingDocumentsAttach?.length - 1 + 1;
    } else {
      row.indexBeforeValidate = 0;
    }
    const PurchasingDocumentsAttachInit = model.PurchasingDocumentsAttach?.map(
      (item: PurchasingDocumentAttachModel, index: number) => {
        return {
          ...item,
          indexBeforeValidate: index,
        };
      }
    )?.filter(Boolean);
    const data = isArray(PurchasingDocumentsAttachInit)
      ? [...PurchasingDocumentsAttachInit, row]?.filter(Boolean)
      : [row];
    handleChangeSingleField({
      fieldName: "PurchasingDocumentsAttach",
    })(data);
  };

  const handleDeleteRow = () => {
    const rowDataEdit = model?.PurchasingDocumentsAttach?.filter(
      (item: PurchasingDocumentsModel) => item.id !== idDelete
    );
    const rowDeleteById = model?.PurchasingDocumentsAttach?.filter(
      (item: PurchasingDocumentsModel) => item.id === idDelete
    );

    const nameErrors =
      rowDeleteById?.length > 0 ? Object.keys(rowDeleteById[0]) : [];
    const indexBeforeValidate =
      rowDeleteById?.length > 0 ? rowDeleteById[0].indexBeforeValidate : null;
    const errors = nameErrors?.reduce((acc: { [key: string]: null }, name) => {
      acc[`documentGroups[${indexBeforeValidate}].${name}`] = null;
      return acc;
    }, {});

    handleChangeAllField({
      ...model,
      PurchasingDocumentsAttach: rowDataEdit,
      errors: {
        ...model.errors,
        ...errors,
      },
    });
    const ids = selectedRowKeys.filter((id) => id !== idDelete);
    setSelectedRowKeys(ids);
    setIsOpenModelConfirmDeleteRow(false);
  };

  const [idDelete, setIdDelete] = useState("");
  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleUpdateLoadFileDocument = (
    file: File[] | Blob[],
    id: string,
    indexBeforeValidate?: number,
    nameError?: string[]
  ): any => {
    setLoading(true);
    paymentRepository.uploadFileDocument(file).subscribe({
      next: (res: FileModel[] | FileModel) => {
        if (res) {
          const purchasingDocumentsAttachEdit =
            model.PurchasingDocumentsAttach.map((item: any) => {
              if (item.id === id) {
                return {
                  ...item,
                  fileInfo: [...item.fileInfo, ...(res as FileModel[])],
                };
              }
              return item;
            });
          const errors = nameError?.reduce(
            (acc: { [key: string]: null }, name) => {
              acc[`documentGroups[${indexBeforeValidate}].${name}`] = null;
              return acc;
            },
            {}
          );
          handleChangeAllField({
            ...model,
            PurchasingDocumentsAttach: purchasingDocumentsAttachEdit,
            errors: {
              ...model.errors,
              ...errors,
            },
          });
        }
      },
      error: (error) => {
        setLoading(false);
        handleUploadAttachmentError(error);
      },
      complete: () => {
        setLoading(false);
      },
    });
  };

  const handleUploadAttachmentError = (error: AxiosError) => {
    if (
      isEqual(error?.response?.status, HttpStatusCode?.PAYLOAD_TOO_LARGE) ||
      isEqual(error?.message, NETWORK_ERROR_MESSAGE)
    ) {
      notifyToast({
        message: translate("BG.multiple_max_file_size"),
        type: "error",
      });
    } else {
      notifyToast({
        message: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const handleChangeMultipleItemTable = (
    data: object,
    id: string,
    indexBeforeValidate?: number,
    nameError?: string[]
  ) => {
    const purchasingDocumentsAttachEdit = model?.PurchasingDocumentsAttach?.map(
      (item: PurchasingDocumentsModel) => {
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
        acc[`documentGroups[${indexBeforeValidate}].${name}`] = null;
        return acc;
      }, {});

      handleChangeAllField({
        ...model,
        PurchasingDocumentsAttach: purchasingDocumentsAttachEdit,
        errors: {
          ...model.errors,
          ...errors,
        },
      });
    } else {
      handleChangeAllField({
        ...model,
        PurchasingDocumentsAttach: purchasingDocumentsAttachEdit,
      });
    }
  };

  const handleRemoveFile = (fileId: string | number, id: string) => {
    const purchasingDocumentsAttachEdit = model.PurchasingDocumentsAttach.map(
      (item: any) => {
        if (item.id === id) {
          return {
            ...item,
            fileInfo: item.fileInfo.filter(
              (p: any) => p?.systemFileId !== fileId
            ),
          };
        }
        return item;
      }
    );
    handleChangeSingleField({
      fieldName: "PurchasingDocumentsAttach",
    })(purchasingDocumentsAttachEdit);
  };

  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);

  const columns: ColumnProps<PurchasingDocumentAttachModel>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PM.payment_table_attached_document_type_label")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "documentTypeId",
        dataIndex: "documentTypeId",
        width: 250,
        render: (text, record) => (
          <LayoutCell>
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `documentGroups[${record?.indexBeforeValidate}].documentTypeId`
              )}
            >
              <Select
                isRequired
                searchProperty="name"
                searchType=""
                type={1}
                appendToBody={true}
                valueFilter={{
                  name: "",
                }}
                isSmall={true}
                classFilter={undefined}
                isSearch
                onChange={(value, objectValue) => {
                  handleChangeMultipleItemTable(
                    {
                      documentTypeId: value,
                      documentType: objectValue,
                    },
                    record.id,
                    record.indexBeforeValidate,
                    ["documentTypeId"]
                  );
                }}
                getList={paymentRepository.getDocumentTypeList}
                isEnumerable={false}
                render={(t) => t?.name}
                value={
                  model.PurchasingDocumentsAttach.filter(
                    (e: any) => e.documentTypeId === text
                  )[0]?.documentType
                }
                allowClear={false}
              />
            </FormItem>
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PM.payment_table_voucher_attached_label")}
              <span className="text-danger">&nbsp;*</span>
            </label>
          </div>
        ),
        key: "fileInfo",
        dataIndex: "fileInfo",
        ellipsis: true,
        width: 572,
        render: (_, record) => (
          <FormItem
            isTableCell
            validateObject={utilService.getValidateObj(
              model,
              `documentGroups[${record?.indexBeforeValidate}].requestDocuments`
            )}
          >
            <div className="mt-1 px-2 d-flex justify-content-between w-100">
              <div className="payment-custom_grid_9 w-100 payment-gap_x_2">
                {record?.fileInfo?.map((item: any, index: any) => {
                  return (
                    <UploadFile.FileLoadedContent
                      key={index}
                      file={{
                        ...item,
                        id: index,
                        name: item.name,
                      }}
                      onClickFile={() => handleDownloadFileAttached(item)}
                      className={classNames(
                        "file-loaded-item w-100 position-relative payment-custom_grid_9-col_3"
                      )}
                      icon={renderIcon(item)}
                      removeFile={() =>
                        handleRemoveFile(item.systemFileId, record.id)
                      }
                    />
                  );
                })}
              </div>
              <Button className="btn payment-w-30">
                <UploadFileCustom
                  uploadFile={(files) =>
                    handleUpdateLoadFileDocument(
                      files,
                      record.id,
                      record.indexBeforeValidate,
                      ["requestDocuments"]
                    )
                  }
                  type={"link"}
                  className={classNames({
                    "payment-error--icon": !isEmpty(
                      model?.errors?.[
                        `documentGroups[${record?.indexBeforeValidate}].requestDocuments`
                      ]
                    ),
                  })}
                  icon={<img src={attached} alt="" height={18} width={16} />}
                />
              </Button>
            </div>
          </FormItem>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            {translate("PM.payment_table_attached_document_des_label")}
          </div>
        ),
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        width: 500,
        render: (text, record, index) => (
          <LayoutCell>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `documentGroups[${record?.indexBeforeValidate}].description`
              )}
              isTableCell={true}
            >
              <InputText
                className="payment-label_none"
                value={text}
                placeHolder={translate("PM.payment_table_enter_des_label")}
                label={translate("PM.payment_table_des_label")}
                onChange={(value) => {
                  handleChangeMultipleItemTable(
                    {
                      description: value,
                    },
                    record.id,
                    record.indexBeforeValidate,
                    ["description"]
                  );
                }}
                type={BORDER_TYPE.BORDERED}
                isSmall={true}
                regexInput={DESCRIPTION_REGEX}
                maxLength={500}
                translate={translate as TFunction}
                isTableCell={true}
              />
            </FormItem>
          </LayoutCell>
        ),
      },
      {
        title: "",
        key: "action",
        dataIndex: "action",
        width: 40,
        render: (_, record) => (
          <LayoutCell>
            <div className="payment-trash_icon cursor-pointer btn">
              <TrashCan
                size={DELETE_ICON_SIZE}
                onClick={() => handleDeleteRowConfirm(record.id)}
              />
            </div>
          </LayoutCell>
        ),
      },
    ],
    [model, translate]
  );

  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };
  const handleBulkDeleteRow = () => {
    const rowsDataEdit = model?.PurchasingDocumentsAttach?.filter(
      (item: PurchasingDocumentsModel) => !selectedRowKeys.includes(item.id)
    );
    const rowDeleteByIds = model?.PurchasingDocumentsAttach?.filter(
      (item: PurchasingDocumentsModel) => selectedRowKeys.includes(item.id)
    );
    const indexBeforeValidates: number[] = [];
    const nameErrors =
      rowDeleteByIds?.length > 0 ? Object.keys(rowDeleteByIds[0]) : [];
    rowDeleteByIds?.forEach((item: PurchasingDocumentsModel, index: number) => {
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
      PurchasingDocumentsAttach: rowsDataEdit,
      errors: {
        ...model.errors,
        ...errors,
      },
    });
    const ids = selectedRowKeys.filter((id) => !selectedRowKeys.includes(id));
    setSelectedRowKeys(ids);
    setOpenModalConfirmDeleteAll(false);
  };

  return (
    // Attached document for reference
    <div className="pb-1">
      <div className="m-b--2xs">
        {!isEmpty(model?.PurchasingDocumentsAttach) && (
          <Button
            type={"secondary"}
            icon={<img src={add} alt="" width={12} height={12} />}
            iconPlace={"left"}
            onClick={handleAddRow}
          >
            {translate("PM.payment_add_document_button_label")}
          </Button>
        )}
      </div>
      {/*Action control*/}
      <ActionBarComponent
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      >
        <Button type="secondary" size="sm" onClick={handleBulkDelete}>
          {translate("CL.delete_btn")}
        </Button>
      </ActionBarComponent>
      {isEmpty(model?.PurchasingDocumentsAttach) ? (
        <EmptyInitializeTable
          textButton={translate("PM.payment_empty_document_button_label")}
          content={
            <div
              className="invoice-width_content_document_empty"
              dangerouslySetInnerHTML={{
                __html: translate("PM.payment_add_document_content_text"),
              }}
            />
          }
          icon={<img src={emptyIcon} alt="" />}
          onHandleClickAdd={handleAddRow}
        />
      ) : (
        <StandardTable
          rowKey={"id"}
          columns={columns}
          dataSource={model.PurchasingDocumentsAttach}
          isDragable={true}
          rowSelection={rowSelection}
          idContainer="table-id"
          rowClassName="payment-row"
          scroll={{ x: "max-content", y: "calc(100vh - 320px)" }}
          className="payment-row_selection"
        />
      )}

      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("PM.payment_confirm_delete_document_title")}
        content={translate("PM.payment_confirm_delete_document_content")}
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
        title={translate("PM.payment_confirm_delete_document_title")}
        content={translate("PM.payment_confirm_delete_document_content")}
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

export default AttachedDocumentsTable;
