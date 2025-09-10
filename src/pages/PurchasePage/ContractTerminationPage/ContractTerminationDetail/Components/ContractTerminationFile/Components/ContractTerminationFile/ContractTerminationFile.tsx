/* eslint-disable import/no-unresolved */
import { Add } from "@carbon/icons-react";
import { Key, RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon, emptyCloudIcon } from "assets/icons";
import { indexOf, isEmpty } from "lodash";
import { ContractTerminationContextModel } from "models/ContractTermination";
import { ContractTerminationDetailHookContext } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationDetail/ContractTerminationDetailHook";
import { useContext, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  ModalConfirm,
  StandardTable,
} from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { useTranslation } from "react-i18next";
import EmptyData from "./EmptyData";
import { columns } from "./helper";
import { v4 as uuidv4 } from "uuid";

export class RequestAttachment implements FileModel {
  public systemFileId?: string;
  public name?: string;
  public size?: number;
  public type?: string;
  public lastModified?: number;
}

export interface ContractTerminationFile {
  id?: string;
  attachments?: RequestAttachment[];
  note?: string;
  uploadedDate?: string;
}

const ContractTerminationFile = () => {
  const [translate] = useTranslation();
  const {
    model,
    setLoading,
    handleUploadFileError,
    handleChangeSingleField,
    handleDownloadFileAttached,
    handleChangeAllField,
  } = useContext<ContractTerminationContextModel>(
    ContractTerminationDetailHookContext
  );

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);

  const [idDelete, setIdDelete] = useState("");

  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);

  const handleAddNewContractFile = () => {
    const newContractFile: ContractTerminationFile = {
      id: uuidv4(),
      attachments: [],
    };
    handleChangeSingleField({ fieldName: "contractFiles" })([
      ...(model?.contractFiles ?? []),
      newContractFile,
    ]);
  };

  const handleBulkDelete = () => {
    setOpenModalConfirmDeleteAll(true);
  };

  const handleBulkDeleteRow = () => {
    const contractFiles = model.contractFiles.filter(
      (item: ContractTerminationFile) => !selectedRowKeys.includes(item.id)
    );

    const indexOfDeletedFiles = model?.contractFiles
      .filter((item: ContractTerminationFile) =>
        selectedRowKeys.includes(item.id)
      )
      .map((item: ContractTerminationFile) =>
        indexOf(model.contractFiles, item)
      );

    const errors = indexOfDeletedFiles.reduce(
      (acc: { [key: string]: string }, index: number) => {
        acc[`contractFiles[${index}].note`] = undefined;
        acc[`contractFiles[${index}].attachments`] = undefined;
        return acc;
      },
      {}
    );

    handleChangeAllField({
      ...model,
      contractFiles: contractFiles,
      errors: { ...model?.errors, ...errors },
    });

    setSelectedRowKeys([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const contractFiles = model.contractFiles.filter(
      (item: ContractTerminationFile) => item.id !== idDelete
    );

    const indexOfDeletedFile = model?.contractFiles?.findIndex(
      (item: ContractTerminationFile) => item.id === idDelete
    );

    handleChangeAllField({
      ...model,
      contractFiles: contractFiles,
      errors: {
        ...model?.errors,
        [`contractFiles[${indexOfDeletedFile}].note`]: undefined,
        [`contractFiles[${indexOfDeletedFile}].attachments`]: undefined,
      },
    });

    if (selectedRowKeys.includes(idDelete)) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== idDelete));
    }
    setIsOpenModelConfirmDeleteRow(false);
  };

  const rowSelection = {
    onChange(selectedKeys: Key[]) {
      setSelectedRowKeys(selectedKeys);
    },
    selectedRowKeys,
    type: "checkbox" as RowSelectionType,
    renderCell: (value: boolean, record: ContractTerminationFile) => {
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

  return (
    <div>
      {isEmpty(model?.contractFiles) ? (
        <EmptyData
          icon={emptyCloudIcon}
          message={translate(
            "contractTermination.contract_termination_empty_title"
          )}
          titleButton={translate(
            "contractTermination.contract_termination_add_document"
          )}
          action={handleAddNewContractFile}
        />
      ) : (
        <div style={{ height: "calc(100vh - 240px)" }}>
          <Button
            icon={<Add />}
            iconPlace="left"
            type="secondary"
            className="mb-2"
            onClick={handleAddNewContractFile}
          >
            {translate("contractTermination.contract_termination_add_document")}
          </Button>
          <ActionBarComponent
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
          >
            <div style={{ width: "120px" }}>
              <Button
                className="w-100"
                type="secondary"
                size="sm"
                onClick={handleBulkDelete}
              >
                {translate("contractTermination.btn_delete")}
              </Button>
            </div>
          </ActionBarComponent>
          <StandardTable
            rowKey={"id"}
            columns={columns({
              translate,
              model,
              setLoading,
              handleChangeSingleField,
              handleDownloadFileAttached,
              handleUploadFileError,
              handleDeleteRowConfirm,
            })}
            dataSource={model.contractFiles}
            rowSelection={rowSelection}
            idContainer="table-id"
            rowClassName="payment-row"
            scroll={{ x: "max-content", y: "calc(100vh - 320px)" }}
            className="cost-allocation-row_selection row-height-64px"
          />
        </div>
      )}

      <ModalConfirm
        open={isOpenModelConfirmDeleteRow}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
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
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
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
  );
};

export default ContractTerminationFile;
