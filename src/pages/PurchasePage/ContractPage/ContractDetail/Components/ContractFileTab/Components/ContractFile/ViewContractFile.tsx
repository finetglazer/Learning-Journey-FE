import { Add } from "@carbon/icons-react";
import { ContractFile, ContractStatus } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";
import { useContext, useState } from "react";
import { Button, StandardTable } from "react-components-design-system";
import ModalUploadFile from "../ModalUploadFile/ModalUploadFile";
import { UploadFileType } from "../ModalUploadFile/helper";
import { ViewFilesColumns } from "./helper";

const ViewContractFiles = () => {
  const [translate] = useTranslationContract();

  const { model, handleDownloadFile, handleUploadFileToContract } = useContext(
    ContractDetailHookContext
  );

  const [openModalUploadFile, setModalOpenUploadFile] = useState(false);

  const onPressSaveFromModal = (dataFromModal: UploadFileType) => {
    const newContractFile: ContractFile = {
      attachments: dataFromModal?.listFile,
      note: dataFromModal?.note,
    };
    handleUploadFileToContract(newContractFile);
  };

  const isShowButtonAdd = model?.status === ContractStatus.APPROVED;

  return (
    <div className="pt_contract_file_wrapper">
      {isShowButtonAdd && (
        <Button
          icon={<Add />}
          iconPlace="left"
          type="secondary"
          className="mb-2"
          onClick={() => setModalOpenUploadFile(true)}
        >
          {translate("CT.contract_file.add_contract")}
        </Button>
      )}
      <StandardTable
        columns={ViewFilesColumns({
          translate,
          handleDownloadFileAttached: handleDownloadFile,
        })}
        dataSource={model?.contractFiles ?? []}
        scroll={{ y: "calc(100vh - 360px)" }}
        rowClassName="payment-row"
      />
      {openModalUploadFile && (
        <ModalUploadFile
          open={openModalUploadFile}
          handleCancel={() => {
            setModalOpenUploadFile(false);
          }}
          onPressSave={onPressSaveFromModal}
        />
      )}
    </div>
  );
};

export default ViewContractFiles;
