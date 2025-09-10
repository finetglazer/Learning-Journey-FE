/* eslint-disable import/no-unresolved */
import React, { Key, useContext, useState } from "react";
import "./Base.scss";
import { DeleteRoundIcon, IcArrowDown } from "assets/icons";
import { useTranslation } from "react-i18next";
import {
  ProposalCreateModel,
  ProposalReferences,
  RequestAttachment,
} from "models/Proposal";
import { ProposalCreateHookContext } from "pages/PurchasePage/ProposalPage/ProposalCreate/ProposalCreateHook";
import classNames from "classnames";
import { isEmpty } from "lodash";
import EmptyData from "./EmptyData";
import { RowSelectionType } from "antd/lib/table/interface";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  FormItem,
  InputText,
  LayoutCell,
  ModalConfirm,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { Add, TrashCan } from "@carbon/icons-react";
import { utilService } from "core/services/common-services/util-service";
import { ColumnProps } from "antd/lib/table";
import attached from "assets/icons/attached.svg";
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { proposalRepository } from "pages/PurchasePage/ProposalPage/ProposalRepository";
import { getIconFile } from "core/helpers/common";
import { FieldValue } from "core/services/service-types";
import BaseDetail from "pages/PurchasePage/ProposalPage/ProposalDetail/Components/BaseDetail/BaseDetail";
import { UploadFileCustom } from "components";

const Base = () => {
  const [translate] = useTranslation();
  const [collapse, setCollapse] = useState<boolean>(true);
  const {
    model,
    setLoading,
    handleChangeSingleField,
    handleDownloadFileAttached,
    handleAddNewBasis,
    handleUploadAttachmentError,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const typeRowSelection: RowSelectionType = "checkbox";
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: typeRowSelection,
    renderCell: (value: boolean, record: ProposalReferences) => {
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

  const handleDeleteRow = () => {
    const proposalReferencesEdit = model.proposalReferences.filter(
      (item: ProposalReferences) => item.id !== idDelete
    );
    handleChangeSingleField({
      fieldName: "proposalReferences",
    })(proposalReferencesEdit);
    if (selectedRowKeys.includes(idDelete)) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== idDelete));
    }
    setIsOpenModelConfirmDeleteRow(false);
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const handleBulkDeleteRow = () => {
    const proposalReferencesEdit = model.proposalReferences.filter(
      (item: ProposalReferences) => !selectedRowKeys.includes(item.id)
    );
    handleChangeSingleField({
      fieldName: "proposalReferences",
    })(proposalReferencesEdit);
    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const handleRemoveFile = (fileId: string | number, id: string) => {
    const proposalReferencesEdit = model.proposalReferences.map(
      (item: ProposalReferences) => {
        if (item.id === id) {
          return {
            ...item,
            attachments: item.attachments.filter(
              (p: RequestAttachment) => p?.systemFileId !== fileId
            ),
          };
        }
        return item;
      }
    );
    handleChangeSingleField({
      fieldName: "proposalReferences",
    })(proposalReferencesEdit);
  };

  const handleUpdateLoadFileDocument = (listFile: FileModel[], id: string) => {
    const proposalReferencesEdit = model.proposalReferences.map(
      (item: ProposalReferences) => {
        if (item.id === id) {
          return {
            ...item,
            attachments: [...(item?.attachments || []), ...listFile],
          };
        }
        return item;
      }
    );
    handleChangeSingleField({
      fieldName: "proposalReferences",
    })(proposalReferencesEdit);
  };
  const handleChangeItemTable = (
    fieldName: string,
    value: FieldValue,
    objectValue: FieldValue,
    id: string
  ) => {
    const proposalReferencesEdit = model.proposalReferences.map(
      (item: ProposalReferences) => {
        if (item.id === id) {
          return {
            ...item,
            [fieldName]: objectValue || value,
          };
        }
        return item;
      }
    );
    handleChangeSingleField({
      fieldName: "proposalReferences",
    })(proposalReferencesEdit);
  };

  const columns: ColumnProps<ProposalReferences>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="payment-font-14">
            {translate("PP.document_description")}
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
                `documentGroups[${index}].description`
              )}
            >
              <InputText
                value={record?.description}
                placeHolder={translate("PP.document_description")}
                onChange={(e) => {
                  handleChangeItemTable("description", e, null, record.id);
                }}
                isSmall={true}
              />
            </FormItem>
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <div className="payment-font-14">
            <label className={classNames("component__title")}>
              {translate("PP.attach")}
            </label>
          </div>
        ),
        key: "requestAttachment",
        dataIndex: "requestAttachment",
        ellipsis: true,
        width: 572,
        render: (_, record, index) => (
          <FormItem
            validateObject={utilService.getValidateObj(
              model,
              isEmpty(record?.attachments)
                ? `documentGroups[${index}].attachments`
                : null
            )}
          >
            <div className="mt-1 px-2 d-flex justify-content-between w-100 align-items-center">
              <div className="payment-custom_grid_9 w-100 payment-gap_x_2">
                {record?.attachments?.map(
                  (item: RequestAttachment, index: number) => {
                    return (
                      <UploadFile.FileLoadedContent
                        key={index}
                        file={{
                          ...item,
                          name: item.name,
                        }}
                        onClickFile={() => handleDownloadFileAttached(item)}
                        className={classNames(
                          "file-loaded-item w-100 position-relative payment-custom_grid_9-col_3"
                        )}
                        icon={
                          <img
                            src={getIconFile(item)}
                            alt="img"
                            width={24}
                            height={24}
                          />
                        }
                        removeFile={() =>
                          handleRemoveFile(item.systemFileId, record.id)
                        }
                      />
                    );
                  }
                )}
              </div>
              <Button className="btn payment-w-30">
                <UploadFileCustom
                  uploadFile={proposalRepository.uploadFileDocument}
                  updateList={(listFile: FileModel[]) => {
                    handleUpdateLoadFileDocument(listFile, record.id);
                  }}
                  type={"link"}
                  icon={<img src={attached} alt="" height={18} width={16} />}
                  maximumSize={999999999999999}
                  onUploadError={handleUploadAttachmentError}
                  setListFileLoading={(res) => {
                    setLoading(!isEmpty(res));
                  }}
                />
              </Button>
            </div>
          </FormItem>
        ),
      },
      {
        title: "",
        key: "action",
        dataIndex: "action",
        width: 40,
        render: (_, record, index) => (
          <LayoutCell>
            <div className="payment-red cursor-pointer btn">
              <TrashCan
                size={20}
                onClick={() => handleDeleteRowConfirm(record.id)}
              />
            </div>
          </LayoutCell>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model, translate]
  );

  if (model?.isDetail) return <BaseDetail />;

  return (
    <div className="base_wrapper">
      <div className="header" onClick={handleChangeCollapse}>
        <div className="title">{translate("PP.base")}</div>
        <div onClick={handleChangeCollapse}>
          <img
            className={classNames("cursor-pointer", {
              "rotate-180": collapse,
              "rotate-0": !collapse,
            })}
            src={IcArrowDown}
            alt="img"
            width={16}
            height={16}
          />
        </div>
      </div>
      {collapse && (
        <div className="body">
          {isEmpty(model?.proposalReferences) ? (
            <EmptyData />
          ) : (
            <div>
              <Button
                icon={<Add />}
                iconPlace="left"
                type="secondary"
                className="mb-2"
                onClick={handleAddNewBasis}
              >
                {translate("PP.add_basis")}
              </Button>
              <ActionBarComponent
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
              >
                <Button type="secondary" size="sm" onClick={handleBulkDelete}>
                  {translate("CL.delete_btn")}
                </Button>
              </ActionBarComponent>
              <StandardTable
                rowKey={"id"}
                columns={columns}
                dataSource={model.proposalReferences}
                isDragable={true}
                rowSelection={rowSelection}
                idContainer="table-id"
                rowClassName="cost-allocation-row"
                scroll={{ y: "calc(100vh - 320px)" }}
                className="cost-allocation-row_selection row-height-64px"
              />
              <ModalConfirm
                open={isOpenModelConfirmDeleteRow}
                icon={
                  <img src={DeleteRoundIcon} alt="img" width={72} height={72} />
                }
                title={translate("PP.confirm_delete_base")}
                content={translate("PP.delete_base_warning")}
                titleButtonCancel={translate("PM.cancel_btn_label")}
                titleButtonApply={translate("PM.confirm_btn_label")}
                handleSave={() => {
                  handleDeleteRow();
                }}
                handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
              />
              <ModalConfirm
                open={openModalConfirmDeleteAll}
                icon={
                  <img src={DeleteRoundIcon} alt="img" width={72} height={72} />
                }
                title={translate("PP.confirm_delete_base")}
                content={translate("PP.delete_base_warning")}
                titleButtonCancel={translate("PM.cancel_btn_label")}
                titleButtonApply={translate("PM.confirm_btn_label")}
                handleSave={() => {
                  handleBulkDeleteRow();
                }}
                handleCancel={() => setOpenModalConfirmDeleteAll(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Base;
