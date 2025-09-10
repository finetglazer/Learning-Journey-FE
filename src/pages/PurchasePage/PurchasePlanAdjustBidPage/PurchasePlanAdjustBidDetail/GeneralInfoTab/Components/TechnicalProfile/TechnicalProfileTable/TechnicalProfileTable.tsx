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
import { TABLE_ROW_KEY } from "core/config/consts";
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
  const { model, dispatchModel, handleDownloadFileAttached } = contextValue;

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

  const handleDispatchModel = useCallback(
    (newDataTender: FieldValue) => {
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
    [columnKey, columnKeyParent, dispatchModel, model]
  );

  const handleAddTechProfile = useCallback(() => {
    const newTechnicalProfile = new TechnicalProfile({
      id: `${uuidv4()}${childText}`,
      quotationRequestId: `${model?.[columnKeyParent]?.quotationRequestId}${childText}`,
    });
    const newDataTender = [...columnKeyParentData, newTechnicalProfile];

    handleDispatchModel(newDataTender);
  }, [model, columnKeyParent, columnKeyParentData, handleDispatchModel]);

  const renderIcon = useCallback((item: RequestAttachment) => {
    return (
      <div>
        <div className="payment-relative payment-colorTextLabel"></div>
        <img src={getIconFile(item)} alt="img" width={24} height={24} />
      </div>
    );
  }, []);

  const handleChangeItemTable = useCallback(
    ({
      fieldName,
      value,
      id,
      isInput = false,
    }: {
      fieldName: string;
      value: FieldValue;
      id: string | number;
      isInput?: boolean;
    }) => {
      const newDataTender = columnKeyParentData?.map(
        (item: TechnicalProfile, index: number) => {
          const record = {
            [fieldName]: value,
          };
          if (fieldName === ColumnKey.HAS_HARD_COPY && value === false) {
            Object.assign(record, {
              numberOfHardCopies: null,
            });
          }
          return index === id ? { ...item, ...record } : item;
        }
      );

      if (isInput) {
        const findDataInput = columnKeyParentData?.find(
          (_: TechnicalProfile, index: number) => index === id
        );
        findDataInput[fieldName] = value;
        return;
      }

      handleDispatchModel(newDataTender);
    },
    [columnKeyParentData, handleDispatchModel]
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

      handleDispatchModel(newDataTender);
    },
    [columnKeyParentData, handleDispatchModel]
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

      handleDispatchModel(newDataTender);
    },
    [columnKeyParentData, handleDispatchModel]
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
                    `${columnKeyParent}.${columnKey}[${index}].${ColumnKey.PROFILE_NAME}`
                  )}
                >
                  <InputText
                    isTableCell
                    placeHolder={translate("PL.plh_file_name")}
                    disabled={isDetail}
                    isSmall={true}
                    value={value}
                    translate={translate}
                    maxLength={500}
                    onChange={(value) =>
                      handleChangeItemTable({
                        value,
                        fieldName: ColumnKey.PROFILE_NAME,
                        id: index,
                        isInput: true,
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
          <div className="d-flex justify-content-center text-nowrap">
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
                          id: index,
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
                          id: index,
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
                          id: index,
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
                <OneLineText value={value} />
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
                    readOnly={!record.hasHardCopy}
                    disabled={isDetail}
                    max={NUMBER_MAX_13}
                    onChange={(value) =>
                      handleChangeItemTable({
                        value,
                        fieldName: ColumnKey.NUMBER_OF_HARD_COPIES,
                        id: index,
                        isInput: true,
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
              <div className="d-flex justify-content-between align-baseline w-100 mt-2">
                <div className="payment-custom_grid_12 w-100 payment-gap_x_1">
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
                            "file-in-table payment-custom_grid_12-col_6"
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
                    maxLength={500}
                    onChange={(value) =>
                      handleChangeItemTable({
                        value,
                        fieldName: ColumnKey.NOTE,
                        id: index,
                        isInput: true,
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
      columnKeyParent,
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
        <FormItem
          validateObject={utilService.getValidateObj(
            model,
            `${columnKeyParent}.${columnKey}`
          )}
        >
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
            rowKey={TABLE_ROW_KEY}
            columns={columns}
            dataSource={columnKeyParentData}
            rowSelection={isDetail ? null : rowSelection}
            scroll={{ y: "calc(100vh - 320px)" }}
          />
        </>
      )}

      <ModalConfirm
        open={isOpenConfirmDeleteModal}
        loading={false}
        maskClosable={false}
        icon={<img src={TrashRoundIcon} alt="Trash icon" />}
        title={translate("PL.bidding.title.profile_confirm_delete_title")}
        content={translate("PL.bidding.title.profile_confirm_delete_content")}
        titleButtonApply={translate("CM.btn_confirm")}
        titleButtonCancel={translate("CM.btn_close")}
        handleCancel={handleCloseDeleteModal}
        handleSave={handleDelete}
      />
    </div>
  );
};

export default TechnicalProfileTable;
