/* eslint-disable import/no-unresolved */
import { Add } from "@carbon/icons-react";
import { Key, RowSelectionType } from "antd/lib/table/interface";
import { DeleteRoundIcon } from "assets/icons";
import { indexOf, isEmpty } from "lodash";
import { ContractFile } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import React, { useContext, useState } from "react";
import {
  ActionBarComponent,
  Button,
  Checkbox,
  ModalConfirm,
  StandardTable,
} from "react-components-design-system";
import "./ContractFile.scss";
import EmptyData from "./EmptyData";
import { columns } from "./helper";

const ContractFileComponent = () => {
  const {
    model,
    setLoading,
    handleUploadFileError,
    handleChangeSingleField,
    handleDownloadFile,
    handleChangeAllField,
  } = useContext(ContractDetailHookContext);

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);

  const [translate] = useTranslationContract();

  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);

  const [idDelete, setIdDelete] = useState("");

  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);

  const handleAddNewContractFile = () => {
    const newContractFile: ContractFile = {
      id: Date.now().toString(),
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
      (item: ContractFile) => !selectedRowKeys.includes(item.id)
    );

    const indexOfDeletedFiles = model?.contractFiles
      .filter((item: ContractFile) => selectedRowKeys.includes(item.id))
      .map((item) => indexOf(model.contractFiles, item));

    const errors = indexOfDeletedFiles.reduce(
      (acc: { [key: string]: string }, index) => {
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
      (item: ContractFile) => item.id !== idDelete
    );

    const indexOfDeletedFile = model?.contractFiles?.findIndex(
      (item) => item.id === idDelete
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
    renderCell: (value: boolean, record: ContractFile) => {
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
    <div className="pt_contract_file_wrapper">
      {isEmpty(model?.contractFiles) ? (
        <EmptyData addNew={handleAddNewContractFile} />
      ) : (
        <div>
          <Button
            icon={<Add />}
            iconPlace="left"
            type="secondary"
            className="mb-2"
            onClick={handleAddNewContractFile}
          >
            {translate("CT.contract_file.add_contract")}
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
            columns={columns({
              translate,
              model,
              setLoading,
              handleChangeSingleField,
              handleDownloadFileAttached: handleDownloadFile,
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

export default ContractFileComponent;
