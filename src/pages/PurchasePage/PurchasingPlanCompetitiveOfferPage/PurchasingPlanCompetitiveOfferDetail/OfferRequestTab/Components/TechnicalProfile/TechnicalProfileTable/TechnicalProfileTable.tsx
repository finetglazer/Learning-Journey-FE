import React, { useCallback, useMemo } from "react";
import attached from "assets/icons/attached.svg";
import { ColumnProps } from "antd/lib/table";
import { isEmpty } from "lodash";

import {
  AddIcon,
  emptyCloudIcon,
  TrashIcon,
  TrashRoundIcon,
} from "assets/icons";
import EmptyInitializeTable from "components/EmptyInitializeTable/EmptyInitializeTable";
import { NOT_TAB_ENTER_REGEX, TABLE_ROW_KEY } from "core/config/consts";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  InputNumber,
  InputText,
  LayoutCell,
  ModalConfirm,
  OneLineText,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { useTechnicalProfileTableHook } from "./TechnicalProfileTableHook";

import {
  ColumnKey,
  getValueInModel,
  TechnicalProfile,
} from "models/PurchasingPlan/PurchasingPlanBidder";
import { TechnicalProfileTableProps } from "../TechnicalProfile";
import { utilService } from "core/services/common-services/util-service";
import { UploadFileCustom } from "components";
import classNames from "classnames";
import { NUMBER_MAX_13 } from "config/const";
import { getIconFile } from "core/helpers/common";
import { RequestAttachment } from "models/Proposal";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { FieldValue, GeneralActionEnum } from "core/services/service-types";
import { Attachment } from "models/Attachment";
import ActiveSvg from "assets/icons/CostLine/ic_active.svg";
import DeActiveSvg from "assets/icons/CostLine/ic_deactive.svg";
import { v4 as uuidv4 } from "uuid";
import { childText } from "models/PurchasingPlan/PurchasingPlanConstant";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { formatNumber } from "core/helpers/number";

const columnsWidth = {
  name: 200,
  boolean: 90,
  input_number: 144,
  attachments: 425,
  note: 167,
  action: 40,
};

const TechnicalProfileTable = ({
  isDetail,
  contextValue,
  columnKey = ColumnKey.TECHNICAL_PROFILE,
  columnKeyParent = ColumnKey.TENDER_REQUESTS,
}: TechnicalProfileTableProps) => {
  const {
    model,
    dispatchModel,
    handleDownloadFileAttached,
    handleChangeSingleField,
  } = contextValue;

  const {
    translate,
    isOpenConfirmDeleteModal,
    selectedRowKeys,
    setIsOpenConfirmDeleteModal,
    setSelectedRowKeys,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    rowSelection,
    handleDelete,
  } = useTechnicalProfileTableHook({ ...contextValue, columnKey });

  const columnKeyParentData = useMemo(() => {
    return (
      getValueInModel(getValueInModel(model, columnKeyParent), columnKey) || []
    );
  }, [columnKey, columnKeyParent, model]);

  const handleAddTechProfile = useCallback(() => {
    const newTechnicalProfile = new TechnicalProfile({
      id: `${uuidv4()}${childText}`,
      quotationRequestId: `${model?.[columnKeyParent]?.quotationRequestId}${childText}`,
    });
    const newDataTender = [...columnKeyParentData, newTechnicalProfile];

    dispatchModel({
      type: GeneralActionEnum.UPDATE,
      payload: {
        ...model,
        [columnKeyParent]: {
          ...model?.[columnKeyParent],
          [columnKey]: newDataTender,
        },
      },
    });
  }, [model, columnKeyParentData, dispatchModel, columnKeyParent, columnKey]);

  const renderIcon = useCallback((item: RequestAttachment) => {
    return (
      <div>
        <div className="payment-relative payment-colorTextLabel"></div>
        <img src={getIconFile(item)} alt="img" width={24} height={24} />
      </div>
    );
  }, []);

  const handleChangeItemTable = React.useCallback(
    ({
      fieldName,
      value,
      id,
      fieldError,
    }: {
      fieldName: string;
      value: FieldValue;
      id: string | number;
      fieldError?: string;
    }) => {
      const newDataTender = columnKeyParentData?.map(
        (item: TechnicalProfile) => {
          if (item.id === id) {
            return {
              ...item,
              [fieldName]: value,
            };
          }
          return item;
        }
      );

      dispatchModel({
        type: GeneralActionEnum.UPDATE,
        payload: {
          ...model,
          [columnKeyParent]: {
            ...model?.[columnKeyParent],
            [columnKey]: newDataTender,
          },
          errors: {
            ...model?.errors,
            [`${fieldError}`]: null,
          },
        },
      });
    },
    [columnKeyParentData, dispatchModel, model, columnKeyParent, columnKey]
  );

  const handleRemoveFile = useCallback(
    (
      fileId: string | number,
      idxAttachment: string | number,
      indexTable: number
    ) => {
      const indexRecordTableModel = columnKeyParentData?.findIndex(
        (item: TechnicalProfile, index: number) => index === indexTable
      );

      if (indexRecordTableModel < 0) return;

      const removeFile = columnKeyParentData[
        indexRecordTableModel
      ]?.attachments.filter((item: Attachment, index: number) => {
        return index === idxAttachment ? item?.systemFileId !== fileId : item;
      });

      const newDataTender = [...columnKeyParentData].map((item, index) => {
        return index === indexTable
          ? { ...item, attachments: removeFile }
          : item;
      });

      dispatchModel({
        type: GeneralActionEnum.UPDATE,
        payload: {
          ...model,
          [columnKeyParent]: {
            ...model?.[columnKeyParent],
            [columnKey]: newDataTender,
          },
        },
      });
    },
    [columnKeyParentData, dispatchModel, model, columnKeyParent, columnKey]
  );

  const handleUpdateLoadFileDocument = useCallback(
    (listFile: FileModel[], id: string | number) => {
      const indexRecord = columnKeyParentData?.findIndex(
        (item: TechnicalProfile, index: number) => index === id
      );
      if (indexRecord < 0) return;
      const newFiles = [
        ...(columnKeyParentData[indexRecord]?.attachments || []),
        ...listFile,
      ];

      const newDataTender = [...columnKeyParentData].map((item, index) => {
        return index === indexRecord
          ? { ...item, attachments: newFiles }
          : item;
      });

      dispatchModel({
        type: GeneralActionEnum.UPDATE,
        payload: {
          ...model,
          [columnKeyParent]: {
            ...model?.[columnKeyParent],
            [columnKey]: newDataTender,
          },
        },
      });
    },
    [columnKeyParentData, dispatchModel, model, columnKeyParent, columnKey]
  );

  const columns: ColumnProps<TechnicalProfile>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="">
            {translate("PL.bidding.title.profile_name")}
            {!isDetail && <span className="text-danger">&nbsp;*</span>}
          </div>
        ),
        key: ColumnKey.PROFILE_NAME,
        dataIndex: ColumnKey.PROFILE_NAME,
        ellipsis: true,
        width: columnsWidth.name,
        render: (value, record, index) => {
          return (
            <LayoutCell>
              {isDetail ? (
                <OneLineText value={value} />
              ) : (
                <FormItem
                  isTableCell
                  validateObject={utilService.getValidateObj(
                    model,
                    `${columnKeyParent}.${columnKey}[${record?.indexBeforeValidate}].${ColumnKey.PROFILE_NAME}`
                  )}
                >
                  <InputText
                    isTableCell
                    isRequired
                    placeHolder={translate("PL.plh_file_name")}
                    disabled={isDetail}
                    isSmall={true}
                    value={value}
                    translate={translate}
                    maxLength={255}
                    onChange={(value) =>
                      handleChangeItemTable({
                        value,
                        fieldName: ColumnKey.PROFILE_NAME,
                        id: record?.id,
                        fieldError: `${columnKeyParent}.${columnKey}[${record?.indexBeforeValidate}].${ColumnKey.PROFILE_NAME}`,
                      })
                    }
                  />
                </FormItem>
              )}
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-flex justify-content-center align-center text-nowrap">
            {typeof translate === "function" &&
              translate("PL.bidding.title.is_required")}
          </div>
        ),
        key: ColumnKey.IS_REQUIRED,
        dataIndex: ColumnKey.IS_REQUIRED,
        width: columnsWidth.boolean,
        render: (value, record, index) => {
          return (
            <LayoutCell>
              {isDetail ? (
                <div className="center_table_item">
                  <img src={value ? ActiveSvg : DeActiveSvg} alt="" />
                </div>
              ) : (
                <FormItem
                  isTableCell
                  validateObject={utilService.getValidateObj(
                    model,
                    `${columnKeyParent}.${columnKey}[${index}].${ColumnKey.IS_REQUIRED}`
                  )}
                >
                  <div className="center_table_item">
                    <Checkbox
                      checked={value}
                      disabled={isDetail}
                      onChange={(value) =>
                        handleChangeItemTable({
                          value,
                          fieldName: ColumnKey.IS_REQUIRED,
                          id: record?.id,
                          fieldError: `${columnKeyParent}.${columnKey}[${index}].${ColumnKey.IS_REQUIRED}`,
                        })
                      }
                    />
                  </div>
                </FormItem>
              )}
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-flex justify-content-center text-nowrap">
            {typeof translate === "function" &&
              translate("PL.bidding.title.soft_copy")}
          </div>
        ),
        key: ColumnKey.HAS_SOFT_COPY,
        dataIndex: ColumnKey.HAS_SOFT_COPY,
        width: columnsWidth.boolean,
        render: (value, record, index) => {
          return (
            <LayoutCell>
              {isDetail ? (
                <div className="center_table_item">
                  <img src={value ? ActiveSvg : DeActiveSvg} alt="" />
                </div>
              ) : (
                <FormItem
                  isTableCell
                  validateObject={utilService.getValidateObj(
                    model,
                    `${columnKeyParent}.${columnKey}[${index}].${ColumnKey.HAS_SOFT_COPY}`
                  )}
                >
                  <div className="center_table_item">
                    <Checkbox
                      checked={value}
                      disabled={isDetail}
                      onChange={(value) =>
                        handleChangeItemTable({
                          value,
                          fieldName: ColumnKey.HAS_SOFT_COPY,
                          id: record?.id,
                          fieldError: `${columnKeyParent}.${columnKey}[${index}].${ColumnKey.HAS_SOFT_COPY}`,
                        })
                      }
                    />
                  </div>
                </FormItem>
              )}
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="d-flex justify-content-center text-nowrap">
            {typeof translate === "function" &&
              translate("PL.bidding.title.hard_copy")}
          </div>
        ),
        key: ColumnKey.HAS_HARD_COPY,
        dataIndex: ColumnKey.HAS_HARD_COPY,
        width: columnsWidth.boolean,
        render: (value, record, index) => {
          return (
            <LayoutCell>
              {isDetail ? (
                <div className="center_table_item">
                  <img src={value ? ActiveSvg : DeActiveSvg} alt="" />
                </div>
              ) : (
                <FormItem
                  isTableCell
                  validateObject={utilService.getValidateObj(
                    model,
                    `${columnKeyParent}.${columnKey}[${index}].${ColumnKey.HAS_HARD_COPY}`
                  )}
                >
                  <div className="center_table_item">
                    <Checkbox
                      checked={value}
                      disabled={isDetail}
                      onChange={(value) =>
                        handleChangeItemTable({
                          value,
                          fieldName: ColumnKey.HAS_HARD_COPY,
                          id: record?.id,
                          fieldError: `${columnKeyParent}.${columnKey}[${index}].${ColumnKey.HAS_HARD_COPY}`,
                        })
                      }
                    />
                  </div>
                </FormItem>
              )}
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <div className="">
            {translate("PL.bidding.title.hard_copy_number")}
            {!isDetail && <span className="text-danger">&nbsp;*</span>}
          </div>
        ),
        key: ColumnKey.NUMBER_OF_HARD_COPIES,
        dataIndex: ColumnKey.NUMBER_OF_HARD_COPIES,
        width: columnsWidth.input_number,
        align: isDetail ? "right" : "left",
        render: (value, record, index) => {
          return (
            <LayoutCell position="right">
              {isDetail ? (
                <OneLineText value={formatNumber(value)} />
              ) : (
                <FormItem
                  isTableCell
                  validateObject={utilService.getValidateObj(
                    model,
                    `${columnKeyParent}.${columnKey}[${index}].${ColumnKey.NUMBER_OF_HARD_COPIES}`
                  )}
                >
                  <InputNumber
                    placeHolder={translate("CT.placeholder_enter_quantity")}
                    value={value}
                    isSmall={true}
                    disabled={isDetail || !record.hasHardCopy}
                    max={NUMBER_MAX_13}
                    onChange={(value) =>
                      handleChangeItemTable({
                        value,
                        fieldName: ColumnKey.NUMBER_OF_HARD_COPIES,
                        id: record?.id,
                        fieldError: `${columnKeyParent}.${columnKey}[${index}].${ColumnKey.NUMBER_OF_HARD_COPIES}`,
                      })
                    }
                  />
                </FormItem>
              )}
            </LayoutCell>
          );
        },
      },
      {
        title: translate("PL.review_summary.attach_files"),
        key: ColumnKey.ATTACHMENTS,
        dataIndex: ColumnKey.ATTACHMENTS,
        ellipsis: true,
        width: columnsWidth.attachments,
        render: (_, record, index) => {
          return (
            <FormItem
              isTableCell
              validateObject={utilService.getValidateObj(
                model,
                `${columnKeyParent}.${columnKey}[${index}].${ColumnKey.ATTACHMENTS}`
              )}
            >
              <div className="d-flex justify-content-between align-center w-100 m-t--3xs">
                <div className="technical-profile-custom_grid_12 w-100 technical-profile-gap_x_1">
                  {record?.attachments?.map(
                    (item: Attachment, idxAttachment: number) => {
                      return (
                        <UploadFile.FileLoadedContent
                          key={idxAttachment}
                          file={{
                            ...item,
                            id: idxAttachment,
                            name: item.name,
                          }}
                          onClickFile={() => handleDownloadFileAttached(item)}
                          className={classNames(
                            "file-in-table technical-profile-custom_grid_12-col_6"
                          )}
                          isSmall={true}
                          isViewMode={isDetail}
                          icon={renderIcon(item)}
                          removeFile={() =>
                            handleRemoveFile(
                              item.systemFileId,
                              idxAttachment,
                              index
                            )
                          }
                        />
                      );
                    }
                  )}
                </div>
                {!isDetail && (
                  <Button className={classNames("btn btn-attachment")}>
                    <UploadFileCustom
                      className="paper-clip"
                      uploadFile={proposalRepository.uploadFileDocument}
                      updateList={(listFile: FileModel[]) => {
                        handleUpdateLoadFileDocument(listFile, index);
                      }}
                      type={"link"}
                      icon={
                        <img src={attached} alt="" height={18} width={16} />
                      }
                    />
                  </Button>
                )}
              </div>
            </FormItem>
          );
        },
      },
      {
        title: translate("PL.txt_note"),
        key: ColumnKey.NOTE,
        dataIndex: ColumnKey.NOTE,
        ellipsis: true,
        width: columnsWidth.note,
        render: (value, record, index) => {
          return (
            <LayoutCell>
              {isDetail ? (
                <OneLineText value={value} />
              ) : (
                <FormItem
                  isTableCell
                  validateObject={utilService.getValidateObj(
                    model,
                    `${columnKeyParent}.${columnKey}[${index}].${ColumnKey.NOTE}`
                  )}
                >
                  <InputText
                    isTableCell
                    placeHolder={translate("PL.plh_note")}
                    disabled={isDetail}
                    isSmall={true}
                    value={value}
                    translate={translate}
                    maxLength={255}
                    regexInput={NOT_TAB_ENTER_REGEX}
                    onChange={(value) =>
                      handleChangeItemTable({
                        value,
                        fieldName: ColumnKey.NOTE,
                        id: record?.id,
                        fieldError: `${columnKeyParent}.${columnKey}[${index}].${ColumnKey.NOTE}`,
                      })
                    }
                  />
                </FormItem>
              )}
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        width: isDetail ? 1 : columnsWidth.action,
        render: (_, record) =>
          !isDetail && (
            <LayoutCell position="center">
              <Button
                className={"delete-row-btn"}
                onClick={() => handleOpenDeleteModal(record?.id)}
              >
                <TrashIcon fillColor="#C03629" />
              </Button>
            </LayoutCell>
          ),
      },
    ],
    [
      columnKey,
      handleChangeItemTable,
      handleDownloadFileAttached,
      handleOpenDeleteModal,
      handleRemoveFile,
      handleUpdateLoadFileDocument,
      isDetail,
      model,
      renderIcon,
      translate,
    ]
  );

  return (
    <div className={"technical-profile-table"}>
      {!isDetail && !isEmpty(columnKeyParentData) && (
        <div className="p-b--xs">
          <Button
            icon={<img src={AddIcon} alt="img" width={14} height={14} />}
            iconPlace="left"
            type="secondary"
            onClick={handleAddTechProfile}
          >
            {translate("PL.bidding.button.add_profile")}
          </Button>
        </div>
      )}

      {isEmpty(columnKeyParentData) ? (
        isDetail ? (
          <EmptyItemTable
            icon={<img src={emptyCloudIcon} alt="" />}
            content={translate("CM.empty.no_data_recorded")}
          />
        ) : (
          <EmptyInitializeTable
            disableButton={isDetail}
            textButton={translate("PL.bidding.button.add_profile")}
            content={
              <div className="text-break-line">
                {translate("PL.bidding.title.add_new_data")}
              </div>
            }
            icon={<img src={emptyCloudIcon} alt="" />}
            onHandleClickAdd={handleAddTechProfile}
          />
        )
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
            dataSource={columnKeyParentData}
            rowSelection={isDetail ? null : rowSelection}
            scroll={{ y: "calc(100vh - 320px)" }}
            className="cost-allocation-row_selection"
            rowClassName="payment-row"
          />
        </>
      )}

      <ModalConfirm
        open={isOpenConfirmDeleteModal}
        loading={false}
        maskClosable={false}
        icon={<img src={TrashRoundIcon} alt="Trash icon" />}
        title={translate("PL.txt_confirm_delete_document_title")}
        content={translate("PL.txt_confirm_delete_document_content")}
        titleButtonApply={translate("CM.btn_confirm")}
        titleButtonCancel={translate("CM.btn_close")}
        handleCancel={handleCloseDeleteModal}
        handleSave={handleDelete}
      />
    </div>
  );
};

export default TechnicalProfileTable;
